import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './component/navbar';
import Home from "./pages/home";
import Signout from "./pages/signout";
import RoomType from "./pages/RoomType";
import Signup from "./pages/signup";
import Login from "./pages/login";
import DeluxRoom from "./pages/DeluxeRoom";
import SingleRoom from "./pages/Singleroom";
import DoubleRoom from "./pages/Doubleroom";
import Event from "./pages/event";
import BookingHistory from "./pages/BookingHistory";
import Dining from "./pages/Dining";
import Profile from "./pages/profile";
import Footer from "./component/footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const storedAdminStatus = localStorage.getItem('isAdmin');
    return storedAdminStatus ? JSON.parse(storedAdminStatus) : false;
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const handleLoginStatusUpdate = (status, admin, username) => {
    setIsLoggedIn(status);
    setIsAdmin(admin);
    setUsername(username);

    // Save the login status in local storage
    localStorage.setItem('isLoggedIn', JSON.stringify(status));
    localStorage.setItem('isAdmin', JSON.stringify(admin));
    localStorage.setItem('username', username);
  };

  // useEffect to clear local storage on sign out
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('username');
    }
  }, [isLoggedIn]);


  return (
    <div>
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} updateLoginStatus={handleLoginStatusUpdate} isAdmin={isAdmin} username={username} />
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/roomtype" element={<RoomType />} />
          <Route path="/bookinghistory" element={<BookingHistory />} />
          <Route path="/deluxroom" element={<DeluxRoom isLoggedIn={isLoggedIn} />} />
          <Route path="/singleroom" element={<SingleRoom isLoggedIn={isLoggedIn} />} />
          <Route path="/doubleroom" element={<DoubleRoom isLoggedIn={isLoggedIn} />} />
          <Route path="/event" element={<Event isAdmin={isAdmin} />} />
          <Route path="/dining" element={<Dining isAdmin={isAdmin} />} />
          <Route path="/profile" element={<Profile user={username} />} />
          <Route path="/login" element={<Login updateLoginStatus={handleLoginStatusUpdate} />} />
          <Route path="/signout" element={<Signout updateLoginStatus={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
