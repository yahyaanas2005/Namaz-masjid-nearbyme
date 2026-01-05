export interface Route {
  id: string;
  userId: string;
  origin: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  mosquesAlongRoute: string[]; // Array of mosque IDs
  createdAt: Date;
}

export interface UserPreferences {
  userId: string;
  notificationsEnabled: boolean;
  prayerReminders: boolean;
  reminderTimeBefore: number; // Minutes before prayer time
  offlineMode: boolean;
  preferredLanguage: string;
  showCrowdDensity: boolean;
  maxDistanceForMosques: number; // In kilometers
}
