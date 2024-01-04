const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
  });

  const EventModel = mongoose.model('Event', eventSchema);

module.exports = EventModel