import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import io from 'socket.io-client'; // Import Socket.IO client library
import './Dining.css'; // Import the CSS file

const Dining = ({ isAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ title: '', description: '', image: null });

  // WebSocket connection for dining card notifications
  const socket = io('http://localhost:3001', { transports: ['websocket'] });

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dinings');
        if (response.ok) {
          const existingCards = await response.json();
          setCards(existingCards);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch existing cards:', response.status, response.statusText, errorData);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleDiningNotification = (dining) => {
      console.log('New Dining Notification:', dining);
      // Handle the new dining card notification
      // You can update your UI or take any other actions here
      setCards((prevCards) => [...prevCards, dining]);
    };

    socket.on('new-dining-notification', handleDiningNotification);

    fetchCards();

    return () => {
      socket.off('new-dining-notification', handleDiningNotification);
    };
  }, [socket]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCard((prevCard) => ({ ...prevCard, [name]: reader.result }));
      };
      if (files.length > 0) {
        reader.readAsDataURL(files[0]);
      }
    } else {
      setNewCard((prevCard) => ({ ...prevCard, [name]: value }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleAddCard = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newCard.title);
      formData.append('description', newCard.description);

      if (newCard.image) {
        formData.append('image', dataURItoBlob(newCard.image));
      }

      const response = await fetch('http://localhost:3001/api/dinings', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const addedDining = await response.json();
        setCards([...cards, addedDining]);
        setNewCard({ title: '', description: '', image: null });
        handleCloseModal();
      } else {
        console.error('Failed to add a new dining card:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/dinings/${cardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCards = cards.filter((card) => card._id !== cardId);
        setCards(updatedCards);
      } else {
        console.error('Failed to delete dining card:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {isAdmin && (
        <Button variant="primary" className="add-button" onClick={handleShowModal}>
          Add
        </Button>
      )}

      <div className="container">
        {cards.map((card, index) => (
          <Card key={index} className="card1">
            <Card.Img variant="top" src={`data:image/png;base64,${card.image}`} alt={card.title} />
            <Card.Body>
              <Card.Title>{card.title}</Card.Title>
              <Card.Text>{card.description}</Card.Text>
              {isAdmin && (
                <Button variant="secondary" onClick={() => handleDeleteCard(card._id)}>
                  Delete
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={newCard.title}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter description"
                  name="description"
                  value={newCard.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" name="image" onChange={handleInputChange} accept="image/*" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddCard}>
              Add Card
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Dining;
