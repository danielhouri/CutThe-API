const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barber',
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('Slot', SlotSchema);