import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { selectMosque } from '@store/slices/mosqueSlice';
import { Mosque } from '@models/Mosque';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MosqueListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const nearbyMosques = useSelector((state: RootState) => state.mosques.nearbyMosques);
  const isLoading = useSelector((state: RootState) => state.mosques.isLoading);

  const renderMosqueItem = ({ item }: { item: Mosque }) => (
    <TouchableOpacity
      style={styles.mosqueCard}
      onPress={() => dispatch(selectMosque(item))}>
      <View style={styles.mosqueHeader}>
        <Text style={styles.mosqueName}>{item.name}</Text>
        {item.committeeApproved && (
          <Icon name="verified" size={20} color="#2E7D32" />
        )}
      </View>
      
      <Text style={styles.mosqueAddress}>{item.address}</Text>
      
      <View style={styles.mosqueInfo}>
        <View style={styles.infoItem}>
          <Icon name="place" size={16} color="#666" />
          <Text style={styles.infoText}>
            {item.distance ? `${item.distance.toFixed(1)} km` : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Icon name="people" size={16} color="#666" />
          <Text style={styles.infoText}>
            {item.crowdDensity.currentCount} people
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.infoText}>
            Next: {item.prayerTimes.dhuhr}
          </Text>
        </View>
      </View>

      {item.prayerTimes.isValidated && (
        <View style={styles.validatedBadge}>
          <Icon name="check-circle" size={16} color="#2E7D32" />
          <Text style={styles.validatedText}>
            Validated by {item.prayerTimes.validatedByCount} users
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading mosques...</Text>
      </View>
    );
  }

  if (nearbyMosques.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="mosque" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No nearby mosques found</Text>
        <Text style={styles.emptySubtext}>
          Try adjusting your search radius or moving to a different location
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={nearbyMosques}
        renderItem={renderMosqueItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 10,
  },
  mosqueCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mosqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  mosqueAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  mosqueInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  validatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  validatedText: {
    fontSize: 12,
    color: '#2E7D32',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MosqueListScreen;
