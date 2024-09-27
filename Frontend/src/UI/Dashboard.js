import React from 'react';
import './Dashboard.css'; // Custom styles to complement Bootstrap

const Dashboard = () => {


  return (
    <div className="dashboard d-flex">
      {/* Adjust content to fit with your existing Navbar */}
      <div className="dashboard-content flex-grow-1 p-4">
        <header className="mb-4">
          <h1 className="display-6">Welcome, Admin!</h1>
        </header>
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card text-white bg-primary mb-3 h-100">
              <div className="card-body">
                <h5 className="card-title">Total Tasks</h5>
                <p className="card-text fs-4">100</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success mb-3 h-100">
              <div className="card-body">
                <h5 className="card-title">Completed Tasks</h5>
                <p className="card-text fs-4">80</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning mb-3 h-100">
              <div className="card-body">
                <h5 className="card-title">Pending Tasks</h5>
                <p className="card-text fs-4">20</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-info mb-3 h-100">
              <div className="card-body">
                <h5 className="card-title">Active Users</h5>
                <p className="card-text fs-4">50</p>
              </div>
            </div>
          </div>
        </div>
        
        <section className="recent-activities">
          <h2>Recent Activities</h2>
          <ul className="list-group">
            <li className="list-group-item">User X completed "Task A"</li>
            <li className="list-group-item">User Y updated "Task B"</li>
            {/* Add more activities */}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
