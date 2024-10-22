// controllers/taskController.js
const axios = require('axios');

const assignTask = async (req, res) => {
  try {
    // Existing task assignment logic
    const task = new Task({
      name: req.body.name,
      assignedTo: req.body.assignedTo,
      status: 'Assigned',
      // other task fields...
    });
    
    await task.save();

    // Send Slack notification after task is assigned
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL; // Retrieve from .env
    const slackMessage = {
      text: `Task "${task.name}" has been assigned to you. Check your dashboard for more details.`,
    };

    await axios.post(slackWebhookUrl, slackMessage);

    res.status(201).json({ message: 'Task assigned and Slack notification sent.' });
  } catch (error) {
    console.error('Error assigning task or sending Slack notification:', error);
    res.status(500).json({ error: 'Task assignment failed' });
  }
};

module.exports = { assignTask };
