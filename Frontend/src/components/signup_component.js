import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/authSlice"; // Import the registerUser action
import styles from "./auth.module.css"; // Import the module CSS

export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if Admin and secret key is correct
    if (userType === "Admin" && secretKey !== "captainjacksparrow") {
      alert("Invalid Admin Secret Key");
      return; // Exit the function if admin validation fails
    }

    console.log(fname, lname, email, password);

    // Dispatch registration action
    dispatch(registerUser({ fname, lname, email, password, userType }))
    .unwrap()
    .then((data) => {
      console.log("Full response data from backend:", data);  // Log the full response
      
      // Check if token and userType exist in the response
      const token = data?.token;  // Use optional chaining
      const userType = data?.userType;
      
      if (token && userType) {
        alert("Registration Successful");
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("userType", userType);
        window.localStorage.setItem("loggedIn", true); // 

        // Redirect based on userType
        if (userType === "Admin") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/tasks";
        }
      } else {
        alert("Something went wrong: Invalid response structure");
        console.log("No token or userType in response: ", data);
      }
    })
    .catch((error) => {
      console.error("Error during registration:", error);
      alert(`An error occurred: ${error.message || error}`);
    });
  

  };

  return (
    <div className={styles.auth}>

    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>

          <div className="d-flex align-items-center mb-4">
            <span className="me-3">Register As:</span>
            <div className="form-check me-2">
              <input
                className="form-check-input"
                type="radio"
                name="UserType"
                id="userTypeUser"
                value="User"
                onChange={(e) => setUserType(e.target.value)}
                required
              />
              <label className="form-check-label" htmlFor="userTypeUser">
                User
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="UserType"
                id="userTypeAdmin"
                value="Admin"
                onChange={(e) => setUserType(e.target.value)}
                required
              />
              <label className="form-check-label" htmlFor="userTypeAdmin">
                Admin
              </label>
            </div>
          </div>

          {/* Show secret key field if Admin is selected */}
          {userType === "Admin" && (
            <div className="mb-3">
              <label>Secret Key</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Secret Key"
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
          )}

          <div className="mb-3">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              onChange={(e) => setLname(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered? <a href="/sign-in">Sign in</a>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
}
