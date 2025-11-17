import React from 'react';
import './ProfilePage.css';

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <div className="container">
        <h1>Tài khoản của tôi</h1>
        <div className="card">
          <p>Trang hồ sơ người dùng đang được phát triển...</p>
          <p className="text-muted">
            Tính năng sẽ bao gồm:<br/>
            - Thông tin cá nhân<br/>
            - Sở thích (cho AI matching):<br/>
            &nbsp;&nbsp;• Trình độ<br/>
            &nbsp;&nbsp;• Tần suất chơi<br/>
            &nbsp;&nbsp;• Có học thầy<br/>
            &nbsp;&nbsp;• Vị trí nhà/làm<br/>
            &nbsp;&nbsp;• Ngân sách<br/>
            &nbsp;&nbsp;• Thời gian ưa thích
          </p>
        </div>
      </div>
    </div>
  );
}
