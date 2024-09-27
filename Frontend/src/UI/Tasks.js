import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Design the UI", status: "Completed", assignedTo: "John Doe" },
    { id: 2, name: "Develop the backend", status: "In Progress", assignedTo: "Jane Smith" },
    // Add more initial tasks if needed
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Pending");

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: newTaskName,
      status: status,
      assignedTo: assignedTo,
    };
    setTasks([...tasks, newTask]);
    setShowModal(false);
    setNewTaskName("");
    setAssignedTo("");
    setStatus("Pending");
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <div className="mt-4" style={{ marginLeft: '150px' }}>
      <section className="tasks-table mb-4">
        <h2>Task Management Overview</h2>
        <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
          Add New Task
        </Button>
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th scope="col">Task Name</th>
              <th scope="col">Status</th>
              <th scope="col">Assigned To</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.status}</td>
                <td>{task.assignedTo}</td>
                <td>
                  <Button variant="outline-secondary" size="sm" className="me-2">Edit</Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal for adding new task */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="taskName">
              <Form.Label>Task Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter task name" 
                value={newTaskName} 
                onChange={(e) => setNewTaskName(e.target.value)} 
              />
            </Form.Group>
            <Form.Group controlId="assignedTo">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter assignee's name" 
                value={assignedTo} 
                onChange={(e) => setAssignedTo(e.target.value)} 
              />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
