    import React from 'react';
    import { Container, Card } from 'react-bootstrap';

    function Home() {
      return (
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
          <Card className="shadow-lg text-center p-4" style={{ maxWidth: '700px', width: '100%' }}>
            <Card.Body>
              <h2 className="display-4 text-dark mb-3">Welcome to Authentication System!</h2>
              <p className="lead text-muted mb-3">
                Your secure authentication system.
              </p>
              <p className="text-sm text-secondary">
            
              </p>
            </Card.Body>
          </Card>
        </Container>
      );
    }

    export default Home;
    