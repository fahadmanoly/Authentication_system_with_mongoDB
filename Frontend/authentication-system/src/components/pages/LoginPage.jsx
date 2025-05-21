import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { useAuth } from '../../context/AuthContext'; 
// import { getToken, storeToken } from '../../api/LocalStorageService';

function LoginPage() {
  const { setAuthTokensAndUser } = useAuth(); 
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({ username: '', password: '' });
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

    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, formData);

      if (response.status === 200) {
    
        const { access, refresh } = response.data;
        console.log("the refresh tokennnnn",refresh)
        await setAuthTokensAndUser(access, refresh); 
        setMessage('Login successful!');
        setIsError(false);
        setTimeout(() => navigate('/profile'), 1000); 
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      const errorMessage = error.response && error.response.data
        ? (error.response.data.detail || JSON.stringify(error.response.data))
        : 'Network error or server unreachable.';
      setMessage(`Login failed: ${errorMessage}`);
      setIsError(true);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
      <Card className="shadow-lg p-5" style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
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

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>
          <p className="mt-3 text-center text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="btn btn-link p-0">
              Register
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;
