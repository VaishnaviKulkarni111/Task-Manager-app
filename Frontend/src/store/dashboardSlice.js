import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk('dashboard/fetchData', async () => {
  const response = await axios.get('http://localhost:5000/dashboard'); 
  return response.data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    activeUsers: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.totalTasks = action.payload.totalTasks;
        state.completedTasks = action.payload.completedTasks;
        state.pendingTasks = action.payload.pendingTasks;
        state.activeUsers = action.payload.activeUsers;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
