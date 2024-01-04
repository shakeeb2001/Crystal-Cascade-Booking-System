const mongoose = require('mongoose')

const diningSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
  });

  const DiningModel = mongoose.model('Dining', diningSchema);

module.exports = DiningModel