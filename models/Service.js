const mongoose = require("mongoose");


const ServiceSchema = new mongoose.Schema({
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  duration: { type: Number },
  price: { type: Number },
});

module.exports = mongoose.model('Service', ServiceSchema);
