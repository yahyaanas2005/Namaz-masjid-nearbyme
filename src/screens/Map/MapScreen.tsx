import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { setCurrentLocation, setLocationError, setPermissionGranted } from '@store/slices/locationSlice';
import { fetchMosquesStart, fetchMosquesSuccess, fetchMosquesFailure } from '@store/slices/mosqueSlice';
import LocationService from '@services/LocationService';
import ApiService from '@services/ApiService';

const MapScreen: React.FC = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<MapView>(null);
  const currentLocation = useSelector((state: RootState) => state.location.currentLocation);
  const nearbyMosques = useSelector((state: RootState) => state.mosques.nearbyMosques);
  const searchRadius = useSelector((state: RootState) => state.mosques.searchRadius);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyMosques();
    }
  }, [currentLocation, searchRadius]);

  const initializeLocation = async () => {
    try {
      const hasPermission = await LocationService.requestLocationPermission();
      dispatch(setPermissionGranted(hasPermission));

      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to find nearby mosques.',
        );
        setIsLoading(false);
        return;
      }

      const location = await LocationService.getCurrentLocation();
      dispatch(setCurrentLocation(location));
      
      // Center map on current location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...location,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
      
      setIsLoading(false);
    } catch (error: any) {
      dispatch(setLocationError(error.message));
      Alert.alert('Location Error', error.message);
      setIsLoading(false);
    }
  };

  const fetchNearbyMosques = async () => {
    if (!currentLocation) return;

    try {
      dispatch(fetchMosquesStart());
      const mosques = await ApiService.getNearbyMosques(currentLocation, searchRadius);
      dispatch(fetchMosquesSuccess(mosques));
    } catch (error: any) {
      dispatch(fetchMosquesFailure(error.message));
      Alert.alert('Error', 'Failed to fetch nearby mosques');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        initialRegion={
          currentLocation
            ? {
                ...currentLocation,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : undefined
        }>
        {nearbyMosques.map(mosque => (
          <Marker
            key={mosque.id}
            coordinate={mosque.location}
            title={mosque.name}
            description={mosque.address}
            pinColor={mosque.committeeApproved ? '#2E7D32' : '#FFA726'}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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
});

export default MapScreen;
