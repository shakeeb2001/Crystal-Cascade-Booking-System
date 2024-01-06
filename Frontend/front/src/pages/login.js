// Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import axios from 'axios';
import { Form, Alert, Modal, Spinner } from 'react-bootstrap';  // Import Modal and Spinner
import loginIcon from '../images/newlogo.png';
import Background from '../images/background.png';

export default function Login({ updateLoginStatus }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);  // State for the loading modal
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);  // Show loading modal while making API request

    axios.post('http://localhost:3001/login', { username, password })
      .then(result => {
        setShowSuccessModal(false);  // Hide loading modal after API response

        if (result.data === 'success') {
          const isAdmin = username === 'admin' && password === '1234';
          console.log('Login successful. isAdmin:', isAdmin);
          updateLoginStatus(true, isAdmin, username);
          setShowSuccessAlert(true);
          navigate('/');
        } else {
          setLoginError('Login failed. Please check your credentials.');
          console.log('Login failed');
        }
      })
      .catch(error => {
        setShowSuccessModal(false);  // Hide loading modal in case of an error
        console.error('API request failed:', error);
      });
  };


  return (
    <div className='container' id='login-container'>
      <img src={Background} alt="Background2" className="background-images-logi" />
      <Form className='overlay-form' onSubmit={handleSubmit}>
        <img src={loginIcon} alt="Login Icon" className="login-icon" />
        <h2>Sign In</h2>

        {showSuccessAlert && (
          <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
            Login successful!
          </Alert>
        )}

        {loginError && (
          <Alert variant="danger" onClose={() => setLoginError(null)} dismissible>
            {loginError}
          </Alert>
        )}

        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            className='input'
            type="text"
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            className='input'
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <button className='btn mx-auto d-block'>Login</button>
        <p className="signup-link">
          Don't have an account? <Link className="signup-link-route" to="/signup">Sign Up</Link>
        </p>
        <Modal show={showSuccessModal} backdrop="static" keyboard={false} centered>
          <Modal.Body>
            <Alert variant="success">
              <Spinner animation="border" size="sm" /> Logging in...
            </Alert>
          </Modal.Body>
        </Modal>
      </Form>
    </div>
  );
}
