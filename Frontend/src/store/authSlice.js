import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Initial state
const initialState = {
  token: null,
  userType: null,
  user: null,
  loading: false,
  error: null,
};
// Async action for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/login-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.status === 'ok') {
        // Store token and userType locally
        window.localStorage.setItem('token', data.data.token);
        window.localStorage.setItem('loggedIn', true);
        window.localStorage.setItem('userType', data.data.userType);
        // Return the token and userType if available
        return { token: data.data.token,
           userType: data.data.userType,
           user: data.data.user, 
           };
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async action for register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ fname, lname, email, password, userType }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname,
          lname,
          email,
          password,
          userType,
        }),
      });
      const data = await response.json();

      if (data.status === 'ok') {
        return { token: data.data.token, userType: data.data.userType }; // Return token and userType
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null; // Clear userType on logout
      window.localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    // Handle login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token; // Store the token
        state.userType = action.payload.userType; // Store the userType
        state.user = action.payload.user; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token; // Store the token
        state.userType = action.payload.userType; // Store the userType
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the logout action
export const { logout } = authSlice.actions;

export default authSlice.reducer;
