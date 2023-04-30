const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barber',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    service: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }],
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    status: {
        type: Boolean,
        default: false,
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }]
});


module.exports = mongoose.model('Appointment', AppointmentSchema);
