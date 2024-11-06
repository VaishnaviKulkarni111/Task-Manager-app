import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice'; 
import taskReducer from './taskSlice';
import dashboardReducer from './dashboardSlice'; 
const store = configureStore({
  reducer: {
    user: userReducer, // User slice reducer
    auth: authReducer, 
    task: taskReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
