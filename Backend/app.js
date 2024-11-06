const express = require("express");
require('dotenv').config();

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const userActions = require("./routes/userActions");
const addUser = require("./routes/addUser")
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes")
const slackController = require("./controllers/slackController");

app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));


const mongoUrl = "mongodb+srv://vaishnavirk2203:mbZiezno1OlnZg9h@diet-planner.4pdqs.mongodb.net/?retryWrites=true&w=majority&tls=true&appName=Diet-Planner"
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
     useUnifiedTopology: true,
    // tlsAllowInvalidCertificates: true, 
    tlsInsecure: false,
    ssl: true,
  })
  .then(() => {
    mongoose.set('bufferCommands', false); // Disable buffering
    mongoose.set('bufferTimeoutMS', 20000);
    console.log("Connected to database");

  })
  .catch((e) => console.log(e));

// Include user routes
app.use(userRoutes);
app.use("/api", userActions); 
app.use("/api/tasks", taskRoutes);
app.use(dashboardRoutes)
app.post('/slack/assign', (req, res, next) => {
  console.log('POST /slack/assign route hit');
  next(); // Continue to the controller
}, slackController.assignTask);

app.use(addUser)
app.listen(5000, () => {
  console.log("Server Started");
});
