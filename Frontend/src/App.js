import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {  Routes, Route } from "react-router-dom";

import Navbar from "./UI/Navbar";
import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import UserDetails from "./components/userDetails";
import Dashboard from "./UI/Dashboard";
import Tasks from "./UI/Tasks";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <>
   {isLoggedIn === "true" && <Navbar />}
    
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={isLoggedIn === "true" ? <UserDetails /> : <Login />}
          />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/userDetails" element={<UserDetails />} />
        </Routes>
      </div>
  
    </>
  );
}

export default App;
