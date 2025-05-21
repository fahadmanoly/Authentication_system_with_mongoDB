import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosinstance';
import { useNavigate } from 'react-router-dom';

function ProfileUpdatePage() {
  const { currentUser, loading: authLoading, fetchUserProfile } = useAuth(); 
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && currentUser) {
      
      setFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
      });
      setPageLoading(false);
    } else if (!authLoading && !currentUser) {
      
      setPageLoading(false);
      navigate('/login'); 
    }
  }, [authLoading, currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setIsError(false); 

    try {
      const response = await axiosInstance.put('/profile/', formData); 
      if (response.status === 200) {
        setMessage('Profile updated successfully!');
        setIsError(false);
      
        await fetchUserProfile();
        setTimeout(() => navigate('/profile'), 1500); 
      }
    } catch (err) {
      console.error('Profile update error:', err.response ? err.response.data : err.message);
      const errorData = err.response?.data;
      let errorMessage = 'Profile update failed. Please check your input.';

      if (errorData) {
        
        if (errorData.first_name) {
          errorMessage = `First Name: ${errorData.first_name.join(', ')}`;
        } else if (errorData.last_name) {
          errorMessage = `Last Name: ${errorData.last_name.join(', ')}`;
        } else if (errorData.email) {
          errorMessage = `Email: ${errorData.email.join(', ')}`;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          errorMessage = JSON.stringify(errorData); 
        }
      } else {
        errorMessage = 'Network error or server unreachable.';
      }

      setMessage(`Profile update failed: ${errorMessage}`);
      setIsError(true);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading profile data...</span>
        </Spinner>
      </Container>
    );
  }

  if (!currentUser) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Alert variant="danger" className="text-center">
          Please log in to update your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
      <Card className="shadow-lg p-5" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {message && (
            <Alert variant={isError ? 'danger' : 'success'} className="mb-4">
              {message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => navigate('/profile')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfileUpdatePage;
