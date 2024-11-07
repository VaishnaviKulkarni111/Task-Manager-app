import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { loginUser } from "../store/authSlice"; // Import the loginUser action
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import styles from "./auth.module.css"; // Import the module CSS

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch(); // Initialize useDispatch
  const navigate = useNavigate(); // Initialize useNavigate

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(email, password);
    
    // Dispatch the loginUser action with email and password
    const resultAction = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(resultAction)) {
      // Check the userType and navigate accordingly
      const userType = resultAction.payload.userType; // Assuming userType is returned from API
      console.log("UserType from API:", userType); 
      alert("Login successful");
      
      if (userType === 'Admin') {
        navigate("/dashboard"); // Absolute path for Admin
      } else {
        navigate("/userboard"); // Absolute path for User
      }
    } else {
      // If login fails, show error message
      alert("Invalid credentials, please try again");
    }
  }

  return (
    <div className={styles.auth}>
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign In</h3>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right">
            <a href="/sign-up">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
}
