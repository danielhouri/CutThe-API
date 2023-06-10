const WaitList = require('../models/WaitList');
const Client = require('../models/Client');

const { tokenValidation } = require('../tools');

// Create a new waitlist entry
const createWaitlistEntry = async (req, res) => {
    try {
        const waitlistEntry = new WaitList(req.body);
        await waitlistEntry.save();
        res.status(201).send(waitlistEntry);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all waitlist entries
const getAllWaitlistEntries = async (req, res) => {
    try {
        const waitlistEntries = await WaitList.find();
        res.send(waitlistEntries);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a single waitlist entry by ID
const getWaitlistEntryById = async (req, res) => {
    try {
        const waitlistEntry = await WaitList.findById(req.params.id);
        if (!waitlistEntry) {
            res.status(404).send('Waitlist entry not found');
        } else {
            res.send(waitlistEntry);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a waitlist entry by ID
const updateWaitlistEntry = async (req, res) => {
    try {
        const waitlistEntry = await WaitList.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!waitlistEntry) {
            res.status(404).send('Waitlist entry not found');
        } else {
            res.send(waitlistEntry);
        }
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a waitlist entry by ID
const deleteWaitlistEntry = async (req, res) => {
    try {
        const waitlistEntry = await WaitList.findByIdAndDelete(req.params.id);
        if (!waitlistEntry) {
            res.status(404).send('Waitlist entry not found');
        } else {
            res.send(waitlistEntry);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

const createWaitlistByClient = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { email } = decodedToken;
        const client = await Client.findOne({ email });
        if (!client) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { barberId, locationId, date, duration, morning, afternoon, night } = req.body;

        const existingWaitlistItem = await WaitList.findOne({
            barber: barberId,
            location: locationId,
            client: client._id,
            date: date,
            duration: duration,
            morning: morning,
            afternoon: afternoon,
            night: night
        });

        if (existingWaitlistItem) {
            res.status(409).json({ message: "Waitlist item already exists" });
            return;
        }

        const waitlistItem = new WaitList({
            barber: barberId,
            location: locationId,
            client: client._id,
            date: date,
            duration: duration,
            morning: morning,
            afternoon: afternoon,
            night: night
        });

        await waitlistItem.save();
        res.status(201).send(waitlistItem);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};


module.exports = { createWaitlistByClient, createWaitlistEntry, getAllWaitlistEntries, getWaitlistEntryById, updateWaitlistEntry, deleteWaitlistEntry };
