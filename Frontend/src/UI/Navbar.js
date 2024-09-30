import React from 'react';
import './Navbar.css'; 
import { Link } from 'react-router-dom';

const Navbar = () => {
    const userType = window.localStorage.getItem('userType');
  console.log('usertype', userType)
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {userType === 'Admin' && ( 
          <li className="nav-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
        )}
        {userType === 'User' && ( 
          <li className="nav-item">
            <Link to="/userboard">U.Dashboard</Link>
          </li>
        )}
        <li className="nav-item">
          <Link to="/tasks">Tasks</Link>
        </li>
        <li className="nav-item">
          <Link to="/userDetails">Users</Link>
        </li>
        <li className="nav-item">
          <Link to="/settings">Settings</Link>
        </li>
        <li className="nav-item">
          <button onClick={logOut} className="btn btn-primary">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
