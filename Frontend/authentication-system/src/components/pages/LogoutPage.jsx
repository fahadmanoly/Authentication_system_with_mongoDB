import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

function LogoutPage() {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
      <Card className="shadow-lg text-center p-5" style={{ maxWidth: '800px', width: '100%' }}>
        <Card.Body>
          <h2 className="display-4 text-dark mb-4">You have been logged out.</h2>
          <p className="lead text-muted mb-5">
            Thank you for using AuthApp.
          </p>
          <p className="text-md text-secondary">
            If you wish to log in again, please click the button below:
          </p>
          <Link to="/login" className="d-grid gap-2">
            <Button variant="primary" size="lg" className="mt-4">
              Log In Again
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LogoutPage;
