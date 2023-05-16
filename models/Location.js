const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    slots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot'
    }],
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barber'
    }
});

module.exports = mongoose.model('Location', LocationSchema);
