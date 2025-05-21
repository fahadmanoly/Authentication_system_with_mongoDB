import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

function UserHome() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  console.log("dashboard rendered");

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
      <Card className="shadow-lg text-center p-5" style={{ maxWidth: '700px', width: '100%' }}>
        <Card.Body>
          <h2 className="display-4 text-dark mb-4">Welcome to your Dashboard, {currentUser?.username || 'User'}!</h2>
          <p className="lead text-muted mb-5">
            You are successfully logged in.
          </p>
          <div className="d-grid gap-3"> 
            <Button variant="success" size="lg" onClick={() => navigate('/profileview')}>
              View Profile
            </Button>
            <Button variant="warning" size="lg" onClick={() => navigate('/profile/edit')}>
              Update Profile
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserHome;
