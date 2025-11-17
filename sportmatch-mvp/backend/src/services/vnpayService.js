const crypto = require('crypto');
const axios = require('axios');
const querystring = require('querystring');

/**
 * VNPay Payment Service
 * Docs: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/
 */

class VNPayService {
  constructor() {
    this.tmnCode = process.env.VNPAY_TMN_CODE;
    this.hashSecret = process.env.VNPAY_HASH_SECRET;
    this.url = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    this.returnUrl = process.env.VNPAY_RETURN_URL;
  }

  // Sort object by key
  sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  // Create payment URL
  createPaymentUrl(params) {
    const {
      amount,          // VNĐ
      orderInfo,       // Mô tả đơn hàng
      orderId,         // Mã đơn hàng (booking ID)
      ipAddr,          // IP của người dùng
      bankCode = ''    // Mã ngân hàng (optional)
    } = params;

    // VNPay requires amount in VND (no decimal)
    const vnpAmount = Math.round(amount) * 100; // Convert to VNPay format

    const createDate = this.formatDate(new Date());
    const expireDate = this.formatDate(new Date(Date.now() + 15 * 60 * 1000)); // 15 min

    let vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: vnpAmount,
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate
    };

    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }

    // Sort params
    vnpParams = this.sortObject(vnpParams);

    // Create signature
    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnpParams.vnp_SecureHash = signed;

    // Create payment URL
    const paymentUrl = this.url + '?' + querystring.stringify(vnpParams, { encode: false });

    return paymentUrl;
  }

  // Verify callback from VNPay
  verifyCallback(vnpParams) {
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sorted = this.sortObject(vnpParams);
    const signData = querystring.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac('sha512', this.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      return {
        valid: true,
        orderId: vnpParams.vnp_TxnRef,
        amount: parseInt(vnpParams.vnp_Amount) / 100, // Convert back to VND
        responseCode: vnpParams.vnp_ResponseCode,
        transactionNo: vnpParams.vnp_TransactionNo,
        bankCode: vnpParams.vnp_BankCode,
        payDate: vnpParams.vnp_PayDate
      };
    }

    return { valid: false };
  }

  // Format date for VNPay (yyyyMMddHHmmss)
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  // Check if payment was successful
  isSuccess(responseCode) {
    return responseCode === '00';
  }
}

module.exports = new VNPayService();
