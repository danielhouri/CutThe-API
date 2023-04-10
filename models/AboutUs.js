const mongoose = require("mongoose");

// Define the AboutUs schema
const aboutUsSchema = new mongoose.Schema({
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barber',
        required: true,
    },
    text: { type: String },
    pictures: [{ type: String }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('AboutUs', aboutUsSchema);
