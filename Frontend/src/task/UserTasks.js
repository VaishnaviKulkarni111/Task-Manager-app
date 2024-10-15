import React, { useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTasks } from '../store/taskSlice';

export default function UserTasks() {
  const dispatch = useDispatch();

  // Check if the user exists in auth slice
  const user = useSelector((state) => state.user.userData);
  console.log("user", user); // Log the user to see if it's being fetched

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

  return (
    <Container className="mt-4">
      <h2>Your Assigned Tasks</h2>
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
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.name}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </Container>
  );
}
