import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import api, { endpoints } from '../config/api';

export default function VenueDetailScreen({ route, navigation }) {
  const { venueId } = route.params;
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenueDetail();
  }, []);

  const loadVenueDetail = async () => {
    try {
      const response = await api.get(endpoints.venueDetail(venueId));

      if (response.data.success) {
        setVenue(response.data.venue);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin sân');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!venue) {
    return (
      <View style={styles.loading}>
        <Text>Không tìm thấy sân</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{venue.name}</Text>
        <Text style={styles.address}>📍 {venue.address}</Text>

        {venue.ratingOverall && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingBig}>⭐ {venue.ratingOverall.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({venue.reviews?.length || 0} đánh giá)</Text>
          </View>
        )}
      </View>

      {/* Technical Specs - AS REQUESTED! */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Thông số kỹ thuật</Text>

        <View style={styles.specs}>
          <SpecRow label="Biên sân" value={getCourtWidth(venue.courtWidthType)} />
          <SpecRow label="Mặt sân" value={`${venue.surfaceLayers || 0} lớp - ${getSurfaceType(venue.surfaceType)}`} />
          <SpecRow label="Vệ sinh" value={getCleanliness(venue.cleanliness)} rating={venue.ratingCleanliness} />
          <SpecRow label="Ánh sáng" value={`${venue.lightingType?.toUpperCase()} - ${venue.lightingLux} lux`} rating={venue.ratingLighting} />
          <SpecRow label="Chống chói" value={venue.hasAntiGlare ? '✅ Có' : '❌ Không'} />
          <SpecRow label="Độ ồn" value={`${venue.noiseLevel} dB - ${getNoiseLevel(venue.noiseLevel)}`} />
        </View>
      </View>

      {/* Amenities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Tiện ích</Text>

        <View style={styles.amenities}>
          {venue.freeParking && <Amenity icon="🅿️" text="Gửi xe miễn phí" />}
          {venue.hasAC && <Amenity icon="❄️" text="Điều hòa" />}
          {venue.hasFreeWifi && <Amenity icon="📶" text="WiFi miễn phí" />}
          {venue.hasLockerRoom && <Amenity icon="🚿" text="Phòng thay đồ" />}
          {venue.hasCanteen && <Amenity icon="🍔" text="Canteen" />}
          {venue.standardBallBrand && <Amenity icon="🏸" text={`Bóng ${venue.standardBallBrand}`} />}
        </View>
      </View>

      {/* Pricing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💰 Bảng giá</Text>

        {venue.courts?.slice(0, 1).map((court) => (
          <View key={court.id} style={styles.pricingTable}>
            <PriceRow label="Sáng (6h-12h)" weekday={court.priceWeekdayMorning} weekend={court.priceWeekendMorning} />
            <PriceRow label="Chiều (12h-18h)" weekday={court.priceWeekdayAfternoon} weekend={court.priceWeekendAfternoon} />
            <PriceRow label="Tối (18h-23h)" weekday={court.priceWeekdayEvening} weekend={court.priceWeekendEvening} />
          </View>
        ))}
      </View>

      {/* Reviews */}
      {venue.reviews && venue.reviews.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Đánh giá</Text>

          {venue.reviews.slice(0, 3).map((review, index) => (
            <View key={index} style={styles.review}>
              <Text style={styles.reviewUser}>{review.user.name || 'Người dùng'}</Text>
              <Text style={styles.reviewRating}>⭐ {review.ratingOverall}/5</Text>
              {review.comment && <Text style={styles.reviewComment}>{review.comment}</Text>}
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('Booking', { venueId, venue })}
      >
        <Text style={styles.bookButtonText}>Đặt sân ngay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Helper components
const SpecRow = ({ label, value, rating }) => (
  <View style={styles.specRow}>
    <Text style={styles.specLabel}>{label}:</Text>
    <Text style={styles.specValue}>{value}</Text>
    {rating && <Text style={styles.specRating}>⭐ {rating.toFixed(1)}</Text>}
  </View>
);

const Amenity = ({ icon, text }) => (
  <View style={styles.amenity}>
    <Text style={styles.amenityIcon}>{icon}</Text>
    <Text style={styles.amenityText}>{text}</Text>
  </View>
);

const PriceRow = ({ label, weekday, weekend }) => (
  <View style={styles.priceRow}>
    <Text style={styles.priceLabel}>{label}</Text>
    <Text style={styles.priceValue}>
      T2-6: {weekday?.toLocaleString()}đ | T7-CN: {weekend?.toLocaleString()}đ
    </Text>
  </View>
);

// Helper functions
const getCourtWidth = (type) => {
  const map = { narrow: 'Hẹp (6m)', standard: 'Tiêu chuẩn (8m)', wide: 'Rộng (10m+)' };
  return map[type] || type;
};

const getSurfaceType = (type) => {
  const map = { concrete: 'Bê tông', plastic: 'Nhựa', wood: 'Gỗ', artificial_grass: 'Cỏ nhân tạo' };
  return map[type] || type;
};

const getCleanliness = (level) => {
  const map = { dusty: 'Bụi nhiều', medium: 'Trung bình', clean: 'Sạch sẽ' };
  return map[level] || level;
};

const getNoiseLevel = (db) => {
  if (db < 45) return 'Yên tĩnh';
  if (db < 60) return 'Trung bình';
  return 'Ồn';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  ratingBig: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800'
  },
  ratingCount: {
    fontSize: 14,
    color: '#999'
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  specs: {
    gap: 10
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 2
  },
  specRating: {
    fontSize: 12,
    color: '#FF9800'
  },
  amenities: {
    gap: 10
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  },
  amenityIcon: {
    fontSize: 20
  },
  amenityText: {
    fontSize: 14
  },
  pricingTable: {
    gap: 10
  },
  priceRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5
  },
  priceValue: {
    fontSize: 14,
    color: '#4CAF50'
  },
  review: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  reviewRating: {
    fontSize: 12,
    color: '#FF9800',
    marginBottom: 5
  },
  reviewComment: {
    fontSize: 14,
    color: '#666'
  },
  bookButton: {
    backgroundColor: '#2196F3',
    padding: 18,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
