import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom'; // Step 1
import RoomBackgroundVideo from '../images/roomtype.mp4';
import './RoomType.css';
import img1 from '../images/img1.png';
import img2 from '../images/img2.png';
import img3 from '../images/img3.png';

export default function RoomTypes() {
  const roomTypes = [
    {
      title: 'Single Room',
      description: 'No of Guest: One | $100 Per Night',
      image: img1,
      route: '/singleroom', // Step 2
    },
    {
      title: 'Double Room',
      description: 'No of Guests: 2-3 | $200 Per Night.',
      image: img2,
      route: '/doubleroom', // Step 2
    },
    {
      title: 'Deluxe Single Room',
      description: 'No of Guests: 1 | $150 Per Night.',
      image: img3,
      route: '/deluxroom', // Step 2
    },
  ];

  return (
    <div className="rooms">
      <video autoPlay loop muted className="Video-background">
        <source src={RoomBackgroundVideo} type="video/mp4" />
      </video>

      <div className="Center-cards">
        <div className="Card-container">
          <Row xs={20} md={10} className="g-4">
            {roomTypes.map((room, idx) => (
              <Col key={idx}>
                {/* Step 2 */}
                <Link to={room.route} className="card-link" id='room-card-link'>
                  <Card className="card roomcard">
                    <Card.Img variant="top" src={room.image} />
                    <Card.Body>
                      <Card.Title>{room.title}</Card.Title>
                      <Card.Text>{room.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}
