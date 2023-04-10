const mongoose = require("mongoose");

const BarberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: { type: String },
    aboutUs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AboutUs'
    },
    locations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    }],
    preferred_location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    }
});

module.exports = mongoose.model("Barber", BarberSchema);
