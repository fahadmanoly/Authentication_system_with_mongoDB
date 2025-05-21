import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosinstance';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { currentUser, loading: authLoading } = useAuth(); 
  const [profileData, setProfileData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log("profilepage rendered")

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authLoading && currentUser) { 
        try {
          const response = await axiosInstance.get('/profile/');
          if (response.status === 200) {
            setProfileData(response.data);
          } else {
            setError('Failed to fetch profile data.');
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
          setError(err.response?.data?.error || 'An error occurred while fetching profile.');
        } finally {
          setPageLoading(false);
        }
      } else if (!authLoading && !currentUser) {
        
        setPageLoading(false);
        navigate('/login'); 
      }
    };

    fetchProfile();
  }, [authLoading, currentUser, navigate]); 

  if (authLoading || pageLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Alert variant="info" className="text-center">
          No profile data available.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
      <Card className="shadow-lg p-5" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Your Profile</h2>
          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item"><strong>Username:</strong> {profileData.username}</li>
            <li className="list-group-item"><strong>First Name:</strong> {profileData.first_name}</li>
            <li className="list-group-item"><strong>Last Name:</strong> {profileData.last_name}</li>
            <li className="list-group-item"><strong>Email:</strong> {profileData.email}</li>
            <li className="list-group-item"><strong>User ID:</strong> {profileData._id}</li>
          </ul>
          <div className="d-grid gap-2">
            <Button variant="warning" onClick={() => navigate('/profile/edit')}>
              Edit Profile
            </Button>
            <Button variant="secondary" onClick={() => navigate('/profile')}>
              Back to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfilePage;
