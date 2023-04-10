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
    date: {
        type: Date,
        required: true
    },
    service: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service', required: true
    }],
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'cancelled', 'completed'],
        default: 'scheduled'
    }
});

AppointmentSchema.pre('save', function (next) {
    if (this.status === 'scheduled' && this.date < new Date()) {
        this.status = 'completed';
    }
    next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
