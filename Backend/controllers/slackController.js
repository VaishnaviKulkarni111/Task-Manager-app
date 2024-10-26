const { WebClient } = require('@slack/web-api');
const Task = require("../models/taskSchema");
const User = require("../models/userSchema"); // Import your User model

// Slack client initialization
const slackToken = process.env.SLACK_BOT_TOKEN; // Ensure your bot token is stored in .env
console.log('SLACK_BOT_TOKEN:', slackToken);

const slackClient = new WebClient(slackToken);

// Helper function to get Slack User ID by email
const getUserSlackId = async (email) => {
  try {
    const response = await slackClient.users.lookupByEmail({ email });
    console.log("response", response);
    return response.user.id; // Return the Slack User ID
  } catch (error) {
    console.error(`Error fetching Slack ID for email ${email}:`, error);
    throw new Error('Slack ID retrieval failed');
  }
};

// Main assignTask function
const assignTask = async (req, res) => {
  try {
    const { name, assignedTo } = req.body;

    // Fetch the user's ObjectId using their email
    const user = await User.findOne({ email: assignedTo });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const task = new Task({
      name,
      assignedTo: user._id, // Use the ObjectId from the user
      status: 'Pending', // Default status or as needed
    });

    await task.save();

    // Get Slack User ID from email using the helper function
    const slackUserId = await getUserSlackId(assignedTo);
    console.log("Fetching Slack ID for:", slackUserId);

    if (!slackUserId) {
      return res.status(400).json({ error: 'Slack user ID could not be found' });
    }

    // Send a direct message to the assigned user on Slack
    const slackMessage = {
      channel: slackUserId, // Slack User ID
      text: `A new task "${task.name}" has been assigned to you. Check your dashboard for details.`,
    };

    await slackClient.chat.postMessage(slackMessage);

    res.status(201).json({ message: 'Task assigned and Slack notification sent.' });
  } catch (error) {
    console.error('Error assigning task or sending Slack notification:', error);
    res.status(500).json({ error: 'Task assignment failed' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(req.params.id); // Log to verify the ID received

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { assignTask, getUserSlackId, getUserById };


// https://slack.com/api/chat.postMessage