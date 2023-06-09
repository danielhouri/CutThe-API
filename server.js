const router = require("./router");
const mongoose = require("mongoose");
const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const WaitList = require('./models/WaitList');
const schedule = require('node-schedule');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
app.use(bodyParser.json())

dotenv.config({ path: "./tools.env" });

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

// Start the server and listen on a specific port
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

// Schedule the function to run every day at a specific time (e.g., 12:00 AM)
const job = schedule.scheduleJob('0 0 * * *', async () => {
    try {
        const currentDate = new Date();

        // Find and delete the wait lists whose date has passed
        await WaitList.deleteMany({ date: { $lt: currentDate } });

        console.log('Deleted expired wait lists.');
    } catch (error) {
        console.error('Error deleting wait lists:', error);
    }
});
