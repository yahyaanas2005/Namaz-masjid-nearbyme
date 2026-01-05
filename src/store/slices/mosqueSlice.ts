import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mosque, Testimonial } from '@models/Mosque';

interface MosqueState {
  nearbyMosques: Mosque[];
  selectedMosque: Mosque | null;
  isLoading: boolean;
  error: string | null;
  searchRadius: number; // in kilometers
}

const initialState: MosqueState = {
  nearbyMosques: [],
  selectedMosque: null,
  isLoading: false,
  error: null,
  searchRadius: 10,
};

const mosqueSlice = createSlice({
  name: 'mosques',
  initialState,
  reducers: {
    fetchMosquesStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMosquesSuccess: (state, action: PayloadAction<Mosque[]>) => {
      state.isLoading = false;
      state.nearbyMosques = action.payload;
      state.error = null;
    },
    fetchMosquesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectMosque: (state, action: PayloadAction<Mosque>) => {
      state.selectedMosque = action.payload;
    },
    clearSelectedMosque: state => {
      state.selectedMosque = null;
    },
    updateMosquePrayerTimes: (
      state,
      action: PayloadAction<{ mosqueId: string; prayerTimes: any }>,
    ) => {
      const mosque = state.nearbyMosques.find(m => m.id === action.payload.mosqueId);
      if (mosque) {
        mosque.prayerTimes = action.payload.prayerTimes;
      }
      if (state.selectedMosque?.id === action.payload.mosqueId) {
        state.selectedMosque.prayerTimes = action.payload.prayerTimes;
      }
    },
    addTestimonial: (state, action: PayloadAction<{ mosqueId: string; testimonial: Testimonial }>) => {
      const mosque = state.nearbyMosques.find(m => m.id === action.payload.mosqueId);
      if (mosque) {
        mosque.testimonials.push(action.payload.testimonial);
      }
      if (state.selectedMosque?.id === action.payload.mosqueId) {
        state.selectedMosque.testimonials.push(action.payload.testimonial);
      }
    },
    updateSearchRadius: (state, action: PayloadAction<number>) => {
      state.searchRadius = action.payload;
    },
  },
});

export const {
  fetchMosquesStart,
  fetchMosquesSuccess,
  fetchMosquesFailure,
  selectMosque,
  clearSelectedMosque,
  updateMosquePrayerTimes,
  addTestimonial,
  updateSearchRadius,
} = mosqueSlice.actions;

export default mosqueSlice.reducer;
