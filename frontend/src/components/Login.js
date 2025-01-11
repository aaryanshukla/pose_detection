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
import "./styles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error with Login:", data.error);
      } else {
        console.log("Successfully logged in!");
      }
    } catch (error) {
      setError("Network Error, Please Try Again");
    }
  }

  return (
    <>
      <Container className="custom-container text-center my-4">
        <h1>Pose-Detector</h1>

        <Image src={logo} fluid />
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
        <Card className="custom-card p-4 shadow" style={{ width: "25rem" }}>
          <Card.Body>
            <Card.Title className="text-center mb-4">Please Login!</Card.Title>
            <Form onSubmit={handleLogin}>
              <Form.Group className="form-control mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Enter Email
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                  ></Form.Control>
                </Form.Label>
              </Form.Group>
              <Form.Group className="form-control mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Enter Password
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                  ></Form.Control>
                </Form.Label>
              </Form.Group>
              `{" "}
              <div className="custom-button text-center">
                <Button variant="primary" size="lg" type="submit">
                  Login
                </Button>
              </div>
              `
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
export default Login;
