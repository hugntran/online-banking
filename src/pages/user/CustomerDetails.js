import React, { useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function CustomerDetails() {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleSearch = async () => {
    setError("");
    setUserData(null);
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!role || !token) {
      setError("Role or Token missing in localStorage");
      return;
    }

    try {
      const response = await axios.get(
        `https://demoapihistory-hsgagzgtcse4daby.japaneast-01.azurewebsites.net/api/User/get-detail-User/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please check the UserID or API connection.");
    }
  };

  const handleViewAccount = () => {
    if (userId) {
      navigate(`/accounts/${userId}`); // Navigate to ViewAccount page with userId
    }
  };

  return (
    <div className="main-content">
      <Container className="mt-5" style={{ paddingLeft: "50px" }}>
        <Row>
          <Col>
            <h3>Customer Detail</h3>
            <TextField
              label="User ID"
              variant="outlined"
              fullWidth
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button className="mt-3" onClick={handleSearch} variant="primary">
              Search
            </Button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </Col>
        </Row>
        <Row className="mt-5">
          {userData && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Citizen ID</th>
                  <th>Citizen ID Front</th>
                  <th>Citizen ID Rear</th>
                  <th>Digital Signature</th>
                  <th>Created At</th>
                  <th>Account</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{userData.customerId}</td>
                  <td>{userData.name}</td>
                  <td>{userData.phone}</td>
                  <td>{userData.email}</td>
                  <td>{userData.address}</td>
                  <td>{userData.citizenId}</td>
                  <td>
                    <img
                      src={userData.citizenIdFront}
                      alt="Citizen ID Front"
                      style={{ width: "100px", height: "70px", objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <img
                      src={userData.citizenIdRear}
                      alt="Citizen ID Rear"
                      style={{ width: "100px", height: "70px", objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <img
                      src={userData.digitalSignature}
                      alt="Digital Signature"
                      style={{ width: "100px", height: "70px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{new Date(userData.createdAt).toLocaleString()}</td>
                  <td>
  <span
    onClick={handleViewAccount}
    style={{
      color: "#007bff",
      cursor: "pointer",
      textDecoration: "underline",
    }}
  >
    View Account
  </span>
</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default CustomerDetails;
