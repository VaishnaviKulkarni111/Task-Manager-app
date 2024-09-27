import React, { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components

export default function AdminHome({ userData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = () => {
    fetch("http://localhost:5000/getAllUser", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setData(data.data);
      });
  };

  const deleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      fetch("http://localhost:5000/deleteUser", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          userid: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          getAllUser();
        });
    }
  };

  return (
    <Container fluid className="mt-4" style={{ marginLeft: '150px' }}> {/* Adjust margin for Navbar */}
      <Row className="justify-content-center mb-4">
        <Col xs="auto">
          <h3 className="text-center">Registered Users</h3> {/* Center the heading */}
        </Col>
      </Row>
      <Table striped bordered hover style={{ width: '80%', margin: '0 auto' }}> {/* Adjusted table width */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((i) => (
            <tr key={i._id}>
              <td>{i.fname}</td>
              <td>{i.email}</td>
              <td>{i.userType}</td>
              <td>
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => deleteUser(i._id, i.fname)}
                  style={{ cursor: 'pointer', color: 'red' }} // Change icon color to red
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
