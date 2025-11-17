import React, { useState } from 'react';
import api, { endpoints } from '../config/api';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post(endpoints.sendOTP, { phone });

      if (response.data.success) {
        setStep('otp');
        // In development, show OTP
        if (response.data.dev_otp) {
          alert(`Mã OTP của bạn: ${response.data.dev_otp}\n(Chỉ hiển thị trong môi trường phát triển)`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể gửi OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post(endpoints.verifyOTP, { phone, otp });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'OTP không chính xác. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <span className="login-icon">🏸</span>
          <h1>SportMatch</h1>
          <p>Đặt sân thể thao nhanh chóng, tiện lợi</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="login-form">
            <h2>Đăng nhập</h2>
            <div className="input-group">
              <label htmlFor="phone" className="input-label">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                className="input"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9]{10}"
                required
              />
              <small className="input-hint">
                Nhập số điện thoại 10 chữ số
              </small>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading || phone.length !== 10}
            >
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="login-form">
            <h2>Nhập mã OTP</h2>
            <p className="text-muted">
              Mã OTP đã được gửi đến số điện thoại <strong>{phone}</strong>
            </p>

            <div className="input-group">
              <label htmlFor="otp" className="input-label">
                Mã OTP
              </label>
              <input
                type="text"
                id="otp"
                className="input"
                placeholder="Nhập mã OTP 6 chữ số"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                pattern="[0-9]{6}"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="button-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Đang xác thực...' : 'Xác nhận'}
              </button>
            </div>
          </form>
        )}

        <div className="login-footer">
          <p>
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="/terms">Điều khoản sử dụng</a> và{' '}
            <a href="/privacy">Chính sách bảo mật</a>
          </p>
        </div>
      </div>
    </div>
  );
}
