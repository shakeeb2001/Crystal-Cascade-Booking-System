import React from 'react';
import './footer.css'
import InstagramIcon from '../images/instagram.png';
import FacebookIcon from '../images/facebook.png';
import WhatsappIcon from '../images/whatsapp.png';

export default function App() {
  return (
<footer class="footer">
  <div class="footer-left col-md-4 col-sm-6">
    <p class="about">
      <span> About the Crystal Cascade</span> 
      Perched on the pristine shores of Mount Lavinia Beach, Hotel Crystel Cascade stands as a beacon of hospitality along the coastline of Colombo.
    </p>
    <br></br>
    <div class="social-icons">
    <a href="https://api.whatsapp.com/send?phone=1234567890" target="_blank" rel="noopener noreferrer">
          <img src={WhatsappIcon} alt="WhatsApp" />
        </a>
        <a href="https://www.facebook.com/profile.php?id=61554841954980&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
          <img src={FacebookIcon} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/crystalcascadehotel?igsh=ZTkzdTkydDN4bzE5">
          <img src={InstagramIcon} alt="Instagram" />
        </a>
    </div>
  </div>
  <div class="footer-center col-md-4 col-sm-6">
    <div>
      <i class="fa fa-map-marker"></i>
      <p><span> No.17</span> Mount Lavinia, SriLanka</p>
    </div>
    <div>
      <i class="fa fa-phone"></i>
      <p> (+94) 1127 434 808</p>
    </div>
    <div>
      <i class="fa fa-envelope"></i>
      <p>info@crystelcascadehotel.com</p>
    </div>
  </div>
  <div class="footer-right col-md-4 col-sm-6">
  <h2>Crystal<span>Cascade Hotel</span></h2>
    <p class="menu">
      <a href="/home"> Home</a> |
      <a href="/event">Events</a> |
      <a href="/dining"> Dinings</a> |
      <a href="/login"> Sign In</a> |
    </p>
    <p class="name">© 2023 Crystal Cascade Hotel</p>
  </div>
</footer>
  );
}