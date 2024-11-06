const express = require('express');
const Task = require('../models/taskSchema');
const User = require('../models/userSchema');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    const activeUsers = await User.countDocuments(); // Assuming all users are active

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      activeUsers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

module.exports = router;
