import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏸</span>
          <span className="brand-text">SportMatch</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <span className="nav-icon">🏠</span>
            <span>Trang chủ</span>
          </Link>
          <Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings')}`}>
            <span className="nav-icon">📅</span>
            <span>Lịch đặt sân</span>
          </Link>
          <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
            <span className="nav-icon">👤</span>
            <span>Tài khoản</span>
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <span className="nav-icon">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
