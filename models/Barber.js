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
    profilePicture: {
        type: String
    },
    phone_number: {
        type: String,
        required: true,
    },
    locations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    }],
    preferred_location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    pay_barber_cash: {
        type: Boolean,
        default: true
    },
    pay_barber_credit_card: {
        type: Boolean,
        default: true
    },
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        default: []
    }],
    aboutUs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AboutUs',
        required: true,
    }
});

module.exports = mongoose.model("Barber", BarberSchema);
