import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '@models/Mosque';

interface LocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  error: string | null;
  permissionGranted: boolean;
}

const initialState: LocationState = {
  currentLocation: null,
  isTracking: false,
  error: null,
  permissionGranted: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
      state.error = null;
    },
    startTracking: state => {
      state.isTracking = true;
    },
    stopTracking: state => {
      state.isTracking = false;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
  },
});

export const {
  setCurrentLocation,
  startTracking,
  stopTracking,
  setLocationError,
  setPermissionGranted,
} = locationSlice.actions;

export default locationSlice.reducer;
