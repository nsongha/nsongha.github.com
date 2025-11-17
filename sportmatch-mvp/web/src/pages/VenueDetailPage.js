import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { endpoints } from '../config/api';
import './VenueDetailPage.css';

export default function VenueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenueDetail();
  }, [id]);

  const loadVenueDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.venueDetail(id));
      if (response.data.success) {
        setVenue(response.data.venue);
      }
    } catch (error) {
      console.error('Error loading venue:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải thông tin sân...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Không tìm thấy sân</h3>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const getCourtWidth = (type) => {
    switch (type) {
      case 'narrow': return 'Hẹp (< 6m)';
      case 'standard': return 'Tiêu chuẩn (6-8m)';
      case 'wide': return 'Rộng (> 8m)';
      default: return type;
    }
  };

  const getSurfaceType = (type) => {
    switch (type) {
      case 'plastic': return 'Nhựa';
      case 'wood': return 'Gỗ';
      case 'concrete': return 'Bê tông';
      case 'artificial_grass': return 'Cỏ nhân tạo';
      case 'hard_court': return 'Sân cứng';
      default: return type;
    }
  };

  const getCleanliness = (level) => {
    switch (level) {
      case 'clean': return 'Sạch sẽ ✨';
      case 'medium': return 'Trung bình';
      case 'dusty': return 'Có bụi';
      default: return level;
    }
  };

  const getLightingType = (type) => {
    switch (type) {
      case 'led': return 'LED';
      case 'fluorescent': return 'Huỳnh quang';
      case 'halogen': return 'Halogen';
      default: return type;
    }
  };

  return (
    <div className="venue-detail-page">
      <div className="container">
        {/* Header */}
        <div className="detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Quay lại
          </button>
          <h1>{venue.name}</h1>
          <p className="address">📍 {venue.address}</p>
        </div>

        <div className="detail-grid">
          {/* Main Info */}
          <div className="detail-main">
            <div className="card">
              <h2>Mô tả</h2>
              <p>{venue.description}</p>
            </div>

            {/* Technical Specs - AS REQUESTED */}
            <div className="card">
              <h2>Thông số kỹ thuật</h2>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Biên sân:</span>
                  <span className="spec-value">{getCourtWidth(venue.courtWidthType)}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Loại mặt sân:</span>
                  <span className="spec-value">{getSurfaceType(venue.surfaceType)}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Số lớp:</span>
                  <span className="spec-value">{venue.surfaceLayers} lớp</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Độ đàn hồi:</span>
                  <span className="spec-value">
                    {venue.elasticity === 'high' ? 'Cao' : venue.elasticity === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Vệ sinh:</span>
                  <span className="spec-value">{getCleanliness(venue.cleanliness)}</span>
                </div>
              </div>
            </div>

            {/* Lighting */}
            <div className="card">
              <h2>Ánh sáng</h2>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Loại đèn:</span>
                  <span className="spec-value">{getLightingType(venue.lightingType)}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Độ sáng:</span>
                  <span className="spec-value">{venue.lightingLux} lux</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Chống chói:</span>
                  <span className="spec-value">
                    {venue.hasAntiGlare ? '✅ Có' : '❌ Không'}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Chất lượng:</span>
                  <span className="spec-value">
                    {venue.lightingQuality === 'excellent' ? 'Xuất sắc' :
                     venue.lightingQuality === 'good' ? 'Tốt' : 'Đạt yêu cầu'}
                  </span>
                </div>
              </div>
            </div>

            {/* Other specs */}
            <div className="card">
              <h2>Thông tin khác</h2>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Độ ồn:</span>
                  <span className="spec-value">{venue.noiseLevel} dB</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Thông gió:</span>
                  <span className="spec-value">
                    {venue.ventilation === 'enclosed' ? 'Kín (có điều hòa)' :
                     venue.ventilation === 'semi_enclosed' ? 'Bán kín' : 'Thoáng'}
                  </span>
                </div>
                {venue.avgTemperature && (
                  <div className="spec-item">
                    <span className="spec-label">Nhiệt độ TB:</span>
                    <span className="spec-value">{venue.avgTemperature}°C</span>
                  </div>
                )}
                <div className="spec-item">
                  <span className="spec-label">Bóng chuẩn:</span>
                  <span className="spec-value">{venue.standardBallBrand || 'Không có'}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="card">
              <h2>Tiện ích</h2>
              <div className="amenities-grid">
                <div className={`amenity-item ${venue.freeParking ? 'active' : ''}`}>
                  <span className="amenity-icon">🅿️</span>
                  <span>Gửi xe {venue.freeParking ? 'miễn phí' : 'có phí'}</span>
                  {venue.parkingType && (
                    <small>({venue.parkingType === 'both' ? 'Xe máy & ô tô' : venue.parkingType === 'motorcycle' ? 'Chỉ xe máy' : 'Chỉ ô tô'})</small>
                  )}
                </div>
                <div className={`amenity-item ${venue.hasAC ? 'active' : ''}`}>
                  <span className="amenity-icon">❄️</span>
                  <span>Điều hòa</span>
                </div>
                <div className={`amenity-item ${venue.hasFreeWifi ? 'active' : ''}`}>
                  <span className="amenity-icon">📶</span>
                  <span>WiFi miễn phí</span>
                </div>
                <div className={`amenity-item ${venue.hasLockerRoom ? 'active' : ''}`}>
                  <span className="amenity-icon">🔐</span>
                  <span>Phòng thay đồ</span>
                  {venue.lockerRoomQuality && <small>(⭐ {venue.lockerRoomQuality}/5)</small>}
                </div>
                <div className={`amenity-item ${venue.hasToilet ? 'active' : ''}`}>
                  <span className="amenity-icon">🚽</span>
                  <span>Nhà vệ sinh</span>
                  {venue.toiletQuality && <small>(⭐ {venue.toiletQuality}/5)</small>}
                </div>
                <div className={`amenity-item ${venue.hasCanteen ? 'active' : ''}`}>
                  <span className="amenity-icon">🍜</span>
                  <span>Canteen</span>
                </div>
                <div className={`amenity-item ${venue.hasRacketRental ? 'active' : ''}`}>
                  <span className="amenity-icon">🏸</span>
                  <span>Cho thuê vợt</span>
                  {venue.racketRentalPrice && <small>({venue.racketRentalPrice.toLocaleString()}đ)</small>}
                </div>
                <div className={`amenity-item ${venue.hasDrinkService ? 'active' : ''}`}>
                  <span className="amenity-icon">🥤</span>
                  <span>Dịch vụ đồ uống</span>
                </div>
              </div>
            </div>

            {/* Courts */}
            <div className="card">
              <h2>Danh sách sân ({venue.courts?.length || 0})</h2>
              <div className="courts-list">
                {venue.courts?.map((court) => (
                  <div key={court.id} className="court-item">
                    <h3>Sân {court.number} {court.name && `- ${court.name}`}</h3>
                    <div className="court-prices">
                      <div className="price-row">
                        <span className="price-time">Sáng (6-12h):</span>
                        <span className="price-value">
                          {court.priceWeekdayMorning?.toLocaleString()}đ (T2-T6) | {court.priceWeekendMorning?.toLocaleString()}đ (T7-CN)
                        </span>
                      </div>
                      <div className="price-row">
                        <span className="price-time">Chiều (12-18h):</span>
                        <span className="price-value">
                          {court.priceWeekdayAfternoon?.toLocaleString()}đ (T2-T6) | {court.priceWeekendAfternoon?.toLocaleString()}đ (T7-CN)
                        </span>
                      </div>
                      <div className="price-row">
                        <span className="price-time">Tối (18-23h):</span>
                        <span className="price-value highlight">
                          {court.priceWeekdayEvening?.toLocaleString()}đ (T2-T6) | {court.priceWeekendEvening?.toLocaleString()}đ (T7-CN)
                        </span>
                      </div>
                      <div className="price-row">
                        <span className="price-time">Giờ hoạt động:</span>
                        <span className="price-value">
                          {court.operatingHoursStart} - {court.operatingHoursEnd}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="card sticky-card">
              <h3>Đặt sân ngay</h3>
              <div className="price-summary">
                <span className="price-label">Giá từ</span>
                <span className="price-big">
                  {Math.min(...(venue.courts?.map(c => c.priceWeekdayMorning) || [0])).toLocaleString()}đ
                </span>
                <span className="price-unit">/ giờ</span>
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate(`/booking/${venue.id}`)}
              >
                Chọn giờ đặt sân
              </button>

              <div className="contact-info">
                <h4>Thông tin liên hệ</h4>
                <p>📞 {venue.phone}</p>
                <p>📍 {venue.address}</p>
              </div>

              {venue.subscriptionTier === 'pro' && (
                <div className="premium-badge">
                  ✨ Đối tác Premium
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
