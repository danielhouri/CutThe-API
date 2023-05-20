const { OAuth2Client } = require('google-auth-library')
require("dotenv").config({ path: "./tools.env" });
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const Barber = require("../models/Barber");
const Client = require("../models/Client");

const { findClosestBarbers, tokenValidation, searchBarber } = require('../tools');

const authBarber = async (req, res) => {
    try {
        const token = req.headers.authorization;

        // verify token using Google API
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });

        const { email } = ticket.getPayload();

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
        const barber = await Barber.findById(req.params.id)
            .select('name preferred_location profilePicture')
            .populate(
                {
                    path: 'preferred_location',
                    select: 'name slots',
                    populate: {
                        path: 'slots',
                        select: 'start_time end_time'
                    }
                });

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
            res.status(401).json({ message: "Unauthorized" });
            return
        }
        const { city, country, lat, lon } = req.params;

        // Check if any of the parameters are undefined
        if (city === undefined || country === undefined || lat === undefined || lon === undefined) {
            res.status(400).send("Bad Request: Missing parameter(s)");
            return;
        }

        returnedList = await findClosestBarbers(city, country, { latitude: lat, longitude: lon });

        if (!returnedList) {
            res.status(404).send("Location not found");
        } else {
            res.send(returnedList);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};


const getBarberBySearch = async (req, res) => {
    try {
        const { city, country, lat, lon, store, home, cash, credit } = req.params;
        const barberList = await searchBarber(city, country, lat, lon, store, home, cash, credit);
        res.status(200).json(barberList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getBarberClients = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const barber = await Barber.findOne({ email }).populate({
            path: 'clients',
            select: 'name profilePicture email'
        });

        if (!barber) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const clients = barber.clients;
        res.send(clients);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

const removeClientFromBarber = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const userId = req.params.id;
        // Perform token validation if required
        const barber = await Barber.findOneAndUpdate(
            { email: email }, // Assuming email is used to identify the barber
            { $pull: { clients: userId } },
            { new: true }
        );

        if (!barber) {
            res.status(404).json({ message: 'Barber not found' });
            return;
        }

        res.status(200).json({ message: 'Client removed successfully', barber });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error removing client', error });
    }
};

const AddClientToBarber = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const barber = await Barber.findOne({ email });
        if (!barber) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const clientExists = await Client.findOne({ email: req.body.email });

        if (clientExists) {
            barber.clients.push(clientExists);
            await barber.save();
            res.status(201).json(clientExists);
        } else {
            // Create a new client
            const client = new Client({
                name: req.body.given_name + ' ' + req.body.family_name,
                email: req.body.email,
                given_name: req.body.given_name,
                family_name: req.body.family_name,
            });
            await client.save();

            barber.clients.push(client);
            await barber.save();

            res.status(201).json(client);
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = { AddClientToBarber, removeClientFromBarber, removeClientFromBarber, getBarberClients, createBarber, getAllBarbers, getBarberById, updateBarber, deleteBarber, authBarber, getClosestBarber, getBarberBySearch };
