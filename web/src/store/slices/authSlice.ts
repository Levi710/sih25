import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const signInAnonymously = createAsyncThunk(
  'auth/signInAnonymously',
  async () => {
    // Simulated local auth
    const user = {
      uid: `anonymous_${Date.now()}`,
      isAnonymous: true,
      name: 'Guest User'
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    loadUser: (state) => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        state.user = JSON.parse(storedUser);
        state.isAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAnonymously.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      });
  },
});

export const { signOut, loadUser } = authSlice.actions;
export default authSlice.reducer;
