const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const userActions = require("./routes/userActions");
const addUser = require("./routes/addUser")
const taskRoutes = require("./routes/taskRoutes")
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));


const mongoUrl = "mongodb+srv://vaishnavirk2203:mbZiezno1OlnZg9h@diet-planner.4pdqs.mongodb.net/?retryWrites=true&w=majority&appName=Diet-Planner";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsInsecure: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

// Include user routes
app.use(userRoutes);
app.use("/api", userActions); 
app.use("/api/tasks", taskRoutes)
app.use(addUser)
app.listen(5000, () => {
  console.log("Server Started");
});
