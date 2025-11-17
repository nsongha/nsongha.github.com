const crypto = require('crypto');
const axios = require('axios');

/**
 * Momo Payment Service
 * Docs: https://developers.momo.vn/v3/
 */

class MomoService {
  constructor() {
    this.partnerCode = process.env.MOMO_PARTNER_CODE;
    this.accessKey = process.env.MOMO_ACCESS_KEY;
    this.secretKey = process.env.MOMO_SECRET_KEY;
    this.endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
    this.returnUrl = process.env.MOMO_RETURN_URL;
    this.notifyUrl = process.env.MOMO_NOTIFY_URL;
  }

  // Create payment request
  async createPayment(params) {
    const {
      amount,       // VNĐ
      orderInfo,    // Mô tả
      orderId,      // Booking ID
      extraData = '' // Optional metadata
    } = params;

    const requestId = orderId;
    const requestType = 'captureWallet';

    // Create raw signature
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.returnUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Generate signature
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    // Request body
    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: this.returnUrl,
      ipnUrl: this.notifyUrl,
      requestType,
      extraData,
      lang: 'vi',
      signature
    };

    try {
      const response = await axios.post(this.endpoint, requestBody);

      if (response.data.resultCode === 0) {
        return {
          success: true,
          payUrl: response.data.payUrl,
          deeplink: response.data.deeplink,
          qrCodeUrl: response.data.qrCodeUrl
        };
      }

      return {
        success: false,
        error: response.data.message,
        resultCode: response.data.resultCode
      };
    } catch (error) {
      console.error('Momo payment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify callback from Momo
  verifyCallback(data) {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = data;

    // Create raw signature
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    // Generate signature
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    if (signature === expectedSignature) {
      return {
        valid: true,
        orderId,
        amount,
        resultCode,
        transId,
        message,
        success: resultCode === 0
      };
    }

    return { valid: false };
  }

  // Check transaction status
  async checkStatus(orderId) {
    const requestId = orderId;

    const rawSignature = `accessKey=${this.accessKey}&orderId=${orderId}&partnerCode=${this.partnerCode}&requestId=${requestId}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId,
      orderId,
      signature,
      lang: 'vi'
    };

    try {
      const response = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/query',
        requestBody
      );

      return {
        success: response.data.resultCode === 0,
        ...response.data
      };
    } catch (error) {
      console.error('Momo status check error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new MomoService();
