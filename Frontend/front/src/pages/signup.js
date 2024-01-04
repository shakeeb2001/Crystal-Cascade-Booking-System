import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import './signup.css';
import loginIcon from '../images/newlogo.png';
import Background from '../images/background.png';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { firstName, lastName, email, username, password };

    axios.post('http://localhost:3001/signup', userData)
      .then(result => {
        console.log(result);
        // You may want to redirect to the login page or handle the response in some way
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className='container'>
      <img src={Background} alt="Backgound3" className="background-images-signup"/>
      <Form className='overlay-form' onSubmit={handleSubmit}>
        <img src={loginIcon} alt="Login Icon" className="login-icon" />
        <h2>Sign Up</h2>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            className='input'
            type="text"
            placeholder="Ex:Jhon"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            className='input'
            type="text"
            placeholder="Ex:Anderson"
            onChange={(e) => setLastName(e.target.value)}
          />
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            className='input'
            type="email"
            placeholder="Jhon@mail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Label>Username</Form.Label>
          <Form.Control
            className='input'
            type="text"
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Label>Password</Form.Label>
          <Form.Control
            className='input'
            type="text"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <button className='btn mx-auto d-block'>Sign Up</button>
      </Form>
    </div>
  );
}
