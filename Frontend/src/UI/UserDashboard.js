import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "../store/userSlice";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    const token = window.localStorage.getItem("token"); // Retrieve token from local storage
    if (token) {
      dispatch(fetchUserData(token)); // Fetch user data
    }
  }, [dispatch]);

  // Show a loading spinner if status is loading
  if (status === 'loading') {
    return (
      <Container className="mt-4">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // Show error message if there's an error
  if (status === 'failed') {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Check if user data is available
  if (!user || Object.keys(user).length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">No user data available. Please log in.</Alert>
      </Container>
    );
  }

  return (
    <div style={{ display: 'flex', padding: '20px', backgroundColor: '#f4f4f4', boxSizing: 'border-box', marginLeft: '200px', width: 'calc(100% - 200px)' }}>
      <Container className="mt-4">
        <h2>Welcome {user.fname}</h2>
        <Row>
          {/* Dashboard Widgets */}
          <Col md={8}>
            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Recent Activities</Card.Title>
                    <Card.Text>
                      {/* Placeholder for recent activities */}
                      No recent activities.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Progress Tracker</Card.Title>
                    <Card.Text>
                      {/* Placeholder for progress tracking */}
                      Your progress will be displayed here.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          {/* User Profile Overview */}
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>
                  {user.fname} {user.lname}
                </Card.Title>
                <Card.Text>Email: {user.email}</Card.Text>
                <Button variant="primary">Edit Profile</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Notifications Area */}
        <Row>
          <Col md={12}>
            <Card className="mt-4">
              <Card.Body>
                <Card.Title>Notifications</Card.Title>
                <Card.Text>
                  {/* Placeholder for notifications */}
                  You have no new notifications.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Feedback Section */}
        <Row>
          <Col md={12}>
            <Card className="mt-4">
              <Card.Body>
                <Card.Title>Feedback</Card.Title>
                <Button variant="outline-primary">Give Feedback</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserDashboard;
