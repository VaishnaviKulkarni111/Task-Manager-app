import React, { useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTasks } from '../store/taskSlice';

export default function UserTasks() {
  const dispatch = useDispatch();
  const { tasks = [], loading = false, error = null } = useSelector((state) => state.tasks || {}); // Fallback to ensure destructuring
  const { user } = useSelector((state) => state.auth); // Get the user from auth slice

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchUserTasks(user._id)); // Fetch tasks for the logged-in user
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
