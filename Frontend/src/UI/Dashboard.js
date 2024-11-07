import React, { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../store/dashboardSlice'
import './Dashboard.css'; // Custom styles to complement Bootstrap

const Dashboard = () => {
  const dispatch = useDispatch();
  
  // Access dashboard data from Redux store
  const { totalTasks, completedTasks, pendingTasks, activeUsers, loading, error } = useSelector((state) => state.dashboard);
 
  // Fetch dashboard data when the component loads
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <div className="dashboard d-flex">
      {/* Adjust content to fit with your existing Navbar */}
      <div className="dashboard-content flex-grow-1 p-4">
        <header className="mb-4">
          <h1 className="display-6">Welcome, Admin!</h1>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading dashboard data: {error}</p>
        ) : (
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card text-white bg-primary mb-3 h-100">
                <div className="card-body">
                  <h5 className="card-title">Total Tasks</h5>
                  <p className="card-text fs-4">{totalTasks}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success mb-3 h-100">
                <div className="card-body">
                  <h5 className="card-title">Completed Tasks</h5>
                  <p className="card-text fs-4">{completedTasks}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning mb-3 h-100">
                <div className="card-body">
                  <h5 className="card-title">Pending Tasks</h5>
                  <p className="card-text fs-4">{pendingTasks}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-info mb-3 h-100">
                <div className="card-body">
                  <h5 className="card-title">Active Users</h5>
                  <p className="card-text fs-4">{activeUsers}</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
