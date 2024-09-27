import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
        window.localStorage.setItem('token', data.data);
        window.localStorage.setItem('loggedIn', true);
        
        // Return the token and userType if available
        return { token: data.data, userType: data.userType };
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
          return data; // Assuming data contains {token, userType}
        } else {
          return rejectWithValue(data.message); // Pass the error message for rejection
        }
      } catch (error) {
        return rejectWithValue(error.message); // Handle network errors
      }
    }
  );
  

// Initial state
const initialState = {
  token: null,
  userType: null,
  user: null,
  loading: false,
  error: null,
};

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
