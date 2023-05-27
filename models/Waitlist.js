const mongoose = require("mongoose");

const WaitListSchema = new mongoose.Schema({
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
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    morning: {
        type: Boolean,
        default: false,
    },
    afternoon: {
        type: Boolean,
        default: false,
    },
    night: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("WaitList", WaitListSchema);
