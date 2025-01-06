import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.png";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("Error with Signup: ", data.error);
      } else {
        console.log("Successfully Signed Up");
        navigate("/login");
      }
    } catch (error) {
      setError("There has been an issue, Please Try Again");
    }
  }

  return (
    <>
    <Container
  className="text-center my-4"
  style={{
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }}
>
  <h1
    style={{
      fontFamily: "'Roboto', sans-serif",
      color: "#333",
      fontSize: "2.5rem",
      marginBottom: "10px",
    }}
  >
    Pose-Detector
  </h1>

  <Image
    src={logo}
    alt="Pose-Detector Logo"
    fluid
    style={{
      maxHeight: "150px",
      maxWidth: "100%",
    }}
  />
</Container>

    
    
    <div
      style={{
        minHeight: "50 vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >


      <Card className="p-4 shadow" style={{ width: "25rem" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Signup</Card.Title>
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="text-center">
              <Button variant="primary" size="lg" type="submit">
                Signup
              </Button>
            </div>

            {error && <p className="text-danger text-center mt-3">{error}</p>}
          </Form>
        </Card.Body>
      </Card>
    </div>
  </>
  );
}

export default Signup;
