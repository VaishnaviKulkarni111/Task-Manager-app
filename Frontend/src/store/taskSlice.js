import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for the tasks slice
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
      // First, create the task
      const taskResponse = await axios.post('http://localhost:5000/api/tasks/add-task', taskData);
      const createdTask = taskResponse.data.task;
      console.log("Created Task:", createdTask);

      // Fetch user email based on assignedTo ID
      const userResponse = await axios.get(`http://localhost:5000/${createdTask.assignedTo}`);
      const userEmail = userResponse.data.email; // Adjust based on your backend response

      // Send Slack notification if we successfully retrieved the email
      if (userEmail) {
        const slackResponse = await axios.post('http://localhost:5000/slack/assign', {
          name: createdTask.name,
          assignedTo: userEmail,
        });
        console.log("Slack Response:", slackResponse.data);
      }

      return createdTask;
    } catch (error) {
      console.error("Error in createTask:", error);
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk to fetch all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      return response.data.tasks; // Return the tasks array
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update task details
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, name, status, assignedTo }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/tasks/update-task/${taskId}`, {
        name,
        status,
        assignedTo,
      });
      return response.data.task; // Return the updated task
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
      return taskId; // Return the taskId to remove it from the state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch tasks for the logged-in user
export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (userId, { rejectWithValue }) => {
    console.log("Dispatching fetchUserTasks for user ID:", userId); // Log when the function is called
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/user-tasks/${userId}`);
      console.log('API response:', response.data); // Log the API response
      return response.data.tasks;
    } catch (error) {
      console.log("Error fetching tasks:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/tasks/update-task-status/${taskId}`, {
        status,
      });
      return response.data.task; // Return updated task data
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error in updateTaskStatus:', error);
      // Return a rejection with a more detailed error message
      return rejectWithValue(error.response ? error.response.data : 'Server Error');
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
        if (action.payload) {
          state.tasks.push(action.payload); // Add the new task to the state
        } else {
          console.error('Create task payload is invalid:', action.payload);
        }
        state.loading = false;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          state.tasks = action.payload; // Set the fetched tasks
        } else {
          console.error('Fetch tasks payload does not contain a valid tasks array:', action.payload);
          state.tasks = []; // Reset to empty array if invalid
        }
        state.loading = false;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id); // Use _id for comparison
        if (index !== -1) {
          state.tasks[index] = action.payload; // Update the task details
        }
        state.loading = false;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload); // Remove the deleted task
        state.loading = false;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.tasks = action.payload; // Set the tasks for the user
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching tasks';
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        // Successfully updated task status
        const updatedTask = action.payload;
        state.tasks = state.tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
        state.error = null;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload || 'Error updating task status';
        console.error('Fetch User Tasks Error:', state.error); // Log the exact error
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true; // Set loading to true on pending
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.error("Fetch User Tasks Error:", action.payload); // Log errors
        }
      ) 
    ;
  },
});

export default taskSlice.reducer;
export const taskActions = taskSlice.actions;
