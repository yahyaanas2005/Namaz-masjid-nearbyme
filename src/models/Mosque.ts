export interface Location {
  latitude: number;
  longitude: number;
}

export interface Mosque {
  id: string;
  name: string;
  address: string;
  location: Location;
  distance?: number; // Distance from user in kilometers
  prayerTimes: PrayerTimes;
  committeeApproved: boolean;
  committeeApprovalDate?: Date;
  crowdDensity: CrowdDensity;
  testimonials: Testimonial[];
  historicalPrayerTimes: HistoricalPrayerTime[];
  facilities?: string[];
  photoUrl?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumah?: string;
  lastUpdated: Date;
  validatedByCount: number; // Number of users who validated these times
  isValidated: boolean; // True if >= 50 users confirmed
}

export interface PrayerTimeReport {
  id: string;
  mosqueId: string;
  userId: string;
  prayerName: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumah';
  reportedTime: string;
  reportedAt: Date;
  season?: 'winter' | 'summer' | 'spring' | 'fall';
}

export interface CrowdDensity {
  currentCount: number;
  averageCount: number;
  peakHours: { [key: string]: number }; // Prayer name to average attendance
  lastUpdated: Date;
}

export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  mosqueId: string;
  rating: number; // 1-5
  comment: string;
  prayerTimeAccuracy: number; // 1-5
  facilities: number; // 1-5
  cleanliness: number; // 1-5
  createdAt: Date;
  likes: number;
}

export interface HistoricalPrayerTime {
  id: string;
  mosqueId: string;
  date: Date;
  prayerTimes: PrayerTimes;
  season: 'winter' | 'summer' | 'spring' | 'fall';
  validatedByCount: number;
}

export interface MosqueCommitteeApproval {
  mosqueId: string;
  committeeId: string;
  committeeMemberName: string;
  approvedPrayerTimes: PrayerTimes;
  approvalDate: Date;
  endorsementNote?: string;
}
