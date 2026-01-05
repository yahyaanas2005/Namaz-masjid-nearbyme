import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import PrayerTimeService from '@services/PrayerTimeService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PrayerTimesScreen: React.FC = () => {
  const selectedMosque = useSelector((state: RootState) => state.mosques.selectedMosque);
  const nearbyMosques = useSelector((state: RootState) => state.mosques.nearbyMosques);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<number>(0);

  // Use selected mosque or first nearby mosque
  const mosque = selectedMosque || nearbyMosques[0];

  useEffect(() => {
    if (mosque) {
      updatePrayerInfo();
      const interval = setInterval(updatePrayerInfo, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [mosque]);

  const updatePrayerInfo = () => {
    if (!mosque) return;

    const current = PrayerTimeService.getCurrentPrayer(mosque.prayerTimes);
    const next = PrayerTimeService.getNextPrayer(mosque.prayerTimes);
    const timeRemaining = PrayerTimeService.getTimeUntilNextPrayer(mosque.prayerTimes);

    setCurrentPrayer(current);
    setNextPrayer(next);
    setTimeUntilNext(timeRemaining);
  };

  const formatTimeRemaining = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const renderPrayerTimeCard = (name: string, time: string, isCurrent: boolean = false) => (
    <View style={[styles.prayerCard, isCurrent && styles.currentPrayerCard]} key={name}>
      <View style={styles.prayerInfo}>
        <Text style={[styles.prayerName, isCurrent && styles.currentPrayerName]}>{name}</Text>
        <Text style={[styles.prayerTime, isCurrent && styles.currentPrayerTime]}>
          {PrayerTimeService.formatPrayerTime(time)}
        </Text>
      </View>
      {isCurrent && (
        <View style={styles.currentBadge}>
          <Text style={styles.currentBadgeText}>Current</Text>
        </View>
      )}
    </View>
  );

  if (!mosque) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="access-time" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No mosque selected</Text>
        <Text style={styles.emptySubtext}>
          Please select a mosque from the map or list to view prayer times
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mosqueName}>{mosque.name}</Text>
        <Text style={styles.mosqueAddress}>{mosque.address}</Text>
      </View>

      {nextPrayer && (
        <View style={styles.nextPrayerCard}>
          <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
          <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
          <Text style={styles.nextPrayerTime}>
            {PrayerTimeService.formatPrayerTime(nextPrayer.time)}
          </Text>
          <Text style={styles.timeRemaining}>in {formatTimeRemaining(timeUntilNext)}</Text>
        </View>
      )}

      <View style={styles.prayerTimesContainer}>
        <Text style={styles.sectionTitle}>Today's Prayer Times</Text>
        
        {renderPrayerTimeCard('Fajr', mosque.prayerTimes.fajr, currentPrayer === 'Fajr')}
        {renderPrayerTimeCard('Dhuhr', mosque.prayerTimes.dhuhr, currentPrayer === 'Dhuhr')}
        {renderPrayerTimeCard('Asr', mosque.prayerTimes.asr, currentPrayer === 'Asr')}
        {renderPrayerTimeCard('Maghrib', mosque.prayerTimes.maghrib, currentPrayer === 'Maghrib')}
        {renderPrayerTimeCard('Isha', mosque.prayerTimes.isha, currentPrayer === 'Isha')}
        
        {mosque.prayerTimes.jumah && (
          <View style={styles.jumahCard}>
            <Text style={styles.jumahLabel}>Jumu'ah</Text>
            <Text style={styles.jumahTime}>
              {PrayerTimeService.formatPrayerTime(mosque.prayerTimes.jumah)}
            </Text>
          </View>
        )}
      </View>

      {mosque.prayerTimes.isValidated && (
        <View style={styles.validationInfo}>
          <Icon name="verified-user" size={24} color="#2E7D32" />
          <Text style={styles.validationText}>
            Prayer times validated by {mosque.prayerTimes.validatedByCount} users
          </Text>
        </View>
      )}

      {mosque.committeeApproved && (
        <View style={styles.committeeApprovalInfo}>
          <Icon name="verified" size={24} color="#2E7D32" />
          <Text style={styles.committeeApprovalText}>
            Approved by Mosque Committee
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 30,
  },
  mosqueName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  mosqueAddress: {
    fontSize: 14,
    color: '#E8F5E9',
  },
  nextPrayerCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextPrayerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  nextPrayerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  nextPrayerTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  timeRemaining: {
    fontSize: 16,
    color: '#666',
  },
  prayerTimesContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  prayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentPrayerCard: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  currentPrayerName: {
    color: '#2E7D32',
    fontSize: 18,
  },
  prayerTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  currentPrayerTime: {
    color: '#2E7D32',
    fontSize: 22,
  },
  currentBadge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  jumahCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  jumahLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57F17',
  },
  jumahTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F57F17',
  },
  validationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    margin: 15,
    padding: 15,
    borderRadius: 8,
  },
  validationText: {
    fontSize: 14,
    color: '#2E7D32',
    marginLeft: 10,
    flex: 1,
  },
  committeeApprovalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 8,
  },
  committeeApprovalText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 10,
    flex: 1,
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

export default PrayerTimesScreen;
