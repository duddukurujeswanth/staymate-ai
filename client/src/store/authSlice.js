import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const token = localStorage.getItem('staymate_token');
const user = JSON.parse(localStorage.getItem('staymate_user'));

// Configure default base API URL
export const API_URL = 'http://localhost:5000/api';

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      
      localStorage.setItem('staymate_token', action.payload.token);
      localStorage.setItem('staymate_user', JSON.stringify(action.payload.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('staymate_user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('staymate_token');
      localStorage.removeItem('staymate_user');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
});

export const { authStart, authSuccess, authFailure, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
