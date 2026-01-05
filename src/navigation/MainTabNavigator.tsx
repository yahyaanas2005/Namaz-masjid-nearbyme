import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import MapScreen from '@screens/Map/MapScreen';
import MosqueListScreen from '@screens/Mosque/MosqueListScreen';
import PrayerTimesScreen from '@screens/PrayerTimes/PrayerTimesScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';

export type MainTabParamList = {
  Map: undefined;
  Mosques: undefined;
  PrayerTimes: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Map':
              iconName = 'map';
              break;
            case 'Mosques':
              iconName = 'mosque';
              break;
            case 'PrayerTimes':
              iconName = 'access-time';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}>
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Find Mosques' }} />
      <Tab.Screen name="Mosques" component={MosqueListScreen} options={{ title: 'Nearby Mosques' }} />
      <Tab.Screen name="PrayerTimes" component={PrayerTimesScreen} options={{ title: 'Prayer Times' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
