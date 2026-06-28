import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    {
      id: 'n1',
      title: 'New Join Request',
      message: 'John Doe submitted a booking request for 2 Sharing.',
      type: 'request',
      read: false,
      timestamp: new Date(Date.now() - 15 * 60000).toISOString() // 15 mins ago
    },
    {
      id: 'n2',
      title: 'Water Tank Cleaning',
      message: 'Maintenance announcement posted by owner.',
      type: 'announcement',
      read: false,
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString() // 2 hours ago
    }
  ]
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Math.random().toString(36).substring(2, 9),
        read: false,
        timestamp: new Date().toISOString(),
        ...action.payload
      });
    },
    markAsRead: (state, action) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
    },
    clearNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
