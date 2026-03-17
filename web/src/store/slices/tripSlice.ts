import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LocationPoint, mlService, TravelMode } from '../../lib/mlService';
import { cloudSync } from '../../lib/cloudSync';
import { User } from './authSlice';

export interface Trip {
  id: string;
  startTime: number;
  endTime?: number;
  locations: LocationPoint[];
  isActive: boolean;
  predictedMode?: TravelMode;
  distance?: number;
  duration?: number;
  synced?: boolean;
}

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  isTracking: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: TripState = {
  trips: [],
  currentTrip: null,
  isTracking: false,
  loading: false,
  error: null,
};

export const startTrip = createAsyncThunk(
  'trips/start',
  async (startLocation: LocationPoint) => {
    const startTime = Date.now();
    const trip: Trip = {
      id: `trip_${startTime}`,
      startTime,
      locations: [startLocation],
      isActive: true,
    };
    return trip;
  }
);

export const stopTrip = createAsyncThunk(
  'trips/stop',
  async (_, { getState }) => {
    const state = getState() as { trips: TripState };
    const { currentTrip } = state.trips;
    
    if (!currentTrip) return null;

    const endTime = Date.now();
    const duration = endTime - currentTrip.startTime;
    const predictedMode = await mlService.predictTravelMode({
      locations: currentTrip.locations,
      duration
    });
    
    const distance = mlService.calculateTotalDistance(currentTrip.locations);

    const completedTrip: Trip = {
      ...currentTrip,
      endTime,
      duration,
      predictedMode,
      distance,
      isActive: false,
    };

    // Save to local storage
    const savedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    localStorage.setItem('trips', JSON.stringify([completedTrip, ...savedTrips]));

    return completedTrip;
  }
);

export const syncTripsThunk = createAsyncThunk(
  'trips/sync',
  async (_, { getState }) => {
    const state = getState() as { trips: TripState, auth: { user: User | null } };
    const { trips } = state.trips;
    const { user } = state.auth;
    const result = await cloudSync.syncToCloud(trips, user?.uid || 'guest');
    return result;
  }
);

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addPoint: (state, action: PayloadAction<LocationPoint>) => {
      if (state.currentTrip) {
        state.currentTrip.locations.push(action.payload);
      }
    },
    loadTrips: (state) => {
      const stored = localStorage.getItem('trips');
      if (stored) {
        state.trips = JSON.parse(stored);
      }
    },
    deleteTrip: (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter(t => t.id !== action.payload);
      localStorage.setItem('trips', JSON.stringify(state.trips));
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTrips: (state) => {
      state.trips = [];
      localStorage.removeItem('trips');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startTrip.fulfilled, (state, action) => {
        state.currentTrip = action.payload;
        state.isTracking = true;
      })
      .addCase(stopTrip.fulfilled, (state, action) => {
        if (action.payload) {
          state.trips.unshift(action.payload);
        }
        state.currentTrip = null;
        state.isTracking = false;
      })
      .addCase(syncTripsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncTripsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = state.trips.map(t => ({ ...t, synced: true }));
        localStorage.setItem('trips', JSON.stringify(state.trips));
      });
  },
});

export const { addPoint, loadTrips, clearError, deleteTrip, clearTrips } = tripSlice.actions;
export default tripSlice.reducer;
