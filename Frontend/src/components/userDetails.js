import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminHome from "./adminHome";
import UserHome from "./userHome";
import { Button, Container } from "react-bootstrap"; // Bootstrap components
import { fetchUserData } from "../store/userSlice";


export default function UserDetails() {
  const dispatch = useDispatch();
  const { userData, isAdmin, status, error } = useSelector((state) => state.user);

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
            <Button variant="primary" onClick={() => alert("Add new user clicked!")}>
              Add New User
            </Button>
          </div>
          <AdminHome />
        </>
      ) : (
        <UserHome userData={userData} />
      )}
    </Container>
  );
}