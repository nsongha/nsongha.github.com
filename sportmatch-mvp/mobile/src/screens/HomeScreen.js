import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native';
import api, { endpoints } from '../config/api';

export default function HomeScreen({ navigation }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sport: 'badminton'
  });

  useEffect(() => {
    loadVenues();
  }, [filters]);

  const loadVenues = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.venues, {
        params: filters
      });

      if (response.data.success) {
        setVenues(response.data.venues);
      }
    } catch (error) {
      console.error('Load venues error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderVenueCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VenueDetail', { venueId: item.id })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.venueName}>{item.name}</Text>
        <Text style={styles.venueAddress} numberOfLines={1}>
          📍 {item.address}
        </Text>

        <View style={styles.venueInfo}>
          {item.distance && (
            <Text style={styles.distance}>🚗 {item.distance}km</Text>
          )}

          {item.ratingOverall && (
            <Text style={styles.rating}>
              ⭐ {item.ratingOverall.toFixed(1)}
            </Text>
          )}

          {item.priceRange && (
            <Text style={styles.price}>
              💰 {item.priceRange.min.toLocaleString()}đ - {item.priceRange.max.toLocaleString()}đ
            </Text>
          )}
        </View>

        <View style={styles.amenities}>
          {item.freeParking && <Text style={styles.amenity}>🅿️ Gửi xe free</Text>}
          {item.hasAC && <Text style={styles.amenity}>❄️ Điều hòa</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm sân thể thao</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sân..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.sportTabs}>
          {['badminton', 'football', 'tennis'].map((sport) => (
            <TouchableOpacity
              key={sport}
              style={[
                styles.sportTab,
                filters.sport === sport && styles.sportTabActive
              ]}
              onPress={() => setFilters({ ...filters, sport })}
            >
              <Text
                style={[
                  styles.sportTabText,
                  filters.sport === sport && styles.sportTabTextActive
                ]}
              >
                {sport === 'badminton' ? '🏸 Cầu lông' :
                 sport === 'football' ? '⚽ Bóng đá' : '🎾 Tennis'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={venues}
          renderItem={renderVenueCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy sân nào</Text>
          }
          refreshing={loading}
          onRefresh={loadVenues}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15
  },
  sportTabs: {
    flexDirection: 'row',
    gap: 10
  },
  sportTab: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  sportTabActive: {
    backgroundColor: '#2196F3'
  },
  sportTabText: {
    fontSize: 12,
    color: '#666'
  },
  sportTabTextActive: {
    color: '#fff',
    fontWeight: 'bold'
  },
  list: {
    padding: 15
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardContent: {
    padding: 15
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  venueAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  venueInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10
  },
  distance: {
    fontSize: 12,
    color: '#2196F3'
  },
  rating: {
    fontSize: 12,
    color: '#FF9800'
  },
  price: {
    fontSize: 12,
    color: '#4CAF50'
  },
  amenities: {
    flexDirection: 'row',
    gap: 10
  },
  amenity: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderRadius: 4
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16
  }
});
