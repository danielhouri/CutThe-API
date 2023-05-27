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
    given_name: {
        type: String,
        required: true
    },
    family_name: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    phone_number: {
        type: String,
        default: '',
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
    },
    messaging_token: [{
        type: String,
        default: [],
        required: true
    }]
});

module.exports = mongoose.model("Barber", BarberSchema);
