import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';

export default function UserTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = window.localStorage.getItem('token');  // Assuming token is stored on login
      const userId = window.localStorage.getItem('userId'); // Store userId in localStorage after login/signup

      try {
        const response = await axios.get(`/api/tasks/user-tasks/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },  // Send token for authorization if required
        });
        setTasks(response.data.tasks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

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
