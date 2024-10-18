import React, { useEffect } from 'react';
import "./UserTasks.css";
import { Container, Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTasks, updateTaskStatus } from '../store/taskSlice';

export default function UserTasks() {
  const dispatch = useDispatch();

  // Check if the user exists in auth slice
  const user = useSelector((state) => state.user.userData);

  // Get tasks from task slice, with a fallback to an empty array
  const { tasks = [], loading = false, error = null } = useSelector((state) => {
    return state.task || {};
  });

  useEffect(() => {
    // Ensure we only dispatch fetchUserTasks if user exists
    if (user && user._id) {
      dispatch(fetchUserTasks(user._id)); // Dispatch with correct user ID
    }
  }, [dispatch, user]);
// Handle status update
const handleUpdateStatus = async (taskId, newStatus) => {
  try {
    await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap(); // Dispatch status update action
    // Fetch the updated list of tasks after the status change
     dispatch(fetchUserTasks(user._id)); // Refetch tasks
    console.log('Task status updated successfully');
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};

  return (
    <Container className="table-container">
    <h2>Your Assigned Tasks</h2>
    <div className="table-responsive">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : tasks.length > 0 ? (
        <Table striped bordered hover>
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
                <td>
                  <Button variant="success" size="sm" onClick={() => handleUpdateStatus(task._id, 'In Progress')}>
                    In Progress
                  </Button>{' '}
                  <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(task._id, 'Completed')}>
                    Completed
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  </Container>
  
  );
}
