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
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();

      if (data.data === "token expired") {
        window.localStorage.clear();
        window.location.href = "./sign-in"; 
        return rejectWithValue('Token expired, login again');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add a new user
export const addUser = createAsyncThunk(
  'user/addUser',
  async ({ fname,lname, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fname,lname, email, password }),
      });

      const data = await response.json();

      if (data.status === 'ok') {
        return data.user; // Return the added user data
      } else {
        return rejectWithValue(data.message);
      }
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
      })
      // Handle addUser
      .addCase(addUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Optional: Add the new user data to the state
        state.userData = action.payload; // Assuming you'll handle where to store the new user data
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setUserData } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
