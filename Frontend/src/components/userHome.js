import React from "react";
import { useSelector } from "react-redux";

export default function UserHome() {
  const userData = useSelector((state) => state.user.userData);

  if (!userData || Object.keys(userData).length === 0) {
    return <div>Loading user data...</div>; 
  }
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
          Name<h1>{userData.fname}</h1>
          Email <h1>{userData.email}</h1>
          <br />
          <button onClick={logOut} className="btn btn-primary">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
