const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
      name: String,
      idNumber: String,
      phoneNumber: String,
      checkIn: String,
      checkOut: String,
      roomType: String,
  });

  const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel