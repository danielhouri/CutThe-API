const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    given_name: {
        type: String,
        required: true
    },
    family_name: {
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
    preferred_barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barber'
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
});

module.exports = mongoose.model("Client", ClientSchema);
