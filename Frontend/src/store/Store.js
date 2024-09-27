import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice'; // Import the authSlice

const store = configureStore({
  reducer: {
    user: userReducer, // User slice reducer
    auth: authReducer, // Auth slice reducer for login and registration
  },
});

export default store;
