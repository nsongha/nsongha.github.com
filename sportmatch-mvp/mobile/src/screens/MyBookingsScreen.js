import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import api, { endpoints } from '../config/api';

export default function MyBookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming' or 'all'

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.myBookings, {
        params: { upcoming: filter === 'upcoming' }
      });

      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách đặt sân');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      'Hủy đặt sân',
      'Bạn có chắc muốn hủy đặt sân này?\n\n• Hủy trước 2h: Hoàn 100%\n• Hủy trước 30 phút: Hoàn 70%\n• Hủy trong 30 phút: Không hoàn tiền',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy sân',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.delete(endpoints.cancelBooking(bookingId), {
                data: { reason: 'Người dùng hủy' }
              });

              if (response.data.success) {
                Alert.alert(
                  'Thành công',
                  response.data.refund.message
                );
                loadBookings();
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể hủy đặt sân');
            }
          }
        }
      ]
    );
  };

  const renderBookingCard = ({ item }) => {
    const status = getStatusInfo(item.status, item.paymentStatus);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.venueName}>{item.venue.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={styles.statusText}>{status.text}</Text>
          </View>
        </View>

        <Text style={styles.address} numberOfLines={1}>
          📍 {item.venue.address}
        </Text>

        <View style={styles.details}>
          <Text style={styles.detail}>
            📅 {formatDate(item.bookingDate)}
          </Text>
          <Text style={styles.detail}>
            ⏰ {item.startTime} - {item.endTime}
          </Text>
          <Text style={styles.detail}>
            🏸 Sân {item.court.number}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            💰 {item.finalPrice.toLocaleString()}đ
          </Text>

          {item.status === 'confirmed' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(item.id)}
            >
              <Text style={styles.cancelButtonText}>Hủy sân</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch đặt sân của tôi</Text>

        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'upcoming' && styles.filterTabActive
            ]}
            onPress={() => setFilter('upcoming')}
          >
            <Text style={[
              styles.filterTabText,
              filter === 'upcoming' && styles.filterTabTextActive
            ]}>
              Sắp tới
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'all' && styles.filterTabActive
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterTabText,
              filter === 'all' && styles.filterTabTextActive
            ]}>
              Tất cả
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Bạn chưa có lịch đặt sân nào</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.emptyButtonText}>Đặt sân ngay</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadBookings();
              }}
            />
          }
        />
      )}
    </View>
  );
}

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getStatusInfo(status, paymentStatus) {
  if (status === 'cancelled') {
    return { text: 'Đã hủy', color: '#999' };
  }
  if (status === 'completed') {
    return { text: 'Đã hoàn thành', color: '#4CAF50' };
  }
  if (paymentStatus === 'paid') {
    return { text: 'Đã thanh toán', color: '#2196F3' };
  }
  if (paymentStatus === 'pending') {
    return { text: 'Chờ thanh toán', color: '#FF9800' };
  }
  return { text: status, color: '#666' };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 10
  },
  filterTab: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  filterTabActive: {
    backgroundColor: '#2196F3'
  },
  filterTabText: {
    fontSize: 14,
    color: '#666'
  },
  filterTabTextActive: {
    color: '#fff',
    fontWeight: 'bold'
  },
  list: {
    padding: 15
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  details: {
    marginBottom: 10
  },
  detail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f44336'
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  empty: {
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20
  },
  emptyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
