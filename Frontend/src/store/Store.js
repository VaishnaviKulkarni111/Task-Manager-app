import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice'; 
import taskReducer from './taskSlice';

const store = configureStore({
  reducer: {
    user: userReducer, // User slice reducer
    auth: authReducer, 
    task: taskReducer,
  },
});

export default store;
