import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  userData: {},
  isAdmin: false,
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
  userType: null,
};

// Async thunk to fetch user data from API
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/userData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      
      if (data.data === "token expired") {
        window.localStorage.clear();
        window.location.href = "./sign-in";
        return rejectWithValue('Token expired, login again');
      }

      return data.data; // Return the user data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.userType = action.payload.userType; 
      state.isAdmin = action.payload.userType === 'Admin';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userData = action.payload;
        state.isAdmin = action.payload.userType === 'Admin';
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the setUserData action
export const { setUserData } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
