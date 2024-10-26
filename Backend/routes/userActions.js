const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const User = mongoose.model("UserInfo");

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

router.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
   // console.log("all user", allUser)
  } catch (error) {
    console.log(error);
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }

    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    var mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({ status: "ok", message: "Reset link sent to email" });
  } catch (error) {
    res.json({ status: "error", message: "Something went wrong" });
  }
});

// Reset Password
router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }

  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );

    res.json({ status: "ok", message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Something went wrong" });
  }
});

// Delete User
router.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    await User.deleteOne({ _id: userid });
    res.json({ status: "ok", message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Failed to delete user" });
  }
});



module.exports = router;
