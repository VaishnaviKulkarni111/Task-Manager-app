import React, { useEffect } from 'react';
import styles from "./UserTasks.module.css"; // Import the module CSS
import {  Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTasks, updateTaskStatus } from '../store/taskSlice';

export default function UserTasks() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.userData);

  const { tasks = [], loading = false, error = null } = useSelector((state) => {
    return state.task || {};
  });

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchUserTasks(user._id)); // Dispatch with correct user ID
    }
  }, [dispatch, user]);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap(); // Dispatch status update action
      dispatch(fetchUserTasks(user._id)); // Refetch tasks
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className={styles['table-container']}> 
      <h2>Your Assigned Tasks</h2>
      <div className={styles["table-responsive"]}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : tasks.length > 0 ? (
          <Table striped bordered hover className={styles.table}>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.status}</td>
                  <td className="action-column">
  <div className={styles["action-buttons"]}>
    <Button
      variant="success"
      size="sm"
      onClick={() => handleUpdateStatus(task._id, 'In Progress')}
    >
      In Progress
    </Button>
    <Button
      variant="primary"
      size="sm"
      onClick={() => handleUpdateStatus(task._id, 'Completed')}
    >
      Completed
    </Button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No tasks assigned to you.</p>
        )}
      </div>
    </div>
  );
}
