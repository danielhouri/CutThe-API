const { OAuth2Client } = require('google-auth-library')
require("dotenv").config({ path: "./tools.env" });
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const Barber = require("../models/Barber");
const { findClosestBarber } = require('../tools');


const authBarber = async (req, res) => {
    const { token } = req.body;

    console.log(token)

    try {
        // verify token using Google API
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });

        const { name, email, picture } = ticket.getPayload();
        console.log({ name, email, picture });

        const barber = await Barber.findOne({ email }); // find barber in database by email
        if (!barber) { // if barber not found
            return res.status(401).json({ message: "Unauthorized" }); // return unauthorized status
        }
        res.status(201).json({ barber, token }); // return barber data and token

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Create a new barber
const createBarber = async (req, res) => {
    try {
        const barber = new Barber(req.body);
        await barber.save();
        res.status(201).send(barber);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all barbers
const getAllBarbers = async (req, res) => {
    try {
        const barbers = await Barber.find();
        res.send(barbers);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get a single barber by ID
const getBarberById = async (req, res) => {
    try {
        const barber = await Barber.findById(req.params.id);
        if (!barber) {
            res.status(404).send("Barber not found");
        } else {
            res.send(barber);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a barber by ID
const updateBarber = async (req, res) => {
    try {
        const barber = await Barber.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!barber) {
            res.status(404).send("Barber not found");
        } else {
            res.send(barber);
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete a barber by ID
const deleteBarber = async (req, res) => {
    try {
        const barber = await Barber.findByIdAndDelete(req.params.id);
        if (!barber) {
            res.status(404).send("Barber not found");
        } else {
            res.send(barber);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get the closest barber
const getClosestBarber = async (req, res) => {
    const token = req.headers.authorization;

    try {
        const decodedToken = await tokenValidation(token);
        if (!decodedToken) {
            console.log(decodedToken)
            res.status(401).json({ message: "Unauthorized" });
        }

        const { city, country, address } = req.params;
        returnedList = findClosestBarber(city, country, address);

        if (!returnedList) {
            res.status(404).send("Location not found");
        } else {
            res.send(returnedList);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = { createBarber, getAllBarbers, getBarberById, updateBarber, deleteBarber, authBarber, getClosestBarber };
