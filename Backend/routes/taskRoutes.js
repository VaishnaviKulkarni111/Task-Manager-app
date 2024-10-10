const express = require('express');
const router = express.Router();
const Task = require('../models/taskSchema');
const User = require('../models/userSchema');

// POST: Admin adds a new task
router.post('/add-task', async (req, res) => {
  const { name, status, assignedTo } = req.body;

  try {
    // Ensure the assigned user exists
    const user = await User.findOne({ _id: assignedTo });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newTask = await Task.create({
      name,
      status,
      assignedTo,
    });

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// GET: Fetch all tasks (for admin)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// GET: Fetch tasks assigned to a user
router.get('/user-tasks/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ assignedTo: userId });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// PATCH: Update task (for example, to change the status or name)
// PATCH: Update task
router.patch('/update-task/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { name, status, assignedTo } = req.body;
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { name, status, assignedTo },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating task' });
    }
  });
  



  
  // DELETE: Delete task
router.delete('/delete-task/:taskId', async (req, res) => {
    const { taskId } = req.params;
  
    try {
      const deletedTask = await Task.findByIdAndDelete(taskId);
  
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting task' });
    }
  });

  //users tasks display
  
  router.get('/user-tasks/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const tasks = await Task.find({ assignedTo: userId });
      res.status(200).json({ tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  });
  

module.exports = router;
