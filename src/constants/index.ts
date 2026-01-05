export const COLORS = {
  primary: '#2E7D32',
  primaryLight: '#66BB6A',
  primaryDark: '#1B5E20',
  secondary: '#FFA726',
  secondaryLight: '#FFD54F',
  secondaryDark: '#F57C00',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#D32F2F',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E0E0E0',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const PRAYER_NAMES = {
  FAJR: 'Fajr',
  DHUHR: 'Dhuhr',
  ASR: 'Asr',
  MAGHRIB: 'Maghrib',
  ISHA: 'Isha',
  JUMAH: "Jumu'ah",
};

export const VALIDATION_THRESHOLD = 50; // Number of users required to validate prayer times

export const MAX_SEARCH_RADIUS = 50; // Maximum search radius in kilometers
export const DEFAULT_SEARCH_RADIUS = 10; // Default search radius in kilometers

export const API_ENDPOINTS = {
  MOSQUES: '/mosques',
  PRAYER_TIMES: '/prayer-times',
  TESTIMONIALS: '/testimonials',
  CROWD_DENSITY: '/crowd-density',
  COMMITTEE_APPROVAL: '/committee/approval',
};

export const NOTIFICATION_TYPES = {
  PRAYER_REMINDER: 'prayer-reminder',
  MOSQUE_UPDATE: 'mosque-update',
  CROWD_ALERT: 'crowd-alert',
  COMMITTEE_APPROVAL: 'committee-approval',
};

export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_PREFERENCES: '@user_preferences',
  CACHED_MOSQUES: '@cached_mosques',
  OFFLINE_DATA: '@offline_data',
};
