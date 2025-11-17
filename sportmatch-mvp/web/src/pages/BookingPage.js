import React from 'react';
import { useParams } from 'react-router-dom';
import './BookingPage.css';

export default function BookingPage() {
  const { venueId } = useParams();

  return (
    <div className="booking-page">
      <div className="container">
        <h1>Đặt sân</h1>
        <div className="card">
          <p>Trang đặt sân đang được phát triển...</p>
          <p>Venue ID: {venueId}</p>
          <p className="text-muted">
            Tính năng sẽ bao gồm:
            - Chọn ngày (7 ngày tới)<br/>
            - Chọn giờ (lịch trống/đã đặt)<br/>
            - Chọn sân<br/>
            - Thanh toán Momo/VNPay
          </p>
        </div>
      </div>
    </div>
  );
}
