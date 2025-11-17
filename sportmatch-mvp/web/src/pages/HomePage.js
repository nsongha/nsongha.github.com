import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { endpoints } from '../config/api';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [searchQuery, sportFilter, priceFilter, venues]);

  const loadVenues = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.venues);
      if (response.data.success) {
        setVenues(response.data.venues);
      }
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVenues = () => {
    let filtered = [...venues];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sport type filter
    if (sportFilter !== 'all') {
      filtered = filtered.filter((v) => v.sportType === sportFilter);
    }

    // Price filter (based on average evening price)
    if (priceFilter !== 'all') {
      filtered = filtered.filter((v) => {
        // Calculate average evening price
        const avgPrice =
          v.courts.reduce((sum, c) => sum + (c.priceWeekdayEvening || 0), 0) /
          v.courts.length;

        if (priceFilter === 'budget') return avgPrice < 120000;
        if (priceFilter === 'mid') return avgPrice >= 120000 && avgPrice < 180000;
        if (priceFilter === 'premium') return avgPrice >= 180000;
        return true;
      });
    }

    setFilteredVenues(filtered);
  };

  const getSportIcon = (sportType) => {
    switch (sportType) {
      case 'badminton':
        return '🏸';
      case 'football':
        return '⚽';
      case 'tennis':
        return '🎾';
      default:
        return '🏃';
    }
  };

  const getSportName = (sportType) => {
    switch (sportType) {
      case 'badminton':
        return 'Cầu lông';
      case 'football':
        return 'Bóng đá';
      case 'tennis':
        return 'Tennis';
      default:
        return sportType;
    }
  };

  const getMinPrice = (venue) => {
    if (!venue.courts || venue.courts.length === 0) return 0;
    return Math.min(
      ...venue.courts.map(
        (c) => c.priceWeekdayMorning || c.priceWeekdayAfternoon || 0
      )
    );
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="page-header">
          <h1>Tìm sân thể thao</h1>
          <p>Hà Nội · {filteredVenues.length} sân</p>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo tên sân hoặc địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips">
            <select
              className="filter-select"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
            >
              <option value="all">Tất cả môn</option>
              <option value="badminton">Cầu lông</option>
              <option value="football">Bóng đá</option>
              <option value="tennis">Tennis</option>
            </select>

            <select
              className="filter-select"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">Tất cả giá</option>
              <option value="budget">Tiết kiệm (&lt; 120k)</option>
              <option value="mid">Trung bình (120k - 180k)</option>
              <option value="premium">Cao cấp (&gt; 180k)</option>
            </select>
          </div>
        </div>

        {/* Venues Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Đang tải danh sách sân...</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h3>Không tìm thấy sân nào</h3>
            <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="venues-grid">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="venue-card"
                onClick={() => navigate(`/venue/${venue.id}`)}
              >
                <div className="venue-image">
                  <span className="venue-sport-icon">
                    {getSportIcon(venue.sportType)}
                  </span>
                  {venue.isVerified && (
                    <span className="verified-badge">✓ Đã xác minh</span>
                  )}
                </div>

                <div className="venue-content">
                  <h3 className="venue-name">{venue.name}</h3>
                  <p className="venue-address">📍 {venue.address}</p>

                  <div className="venue-meta">
                    <span className="meta-item">
                      {getSportIcon(venue.sportType)} {getSportName(venue.sportType)}
                    </span>
                    <span className="meta-item">
                      🏟️ {venue.courts?.length || 0} sân
                    </span>
                  </div>

                  <div className="venue-features">
                    {venue.hasAC && <span className="feature-tag">❄️ Điều hòa</span>}
                    {venue.hasFreeWifi && <span className="feature-tag">📶 WiFi</span>}
                    {venue.freeParking && <span className="feature-tag">🅿️ Gửi xe free</span>}
                    {venue.hasCanteen && <span className="feature-tag">🍜 Canteen</span>}
                  </div>

                  <div className="venue-footer">
                    <div className="price-info">
                      <span className="price-label">Từ</span>
                      <span className="price-value">
                        {getMinPrice(venue).toLocaleString()}đ
                      </span>
                      <span className="price-unit">/giờ</span>
                    </div>

                    {venue.ratingOverall && (
                      <div className="rating">
                        ⭐ {venue.ratingOverall.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
