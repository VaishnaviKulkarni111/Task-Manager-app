import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  tasks: [],
  status: 'idle',
  loading: false,
  error: null,
};

// Async thunk to create a task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks/add-task', taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update task status
// Async thunk to update task details (name, status, assignedTo)
// Async thunk to update task details (name, status, assignedTo)
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ taskId, name, status, assignedTo }, { rejectWithValue }) => {
      try {
        const response = await axios.patch(`http://localhost:5000/api/tasks/update-task/${taskId}`, {
          name,
          status,
          assignedTo,
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  
// Async thunk to delete a task
export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId, { rejectWithValue }) => {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/delete-task/${taskId}`);
        return taskId;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  // Async thunk to fetch tasks for the logged-in user
export const fetchUserTasks = createAsyncThunk(
    'tasks/fetchUserTasks',
    async (userId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/user-tasks/${userId}`);
        return response.data.tasks;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object') {
          state.tasks.push(action.payload); // Ensure the payload is valid
        } else {
          console.error('Create task payload is invalid:', action.payload);
        }
        state.loading = false;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        // Check if the payload contains tasks array and assign it
        if (action.payload && Array.isArray(action.payload.tasks)) {
          state.tasks = action.payload.tasks; // Assign the tasks array
        } else {
          console.error('Fetch tasks payload does not contain a valid tasks array:', action.payload);
          state.tasks = []; // Fallback to an empty array
        }
        state.loading = false;
      })
      
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index].status = action.payload.status;
        }
        state.loading = false;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.loading = false;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
     ;
  }
});

export default taskSlice.reducer;
export const taskActions = taskSlice.actions;
