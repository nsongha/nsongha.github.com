const { PrismaClient } = require('@prisma/client');
const vnpayService = require('../services/vnpayService');
const momoService = require('../services/momoService');

const prisma = new PrismaClient();

/**
 * Payment Controller
 * Handles payment processing with VNPay and Momo
 */

// Create payment (initiate payment flow)
const createPayment = async (req, res) => {
  try {
    const { bookingId, method } = req.body; // method: 'vnpay' or 'momo'
    const userId = req.user.id;

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        venue: true,
        court: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Booking already paid' });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount: booking.finalPrice,
        method,
        status: 'pending'
      }
    });

    // Get client IP
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';

    // Generate payment URL based on method
    let paymentUrl;
    let additionalData = {};

    if (method === 'vnpay') {
      const orderInfo = `Đặt sân ${booking.venue.name} - ${booking.bookingDate.toLocaleDateString()} ${booking.startTime}`;

      paymentUrl = vnpayService.createPaymentUrl({
        amount: booking.finalPrice,
        orderInfo,
        orderId: payment.id,
        ipAddr
      });
    } else if (method === 'momo') {
      const orderInfo = `SportMatch - Sân ${booking.venue.name}`;

      const momoResult = await momoService.createPayment({
        amount: booking.finalPrice,
        orderInfo,
        orderId: payment.id,
        extraData: JSON.stringify({ bookingId })
      });

      if (!momoResult.success) {
        return res.status(400).json({
          error: 'Failed to create Momo payment',
          message: momoResult.error
        });
      }

      paymentUrl = momoResult.payUrl;
      additionalData.deeplink = momoResult.deeplink;
      additionalData.qrCodeUrl = momoResult.qrCodeUrl;
    } else {
      return res.status(400).json({
        error: 'Invalid payment method',
        message: 'Supported methods: vnpay, momo'
      });
    }

    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        method: payment.method
      },
      paymentUrl,
      ...additionalData
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      error: 'Failed to create payment',
      message: error.message
    });
  }
};

// VNPay callback handler
const vnpayCallback = async (req, res) => {
  try {
    const vnpParams = req.query;

    // Verify callback
    const verification = vnpayService.verifyCallback(vnpParams);

    if (!verification.valid) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=invalid_signature`);
    }

    const paymentId = verification.orderId;
    const isSuccess = vnpayService.isSuccess(verification.responseCode);

    // Update payment record
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: isSuccess ? 'success' : 'failed',
        transactionId: verification.transactionNo,
        gatewayResponse: vnpParams
      },
      include: { booking: true }
    });

    // Update booking if payment successful
    if (isSuccess) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: 'paid',
          status: 'confirmed'
        }
      });

      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?bookingId=${payment.bookingId}`);
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?bookingId=${payment.bookingId}`);
  } catch (error) {
    console.error('VNPay callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=error`);
  }
};

// VNPay IPN (Instant Payment Notification)
const vnpayIPN = async (req, res) => {
  try {
    const vnpParams = req.query;

    const verification = vnpayService.verifyCallback(vnpParams);

    if (!verification.valid) {
      return res.json({ RspCode: '97', Message: 'Invalid signature' });
    }

    const paymentId = verification.orderId;

    // Check if payment exists
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      return res.json({ RspCode: '01', Message: 'Order not found' });
    }

    if (payment.status === 'success') {
      return res.json({ RspCode: '02', Message: 'Order already confirmed' });
    }

    const isSuccess = vnpayService.isSuccess(verification.responseCode);

    // Update payment and booking
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: isSuccess ? 'success' : 'failed',
        transactionId: verification.transactionNo,
        gatewayResponse: vnpParams
      }
    });

    if (isSuccess) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: 'paid',
          status: 'confirmed'
        }
      });
    }

    res.json({ RspCode: '00', Message: 'success' });
  } catch (error) {
    console.error('VNPay IPN error:', error);
    res.json({ RspCode: '99', Message: 'Unknown error' });
  }
};

// Momo callback handler
const momoCallback = async (req, res) => {
  try {
    const momoParams = req.query;

    const paymentId = momoParams.orderId;
    const resultCode = parseInt(momoParams.resultCode);
    const isSuccess = resultCode === 0;

    // Update payment
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: isSuccess ? 'success' : 'failed',
        transactionId: momoParams.transId,
        gatewayResponse: momoParams
      }
    });

    // Update booking
    if (isSuccess) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: 'paid',
          status: 'confirmed'
        }
      });

      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?bookingId=${payment.bookingId}`);
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?bookingId=${payment.bookingId}`);
  } catch (error) {
    console.error('Momo callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=error`);
  }
};

// Momo IPN/Notify handler
const momoNotify = async (req, res) => {
  try {
    const momoData = req.body;

    // Verify signature
    const verification = momoService.verifyCallback(momoData);

    if (!verification.valid) {
      return res.json({ resultCode: 97, message: 'Invalid signature' });
    }

    const paymentId = verification.orderId;

    // Check if payment exists
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      return res.json({ resultCode: 1, message: 'Order not found' });
    }

    if (payment.status === 'success') {
      return res.json({ resultCode: 2, message: 'Order already confirmed' });
    }

    // Update payment and booking
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: verification.success ? 'success' : 'failed',
        transactionId: verification.transId,
        gatewayResponse: momoData
      }
    });

    if (verification.success) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: 'paid',
          status: 'confirmed'
        }
      });
    }

    res.json({ resultCode: 0, message: 'success' });
  } catch (error) {
    console.error('Momo notify error:', error);
    res.json({ resultCode: 99, message: 'Unknown error' });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            venue: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      error: 'Failed to fetch payment status',
      message: error.message
    });
  }
};

module.exports = {
  createPayment,
  vnpayCallback,
  vnpayIPN,
  momoCallback,
  momoNotify,
  getPaymentStatus
};
