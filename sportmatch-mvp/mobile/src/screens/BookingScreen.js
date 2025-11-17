import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import api, { endpoints } from '../config/api';

export default function BookingScreen({ route, navigation }) {
  const { venueId, venue } = route.params;
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, [selectedDate]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.venueAvailability(venueId), {
        params: { date: selectedDate }
      });

      if (response.data.success) {
        setAvailability(response.data.availability);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch sân');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (paymentMethod) => {
    if (!selectedSlot) {
      Alert.alert('Lỗi', 'Vui lòng chọn khung giờ');
      return;
    }

    setBooking(true);
    try {
      // Step 1: Create booking
      const bookingResponse = await api.post(endpoints.bookings, {
        courtId: selectedSlot.courtId,
        bookingDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        paymentMethod
      });

      if (!bookingResponse.data.success) {
        throw new Error('Không thể tạo booking');
      }

      const bookingId = bookingResponse.data.booking.id;

      // Step 2: Create payment
      const paymentResponse = await api.post(endpoints.createPayment, {
        bookingId,
        method: paymentMethod
      });

      if (!paymentResponse.data.success) {
        throw new Error('Không thể tạo thanh toán');
      }

      const paymentUrl = paymentResponse.data.paymentUrl;

      Alert.alert(
        'Chuyển đến thanh toán',
        `Bạn sẽ được chuyển đến ${paymentMethod === 'vnpay' ? 'VNPay' : 'Momo'} để thanh toán`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Tiếp tục',
            onPress: () => {
              // Open payment URL
              Linking.openURL(paymentUrl);

              // Navigate to my bookings
              navigation.navigate('MyBookings');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.error || error.message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.venueName}>{venue.name}</Text>
        <Text style={styles.venueAddress}>{venue.address}</Text>
      </View>

      {/* Date selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Chọn ngày</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateSelector}>
            {getNext7Days().map((date) => (
              <TouchableOpacity
                key={date.value}
                style={[
                  styles.dateButton,
                  selectedDate === date.value && styles.dateButtonActive
                ]}
                onPress={() => setSelectedDate(date.value)}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === date.value && styles.dateTextActive
                ]}>
                  {date.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === date.value && styles.dateTextActive
                ]}>
                  {date.date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Time slots */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏰ Chọn giờ</Text>

        {loading ? (
          <ActivityIndicator />
        ) : (
          availability.map((court) => (
            <View key={court.courtId} style={styles.courtSlots}>
              <Text style={styles.courtName}>
                Sân {court.courtNumber} {court.courtName}
              </Text>

              <View style={styles.slots}>
                {court.slots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.slot,
                      !slot.available && styles.slotUnavailable,
                      selectedSlot?.courtId === court.courtId &&
                      selectedSlot?.startTime === slot.startTime &&
                      styles.slotSelected
                    ]}
                    onPress={() => {
                      if (slot.available) {
                        setSelectedSlot({
                          courtId: court.courtId,
                          courtNumber: court.courtNumber,
                          ...slot
                        });
                      }
                    }}
                    disabled={!slot.available}
                  >
                    <Text style={[
                      styles.slotTime,
                      !slot.available && styles.slotTextUnavailable,
                      selectedSlot?.courtId === court.courtId &&
                      selectedSlot?.startTime === slot.startTime &&
                      styles.slotTextSelected
                    ]}>
                      {slot.startTime}
                    </Text>
                    <Text style={[
                      styles.slotPrice,
                      !slot.available && styles.slotTextUnavailable,
                      selectedSlot?.courtId === court.courtId &&
                      selectedSlot?.startTime === slot.startTime &&
                      styles.slotTextSelected
                    ]}>
                      {slot.available ? `${slot.price?.toLocaleString()}đ` : 'Đã đặt'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Selected slot summary */}
      {selectedSlot && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Chi tiết đặt sân</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sân:</Text>
            <Text style={styles.summaryValue}>Sân {selectedSlot.courtNumber}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ngày:</Text>
            <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giờ:</Text>
            <Text style={styles.summaryValue}>
              {selectedSlot.startTime} - {selectedSlot.endTime}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giá:</Text>
            <Text style={styles.summaryPrice}>
              {selectedSlot.price?.toLocaleString()}đ
            </Text>
          </View>

          <Text style={styles.paymentTitle}>Chọn phương thức thanh toán:</Text>

          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => handleBooking('momo')}
            disabled={booking}
          >
            <Text style={styles.paymentButtonText}>
              💳 Thanh toán Momo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentButton, styles.paymentButtonAlt]}
            onPress={() => handleBooking('vnpay')}
            disabled={booking}
          >
            <Text style={styles.paymentButtonText}>
              💳 Thanh toán VNPay
            </Text>
          </TouchableOpacity>

          {booking && (
            <ActivityIndicator size="small" color="#2196F3" style={{ marginTop: 10 }} />
          )}
        </View>
      )}
    </ScrollView>
  );
}

// Helper functions
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function getNext7Days() {
  const days = [];
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    days.push({
      day: weekdays[date.getDay()],
      date: date.getDate(),
      value: date.toISOString().split('T')[0]
    });
  }

  return days;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  venueName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  venueAddress: {
    fontSize: 14,
    color: '#666'
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
  dateSelector: {
    flexDirection: 'row',
    gap: 10
  },
  dateButton: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    minWidth: 70
  },
  dateButtonActive: {
    backgroundColor: '#2196F3'
  },
  dateDay: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  dateTextActive: {
    color: '#fff'
  },
  courtSlots: {
    marginBottom: 20
  },
  courtName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  slot: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    minWidth: 100,
    alignItems: 'center'
  },
  slotUnavailable: {
    backgroundColor: '#ccc'
  },
  slotSelected: {
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: '#1976D2'
  },
  slotTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3
  },
  slotPrice: {
    fontSize: 12,
    color: '#fff'
  },
  slotTextUnavailable: {
    color: '#999'
  },
  slotTextSelected: {
    color: '#fff'
  },
  summary: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666'
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 15
  },
  paymentButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  paymentButtonAlt: {
    backgroundColor: '#2196F3'
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
