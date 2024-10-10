import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, createTask, updateTask, deleteTask } from "../store/taskSlice";
import { fetchUsers } from "../store/userSlice"; // Ensure correct action is imported

export default function Tasks() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.tasks) || []; 
  const users = useSelector((state) => state.user.users) || [];
  console.log("users", users)
  const error = useSelector((state) => state.task.error);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Pending");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      dispatch(fetchUsers(token))
        .unwrap()
        .then(() => {
          dispatch(fetchTasks());
        })
        .catch((error) => {
          console.log("Error fetching users or tasks:", error);
        });
    } else {
      window.location.href = "./sign-in";
    }
  }, [dispatch]);

  const handleAddTask = () => {
    const updatedTask = {
      name: newTaskName,
      status,
      assignedTo,
    };
  
    if (editMode) {
      // Dispatch with individual fields (taskId and updated fields)
      dispatch(updateTask({ taskId: selectedTaskId, ...updatedTask })); 
      dispatch(fetchTasks())
    } else {
      dispatch(createTask(updatedTask));
      dispatch(fetchTasks())
    }
  
    resetForm();
  };
  
  const handleEditTask = (task) => {
    setEditMode(true);
    setSelectedTaskId(task._id);
    setNewTaskName(task.name);
    setAssignedTo(task.assignedTo);
    setStatus(task.status);
    setShowModal(true);
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
    dispatch(fetchTasks())
  };

  const resetForm = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedTaskId(null);
    setNewTaskName("");
    setAssignedTo("");
    setStatus("Pending");
  };

  const handleAssignToChange = (e) => {
    const input = e.target.value;
    setAssignedTo(input);
  
    // Ensure that `users` is actually an array by accessing the `data` field if needed
    const userArray = Array.isArray(users.data) ? users.data : [];
  
    setFilteredUsers(
      userArray.filter((user) =>
        user.fname.toLowerCase().includes(input.toLowerCase()) ||
        user.email.toLowerCase().includes(input.toLowerCase())
      )
    );
  };
  

  return (
    <div className="mt-4" style={{ marginLeft: "150px" }}>
      <section className="tasks-table mb-4">
        <h2>Task Management Overview</h2>
        <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
          Add New Task
        </Button>
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th scope="col">Task Name</th>
              <th scope="col">Status</th>
              <th scope="col">Assigned To</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => {
      const assignedUser = Array.isArray(users.data) ? users.data.find((user) => user._id === task.assignedTo) : null;
                return (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.status}</td>
                  <td>{assignedUser ? `${assignedUser.fname} ${assignedUser.lname}` : 'Unknown User'}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr> )
})
            ) : (
              <p>No tasks available</p>
            )}
          </tbody>
        </Table>
      </section>

      {/* Modal for adding or editing task */}
      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Task" : "Add New Task"}</Modal.Title>
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
              <Form.Label>Assign To</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or email"
                value={assignedTo}
                onChange={handleAssignToChange}
              />
              {filteredUsers.length > 0 && (
                <ul className="user-suggestions">
                  {filteredUsers.map((user) => (
                    <li key={user._id} onClick={() => setAssignedTo(user._id)}>
                      {user.fname} {user.lname} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            {editMode ? "Update Task" : "Add Task"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
