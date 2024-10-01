const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema"); // Import the User model

const router = express.Router();
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// POST request to add a new user (Admin only)
router.post("/addUser", async (req, res) => {
  const { name, email, password } = req.body;

  // Hash the password
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if user already exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ status: "error", error: "User already exists" });
    }

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
      userType: "User",  // Default role is 'User'
    });

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { email: newUser.email, userType: newUser.userType },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with success and the user data
    res.status(201).json({
      status: "ok",
      data: {
        token: token,
        userType: newUser.userType,
      },
      message: "New user added successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error adding user" });
  }
});

module.exports = router;
