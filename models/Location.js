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
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    slots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot'
    }]
});

module.exports = mongoose.model('Location', LocationSchema);
