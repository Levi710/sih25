import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSettings {
  trackingEnabled: boolean;
  pushNotifications: boolean;
  consentStatus: boolean;
  dataRetentionDays: number;
  hasCompletedWelcome: boolean;
}

const initialState: UserSettings = {
  trackingEnabled: true,
  pushNotifications: true,
  consentStatus: false,
  dataRetentionDays: 30,
  hasCompletedWelcome: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTrackingEnabled: (state, action: PayloadAction<boolean>) => {
      state.trackingEnabled = action.payload;
    },
    setPushNotifications: (state, action: PayloadAction<boolean>) => {
      state.pushNotifications = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      return { ...state, ...action.payload };
    },
    completeWelcome: (state) => {
      state.hasCompletedWelcome = true;
      state.consentStatus = true;
    }
  }
});

export const { setTrackingEnabled, setPushNotifications, updateSettings, completeWelcome } = userSlice.actions;
export default userSlice.reducer;
