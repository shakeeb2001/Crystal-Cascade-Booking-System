import React, { useState } from 'react';
import { Form, Modal, FormGroup } from 'react-bootstrap';
import axios from 'axios';
import './signup.css';
import loginIcon from '../images/newlogo.png';
import Background from '../images/background.png';

export default function Signup() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [existingUser, setExistingUser] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !username || !password) {
      console.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const userData = { firstName, lastName, email, username, password };

    axios.post('http://localhost:3001/signup', userData)
      .then(result => {
        console.log(result);
        setLoading(false);
        setShowModal(true);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        if (err.response && err.response.status === 409) {
          setExistingUser(true);
          setShowModal(true);
        }
      });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setExistingUser(false);
    setLoading(false);
  };

  return (
    <div className='container'>
      <img src={Background} alt="Background3" className="background-images-signup" />
      <Form className='overlay-form' onSubmit={handleSubmit}>
        <img src={loginIcon} alt="Login Icon" className="login-icon" />
        <h2>Sign Up</h2>
        <FormGroup className="mb-3" controlId="formGroupEmail">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            className='input'
            type="text"
            placeholder="Ex:Jhon"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            className='input'
            type="text"
            placeholder="Ex:Anderson"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            className='input'
            type="email"
            placeholder="Jhon@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Label>Username</Form.Label>
          <Form.Control
            className='input'
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {existingUser && (
            <Form.Text className="text-danger">
              This username is already in use. Please choose a different one.
            </Form.Text>
          )}
          <Form.Label>Password</Form.Label>
          <Form.Control
            className='input'
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <button className='btn mx-auto d-block'>Sign Up</button>

        {/* Loading Modal */}
        <Modal show={loading} onHide={() => {}} centered>
          <Modal.Body>Loading...</Modal.Body>
        </Modal>

        {/* Modal for both Success and Existing User */}
        <Modal show={showModal} onHide={handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {existingUser ? 'Existing User' : 'Signup Successful'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {existingUser
              ? 'This username is already in use.'
              : 'Your account has been created successfully!'}
          </Modal.Body>
        </Modal>
      </Form>
    </div>
  );
}
