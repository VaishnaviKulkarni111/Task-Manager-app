import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminHome from "./adminHome";
import UserHome from "./userHome";
import { Button, Container,Form,Modal } from "react-bootstrap"; // Bootstrap components
import { fetchUserData } from "../store/userSlice";
import { addUser } from "../store/userSlice";


export default function UserDetails() {
  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "Password123" }); // Static password
  
  const dispatch = useDispatch();
  const { userData, isAdmin, status, error } = useSelector((state) => state.user);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(addUser(newUser));
      handleClose();
    };
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserData(token));
    }
  }, [dispatch]);

  return (
    <Container className="mt-4">
      {status === "loading" ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : isAdmin ? (
        <>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={handleShow}>
              Add New User
            </Button>
             {/* Modal for adding a new user */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter user name"
                value={newUser.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter user email"
                value={newUser.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={newUser.password}
                disabled
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
          </div>
          <AdminHome />
        </>
      ) : (
        <UserHome userData={userData} />
      )}
    </Container>
  );
}