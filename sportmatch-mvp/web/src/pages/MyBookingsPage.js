import React from 'react';
import './MyBookingsPage.css';

export default function MyBookingsPage() {
  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1>Lịch đặt sân của tôi</h1>
        <div className="card">
          <p>Danh sách lịch đặt sân đang được phát triển...</p>
          <p className="text-muted">
            Tính năng sẽ bao gồm:<br/>
            - Danh sách đặt sân (sắp tới/đã qua)<br/>
            - Chi tiết từng booking<br/>
            - Hủy sân với hoàn tiền tự động<br/>
            - Pull-to-refresh
          </p>
        </div>
      </div>
    </div>
  );
}
