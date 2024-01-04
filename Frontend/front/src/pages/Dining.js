import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './Dining.css'; // Import the CSS file

const Dining = ({ isAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ title: '', description: '', image: null });

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
        const addedEvent = await response.json();
        setCards([...cards, addedEvent]);
        setNewCard({ title: '', description: '', image: null });
        handleCloseModal();
      } else {
        console.error('Failed to add a new event card:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

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

    fetchCards();
  }, []);


  // Inside the Dining component
useEffect(() => {
  console.log('isAdmin:', isAdmin);
  const fetchCards = async () => {
    // ... (rest of the code)
  };

  fetchCards();
}, [isAdmin]);

useEffect(() => {
  console.log('isAdmin:', isAdmin);
  // ... rest of the code
}, [isAdmin]);

  const handleDeleteCard = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/dinings/${cardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCards = cards.filter((card) => card._id !== cardId);
        setCards(updatedCards);
      } else {
        console.error('Failed to delete event card:', response.status, response.statusText);
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
