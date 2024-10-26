import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  userData: {},
  users: [],
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
  async ({ fname, lname, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fname, lname, email, password }),
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

// Async thunk to fetch all users
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/getAllUser", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Only include if required
        },
      });
      const data = await response.json();

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data; // Directly return the data object
    } catch (error) {
      console.error("Error fetching users:", error); // Debugging line
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
      // Fetch user data extra reducer
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        console.log("Fetched user data:", action.payload); // Debugging
        state.status = 'succeeded';
        state.userData = action.payload;
        state.isAdmin = action.payload.userType === 'Admin';
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        console.log("Fetch user data rejected:", action.payload); // Debugging
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch all users extra reducer
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log("Fetched all users:", action.payload); // Debugging
        state.status = 'succeeded';
        state.users = action.payload; // Store the fetched users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        console.log("Fetch users rejected:", action.payload); // Debugging
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setUserData } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
