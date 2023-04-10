const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barber', required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Slot', SlotSchema);
