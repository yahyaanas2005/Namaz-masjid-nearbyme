import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrayerTimes, PrayerTimeReport } from '@models/Mosque';

interface PrayerTimeState {
  currentPrayerTime: string | null;
  nextPrayerTime: string | null;
  userReports: PrayerTimeReport[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PrayerTimeState = {
  currentPrayerTime: null,
  nextPrayerTime: null,
  userReports: [],
  isLoading: false,
  error: null,
};

const prayerTimeSlice = createSlice({
  name: 'prayerTimes',
  initialState,
  reducers: {
    setCurrentPrayerTime: (state, action: PayloadAction<string>) => {
      state.currentPrayerTime = action.payload;
    },
    setNextPrayerTime: (state, action: PayloadAction<string>) => {
      state.nextPrayerTime = action.payload;
    },
    addPrayerTimeReport: (state, action: PayloadAction<PrayerTimeReport>) => {
      state.userReports.push(action.payload);
    },
    clearPrayerTimeReports: state => {
      state.userReports = [];
    },
    setPrayerTimeError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentPrayerTime,
  setNextPrayerTime,
  addPrayerTimeReport,
  clearPrayerTimeReports,
  setPrayerTimeError,
} = prayerTimeSlice.actions;

export default prayerTimeSlice.reducer;
