import React, { useState } from "react";
import { useDispatch } from "react-redux"; 
import { registerUser } from "../store/authSlice"; // Import the registerUser action

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
  
    if (userType === "Admin" && secretKey !== "captainjacksparrow") {
      alert("Invalid Admin");
      return; // Exit the function if admin validation fails
    }
  
    console.log(fname, lname, email, password);
  
    dispatch(registerUser({ fname, lname, email, password, userType }))
    .unwrap()
    .then((data) => {
      console.log(data);  // Log the entire response
      if (data.status === "ok") {
        alert("Registration Successful");
  
        // Check if token and userType exist before accessing them
        const token = data?.data?.token;  // Use optional chaining
        const userType = data?.data?.userType;
  
        if (token && userType) {
          window.localStorage.setItem("token", token);
          window.localStorage.setItem("userType", userType);
  
          // Redirect based on userType
          if (userType === "Admin") {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/tasks";
          }
        } else {
          alert("User registration succeeded, but no token received.");
          console.log("No token or userType in response: ", data?.data);
        }
      } else {
        alert("Something went wrong");
      }
    })
    .catch((error) => {
      console.error("Error during registration:", error);
      alert(`An error occurred: ${error.message || error}`);
    });
  
  
  };
  

  return (
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

          {userType === "Admin" && (
            <div className="mb-3">
              <label>Secret Key</label>
              <input
                type="text"
                className="form-control"
                placeholder="Secret Key"
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
          )}

          <div className="mb-3">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
              required
            />
          </div>

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

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <a href="/sign-in">sign in?</a>
          </p>
        </form>
      </div>
    </div>
  );
}
