import React, { useState, useEffect } from 'react';
import { Modal, Button,  } from 'react-bootstrap';
import './BookingHistory.css';

export default function BookingHistory() {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [highlightedId, setHighlightedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editedReservation, setEditedReservation] = useState({
    name: '',
    idNumber: '',
    phoneNumber: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
  });

  const [showNotFoundModal, setShowNotFoundModal] = useState(false);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/reservations');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data);
          setBookingHistory(data);
        } else {
          console.error('Failed to fetch booking history');
        }
      } catch (error) {
        console.error('Error fetching booking history:', error);
      }
    };

    fetchBookingHistory();
  }, []);

  const handleDelete = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reservations/${reservationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookingHistory((prevHistory) => prevHistory.filter((reservation) => reservation._id !== reservationId));
        console.log(`Reservation with ID ${reservationId} deleted successfully`);
      } else {
        console.error(`Failed to delete reservation with ID ${reservationId}`);
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }

    setHighlightedId(null); // Clear highlighted row after deletion
  };

  const handleEdit = (reservationId) => {
    setEditId(reservationId);
    const reservationToEdit = bookingHistory.find((reservation) => reservation._id === reservationId);
    setEditedReservation({
      name: reservationToEdit.name,
      idNumber: reservationToEdit.idNumber,
      phoneNumber: reservationToEdit.phoneNumber,
      roomType: reservationToEdit.roomType,
      checkIn: reservationToEdit.checkIn,
      checkOut: reservationToEdit.checkOut,
    });

    setHighlightedId(null); // Clear highlighted row after starting edit
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/reservations/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedReservation),
      });

      if (response.ok) {
        console.log(`Reservation with ID ${editId} updated successfully`);
        setEditId(null);
        setHighlightedId(editId); // Highlight the edited row after saving
      } else {
        console.error(`Failed to update reservation with ID ${editId}`);
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);

    setHighlightedId(null);
  };

  const handleFindById = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/reservations/${searchId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          console.log(`Reservations found for ID number ${searchId}:`, data);
          setBookingHistory(data); // Update the displayed records to show only the searched record
          setHighlightedId(data[0]._id); // Highlight the found row
        } else {
          console.error(`No reservations found for ID number ${searchId}`);
          setHighlightedId(null);
          setShowNotFoundModal(true); // Display the not found modal
        }
      } else {
        console.error(`Failed to find reservations for ID number ${searchId}`);
        setHighlightedId(null);
        setShowNotFoundModal(true); // Display the not found modal
      }
    } catch (error) {
      console.error('Error finding reservations:', error);
      setHighlightedId(null);
      setShowNotFoundModal(true); // Display the not found modal
    }
  };

  const handleNotFoundModalClose = () => {
    setShowNotFoundModal(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchId(e.target.value);

    // Highlight the row if the searchId matches any reservation's idNumber
    const foundReservation = bookingHistory.find((reservation) => reservation.idNumber === e.target.value);
    if (foundReservation) {
      setHighlightedId(foundReservation._id);
    } else {
      setHighlightedId(null);
    }
  };

  return (
    <div className='container-xl'>
      <h1>Booking History</h1>
      <div className="form-control sm-2 d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="Search by ID Number"
          value={searchId}
          onChange={handleSearchInputChange}
        />
        <button
          className="btn btn-secondary-search"
          type="button"
          onClick={handleFindById}
        >
          Search
        </button>
      </div>
      <br />
      <table className="table table-hover">
        <thead>
          <tr>
            <th className='thead' scope="col">Name</th>
            <th className='thead' scope="col">National ID</th>
            <th className='thead' scope="col">Contact Number</th>
            <th className='thead' scope="col">Room Type</th>
            <th className='thead' scope="col">Check In</th>
            <th className='thead' scope="col">Check Out</th>
            <th className='thead' scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {bookingHistory.map((reservation) => (
            <tr key={reservation._id} className={highlightedId === reservation._id ? 'highlighted-row' : ''}>
              <td>
                {editId === reservation._id ? (
                  <input
                    type="text"
                    value={editedReservation.name}
                    style={{ width: '100px' }}
                    onChange={(e) => setEditedReservation({ ...editedReservation, name: e.target.value })}
                  />
                ) : (
                  reservation.name
                )}
              </td>
              <td>
                {editId === reservation._id ? (
                  <input
                    type="text"
                    value={editedReservation.idNumber}
                    style={{ width: '100px' }}
                    onChange={(e) => setEditedReservation({ ...editedReservation, idNumber: e.target.value })}
                  />
                ) : (
                  reservation.idNumber
                )}
              </td>
              <td>
                {editId === reservation._id ? (
                  <input
                    type="text"
                    value={editedReservation.phoneNumber}
                    style={{ width: '100px' }}
                    onChange={(e) => setEditedReservation({ ...editedReservation, phoneNumber: e.target.value })}
                  />
                ) : (
                  reservation.phoneNumber
                )}
              </td>
              <td>
                {editId === reservation._id ? (
                  <input
                    type="text"
                    value={editedReservation.roomType}
                    style={{ width: '100px' }}
                    onChange={(e) => setEditedReservation({ ...editedReservation, roomType: e.target.value })}
                  />
                ) : (
                  reservation.roomType
                )}
              </td>
              <td>
                {editId === reservation._id ? (
                  <input
                    type="text"
                    value={editedReservation.checkIn}
                    style={{ width: '100px' }}
                    onChange={(e) => setEditedReservation({ ...editedReservation, checkIn: e.target.value })}
                  />
                ) : (
                  reservation.checkIn
                )}
              </td>
              <td>
                {editId === reservation._id ? (
                  <input
                    type="text"
                    value={editedReservation.checkOut}
                    style={{ width: '100px' }}
                    onChange={(e) => setEditedReservation({ ...editedReservation, checkOut: e.target.value })}
                  />
                ) : (
                  reservation.checkOut
                )}
              </td>
              <td>
                {editId === reservation._id ? (
                  <>
                    <button className='btn btn-success' onClick={handleSave}>
                      Save
                    </button>
                    <button className='btn btn-danger' onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className='btn btn-secondary1' id='booking-delete' onClick={() => handleDelete(reservation._id)}>
                      Delete
                    </button>
                    <button className='btn btn-secondary2' id='booking-edit' onClick={() => handleEdit(reservation._id)}>
                      Edit
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bootstrap Modal for Not Found */}
      <Modal show={showNotFoundModal} onHide={handleNotFoundModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>National ID Not Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The National ID you entered was not found. Please check and try again.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleNotFoundModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
