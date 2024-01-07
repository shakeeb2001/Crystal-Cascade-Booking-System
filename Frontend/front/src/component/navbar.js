
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import NavBootstrap from 'react-bootstrap/Nav';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import './navbar.css';
import loginIcon from '../images/newlogo.png';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import './navbar.css';
import io from 'socket.io-client'; 

function Navbar({ isLoggedIn, updateLoginStatus, isAdmin, username }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3001', { transports: ['websocket'] });


    socket.on('new-event-notification', (event) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { type: 'event', data: event },
      ]);
    });

    socket.on('new-dining-notification', (dining) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { type: 'dining', data: dining },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleScrollToEvents = () => {
    const eventsSection = document.getElementById('events-container');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToDining = () => {
    const diningSection = document.getElementById('dining-container');
    if (diningSection) {
      diningSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToAboutus = () => {
    const aboutUsSection = document.getElementById('footer-container');
    if (aboutUsSection) {
      aboutUsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = () => {
    updateLoginStatus(false);
    navigate('/signout');
  };

  const isSignOutPage = location.pathname === '/signout';
  const notificationCount = notifications.length;


  return (
    <>
      <NavbarBootstrap className='nav justify-content-center' expand="lg">
        <NavbarBootstrap.Brand>
          <NavLink to="/">
            <img src={loginIcon} alt="Logo" className="logo-icon" />
          </NavLink>
        </NavbarBootstrap.Brand>
        <NavbarBootstrap.Toggle aria-controls="basic-navbar-nav" />
        <NavbarBootstrap.Collapse id="basic-navbar-nav">
          <NavBootstrap className="mr-auto">
            <NavBootstrap.Item>
              <NavLink to="/" className="nav-link" activeClassName="active">
                Home
              </NavLink>
            </NavBootstrap.Item>
            <NavBootstrap.Item>
              <NavLink to="/roomtype" className="nav-link" activeClassName="active">
                Accommodations
              </NavLink>
            </NavBootstrap.Item>
            <NavBootstrap.Item onClick={handleScrollToEvents}>
              <NavLink to="/event" className="nav-link" activeClassName="active" >
                Events
              </NavLink>
            </NavBootstrap.Item>
            <NavBootstrap.Item onClick={handleScrollToDining}>
              <NavLink to="/Dining" className="nav-link"  activeClassName="active">
                Dining
              </NavLink>
            </NavBootstrap.Item>
            {isAdmin && (
              <NavBootstrap.Item>
                <NavLink to="/bookinghistory" className="nav-link" activeClassName="active">
                  Booking History
                </NavLink>
              </NavBootstrap.Item>
            )}
            <NavBootstrap.Item>
              <NavLink  className="nav-link" onClick={handleScrollToAboutus} >
                About Us
              </NavLink>
            </NavBootstrap.Item>
          </NavBootstrap>
          <NavBootstrap>
          {isLoggedIn && (
            <NavDropdown
              className="notification-dropdown"
              title={
                <>
                  <NotificationsNoneIcon className="notification-icon" />
                  {notificationCount > 0 && (
                    <span className="notification-count">{notificationCount}</span>
                  )}
                </>
              }
              id="basic-nav-dropdown"
              show={showNotifications}
              onClick={() => {
                setShowNotifications(!showNotifications);
                // Reset count when opening the dropdown
                setNotifications((prevNotifications) => {
                  return prevNotifications.map((notification) => ({
                    ...notification,
                    count: 0,
                  }));
                });
              }}
            >
              {notificationCount > 0 ? (
                notifications.map((notification, index) => (
                  <NavDropdown.Item key={index}>
                    {notification.type === 'event' ? (
                      `${notification.data.title} - New Event`
                    ) : (
                      `${notification.data.title} - New Dining`
                    )}
                    <Badge variant="danger">1</Badge>
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item>No new notifications</NavDropdown.Item>
              )}
            </NavDropdown>
          )}

            {isLoggedIn ? (
              <NavDropdown className="profile-dropdown" title={username ? `Hi ${username}` : ''} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleSignOut}>Sign Out</NavDropdown.Item>
                <NavDropdown.Item href="/Profile">Profile</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavBootstrap.Item>
                {isSignOutPage ? null : (
                  <NavLink to="/login" className="nav-link-signin" activeClassName="active">
                    Sign In
                  </NavLink>
                )}
              </NavBootstrap.Item>
            )}
          </NavBootstrap>
        </NavbarBootstrap.Collapse>
      </NavbarBootstrap>
    </>
  );
}

export default Navbar;
