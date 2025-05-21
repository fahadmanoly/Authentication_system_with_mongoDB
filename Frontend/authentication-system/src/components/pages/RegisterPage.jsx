import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 

function RegisterPage() {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  
  const API_BASE_URL = 'http://127.00.1:8000/api'; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setIsError(false); 

    if (formData.password !== formData.confirm_password) {
      setMessage('Passwords do not match!');
      setIsError(true);
      return;
    }

    
    const dataToSend = { ...formData };
    // delete dataToSend.confirm_password;

    try {
      const response = await axios.post(`${API_BASE_URL}/register/`, dataToSend);

      if (response.status === 201) { 
        setMessage('Registration successful! You can now log in.');
        setIsError(false);
        
        setFormData({
          username: '',
          password: '',
          confirm_password: '',
          first_name: '',
          last_name: '',
          email: '',
        });
        setTimeout(() => navigate('/login'), 2000); 
      }
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      const errorData = error.response && error.response.data;
      let errorMessage = 'Registration failed. Please check your input.';

      if (errorData) {
        
        if (errorData.username) {
          errorMessage = `Username: ${errorData.username.join(', ')}`;
        } else if (errorData.email) {
          errorMessage = `Email: ${errorData.email.join(', ')}`;
        } else if (errorData.password) {
          errorMessage = `Password: ${errorData.password.join(', ')}`;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          errorMessage = JSON.stringify(errorData); 
        }
      } else {
        errorMessage = 'Network error or server unreachable.';
      }

      setMessage(`Registration failed: ${errorMessage}`);
      setIsError(true);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
      <Card className="shadow-lg p-5" style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {message && (
            <Alert variant={isError ? 'danger' : 'success'} className="mb-4">
              {message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Register
            </Button>
          </Form>
          <p className="mt-3 text-center text-muted">
            Already have an account?{' '}
            <Link to="/login" className="btn btn-link p-0">
              Login
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterPage;
