// profile.js

import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './profile.css';

const Profile = ({ user, onUpdateProfile ,onDeleteProfile}) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });

  const [isFormEdited, setIsFormEdited] = useState(false);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:3001/api/signup/${user}`)
        .then(response => {
          const userDataFromServer = response.data;
          setUserData(userDataFromServer);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    setIsFormEdited(true); // Set form as edited when input changes
  };

  const handleSaveProfile = () => {
    axios.put(`http://localhost:3001/api/signup/${user}`, userData)
      .then(response => {
        console.log('Profile updated successfully:', response.data);
        onUpdateProfile(response.data);  // Update with the data received from the server
        setIsFormEdited(false); // Reset form edited status after saving
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  const handleDeleteProfile = () => {
    axios.delete(`http://localhost:3001/api/signup/${user}`)
      .then(response => {
        console.log('Profile deleted successfully:', response.data);
        onDeleteProfile(); // Notify parent component about deletion
      })
      .catch(error => {
        console.error('Error deleting profile:', error);
      });
  };

  return (
    <div className="profile-wrapper" id="profile">
      <Row>
        <Col>
          <h2 className='profile-title'>Customer Profile</h2>
        </Col>
      </Row>
      <Row>
        <Col className="mx-auto">
          <Form>
            <Form.Group as={Row} controlId="formName" className="mb-3">
              <Form.Label column sm={2}>
                First Name
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  placeholder="Enter First Name"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formlastname" className="mb-3">
              <Form.Label column sm={2}>
                Last Name
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  placeholder="Enter Last Name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formemail" className="mb-3">
              <Form.Label column sm={2}>
                Email
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  placeholder="Enter Email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formusername" className="mb-3">
              <Form.Label column sm={2}>
                Username
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPassword" className="mb-3">
              <Form.Label column sm={2}>
                Password
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  placeholder="Enter Password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col className="text-right">
          <div className="d-flex align-items-center">
            {isFormEdited && (
              <Button variant="primary" className="mr-3" onClick={handleSaveProfile}>
                Save
              </Button>
            )}
             <Button className="mr-4" onClick={handleDeleteProfile}>
              Delete Profile
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
