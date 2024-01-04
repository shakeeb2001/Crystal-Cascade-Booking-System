import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Doubleroom.css';
import DoubleImg from '../images/img2.png';

export default function DoubleRoom({ isLoggedIn }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phoneNumber: '',
    checkIn: '',
    checkOut: '',
    roomType: 'Double Room',
  
  });

  const [showModal, setShowModal] = useState(false);
  const [reservationStatus, setReservationStatus] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    if (id === 'cardNumber') {
      const firstDigit = value.charAt(0);
      if (firstDigit === '4') {
        setFormData((prevData) => ({ ...prevData, cardType: 'Visa' }));
      } else if (firstDigit === '5') {
        setFormData((prevData) => ({ ...prevData, cardType: 'MasterCard' }));
      } else {
        setFormData((prevData) => ({ ...prevData, cardType: '' }));
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'idNumber', 'phoneNumber', 'checkIn', 'checkOut', 'paymentMethod'];

    const isFormValid = requiredFields.every((field) => formData[field].trim() !== '');

    if (!isFormValid) {
      alert('Please fill in all required fields');
      return;
    }

    if (isLoggedIn) {
      setShowModal(true);
    } else {
      navigate('/login');
    }
  };

  const handleModalYes = async () => {
    console.log('Form Data:', formData);

    try {
      const response = await axios.post('http://localhost:3001/api/reservations', formData);
      if (response.data.success) {
        setReservationStatus('success');

        setTimeout(() => {
          setFormData({
            name: '',
            idNumber: '',
            phoneNumber: '',
            checkIn: '',
            checkOut: '',
            roomType: 'Delux Room',
          });

          setShowModal(false);
          setReservationStatus(null);
        }, 3000);
      } else {
        setReservationStatus('failure');
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
    }
  };

  const handleCloseModal = () => {
    setFormData({
      name: '',
      idNumber: '',
      phoneNumber: '',
      checkIn: '',
      checkOut: '',
      roomType: 'Delux Room'
    });

    setShowModal(false);
    setReservationStatus(null);
  };

  return (
    <div className="room-container">
      <img src={DoubleImg} alt="Background" className="background-image-room" id="doubleroom" />
      <div className="room-info-container">
        <h2>Double Room</h2>
        <p>
          Double Room is can reserved for four guests. There is a bedroom with a
          double-size two beds and a private bathroom.
        </p>
        <div className="room-details">
          <p className="guest-info">
            No of Guests: <span>4</span>| Room Size: <span>40 m²</span>|Bed
            Size: <span>Two Double</span> |Private Bath: <span>1</span>
          </p>
          <ul>
            <li>Wifi</li>
            <li>Mini Bar</li>
            <li>Breakfast</li>
            <li>Room Service</li>
            <li>Air-Conditioner</li>
            <li>Smoke-Free</li>
            <li>Pet Friendly</li>
          </ul>
        </div>
        <img src={DoubleImg} alt="Additional" className="additional-image" id="deluxroom" />
      </div>
      <div className="reservation-form-container">
        {isLoggedIn ? (
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="idNumber">
              <Form.Label>National ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter The NIC Number"
                value={formData.idNumber}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber">
              <Form.Label>Telephone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="checkIn">
              <Form.Label>Check In</Form.Label>
              <Form.Control type="date" value={formData.checkIn} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="checkOut">
              <Form.Label>Check Out</Form.Label>
              <Form.Control type="date" value={formData.checkOut} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="roomType" style={{ display: 'none' }}>
              <Form.Control type="text" value={formData.roomType} readOnly />
            </Form.Group>

            <Form.Group controlId="paymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                as="select"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="">Select Payment Method</option>
                <option value="creditCard">Credit Card</option>
                <option value="debitCard">Debit Card</option>
              </Form.Control>
            </Form.Group>

            {formData.paymentMethod === 'creditCard' || formData.paymentMethod === 'debitCard' ? (
              <>
                <Form.Group controlId="cardNumber">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter card number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="cardHolderName">
                  <Form.Label>Card Holder Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter card holder name"
                    value={formData.cardHolderName}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="cvc">
                  <Form.Label>CVC</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter CVC"
                    value={formData.cvc}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                {formData.cardType && (
                  <p>Card Type: {formData.cardType}</p>
                )}
              </>
            ) : null}

            <Button variant="dark" type="submit">
              Reserve
            </Button>
          </Form>
        ) : (
          <p className="login-message">
            Please <span onClick={() => navigate('/login')} className="login-link">login</span> to reserve a room.
          </p>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservationStatus === null ? (
            <p>Do you want to reserve?</p>
          ) : (
            <div className={`reservation-status text-center ${reservationStatus}`}>
              <p className="model-class">Reserved successfully!</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {reservationStatus === null ? (
            <>
              <Button variant="secondary" onClick={handleCloseModal}>
                No
              </Button>
              <Button variant="primary" onClick={handleModalYes}>
                Yes
              </Button>
            </>
          ) : null}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
