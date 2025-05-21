import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import { Navbar, Nav, Container, Alert } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './components/pages/Home';
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';
import UserHome from './components/pages/UserHome';
import ProfilePage from './components/pages/ProfilePage';
import ProfileUpdatePage from './components/pages/ProfileUpdatePage'; 
import LogoutPage from './components/pages/LogoutPage';


const PrivateRoute = ({ children }) => {
  const { accessToken, loading } = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!loading && !accessToken) {
      navigate('/logout');
    }
  }, [accessToken, loading, navigate]); 

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return null; 
  }

  return children;
};



const AppNavbar = () => {
  const { accessToken, logout, authError } = useAuth();


  const handleLogout = () => {
    logout(); 
  };

  return (
    <>
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-lg rounded-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/">AuthApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!accessToken ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/profile">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/profileview">Profile</Nav.Link> 
                <Nav.Link onClick={handleLogout} className="btn btn-danger btn-sm ms-2">Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
     {authError && ( 
        <Container className="mt-3">
          <Alert variant="danger" onClose={() => { /* Optionally clear error */ }} dismissible>
            Authentication Error: {authError}
          </Alert>
        </Container>
      )}
    </>
  );
};


function App() {
  return (
    <Router>
      <AuthProvider> 
        <div className="d-flex flex-column min-vh-100 bg-light">
          <AppNavbar /> 

          
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />

              
              <Route path="/profile" element={ <PrivateRoute> <UserHome /> </PrivateRoute>} /> 
              <Route path="/profileview" element={ <PrivateRoute> <ProfilePage /> </PrivateRoute>} /> 
              <Route path="/profile/edit" element={ <PrivateRoute> <ProfileUpdatePage /> </PrivateRoute>} /> 
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
