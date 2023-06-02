const { OAuth2Client } = require('google-auth-library')
require("dotenv").config({ path: "./tools.env" });
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const Barber = require("../models/Barber");
const Client = require("../models/Client");
const Location = require("../models/Location");

const { findClosestBarbers, tokenValidation, searchBarber, getNumberOfAppointmentsToday, getNumberOfProductsPurchasedToday, getNumberOfCancelledAppointments, getNextAppointments, getNumberOfCompletedAppointmentsToday, getNumberOfAppointmentsPastWeek, getEstimatedRevenue, getTotalBookedHours } = require('../tools');

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

        const { messagingToken, lang } = req.body;

        // Check if the messagingToken already exists in the messaging_token array
        if (messagingToken && !barber.messaging_token.includes(messagingToken)) {
            barber.messaging_token.push(messagingToken);
            await barber.save();
        }

        // Update the client language 
        if (lang && barber.language != lang) {
            barber.language = lang;
            await barber.save();
        }

        res.status(201).json(barber);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
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
        const { city, country, lat, lon, cash, credit } = req.params;
        const barberList = await searchBarber(city, country, lat, lon, cash, credit);

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
            select: 'name profilePicture email phone_number'
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


// Update a service by ID
const updatePaymentMethod = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        let barber = await Barber.findOne({ email });
        if (!barber) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const type = req.params.type;

        barber.pay_barber_cash = (type == 2 || type == 3) ? true : false;
        barber.pay_barber_credit_card = (type == 1 || type == 3) ? true : false;

        await barber.save()
        res.status(201).json(barber);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
};

const setPreferredLocation = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        let barber = await Barber.findOne({ email });
        if (!barber) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const locationId = req.params.locationId;

        // Find the location by ID
        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        // Update the preferred location of the barber
        barber.preferred_location = locationId;
        await barber.save();

        res.status(200).json({ message: "Preferred location set successfully", barber });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const updateBarber = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        let barber = await Barber.findOne({ email });
        if (!barber) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { given_name, family_name, phone_number, name } = req.body;

        // Update the barber's fields
        barber.given_name = given_name;
        barber.family_name = family_name;
        barber.phone_number = phone_number;
        barber.name = name;

        await barber.save();

        res.status(200).json({ message: "Barber updated successfully", barber });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


const getInfoForBarber = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        let barber = await Barber.findOne({ email });
        if (!barber) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const numberOfAppointmentsToday = await getNumberOfAppointmentsToday(barber._id);
        const numberOfProductsPurchasedToday = await getNumberOfProductsPurchasedToday(barber._id);
        const numberOfCancelledAppointments = await getNumberOfCancelledAppointments(barber._id);
        const nextAppointments = await getNextAppointments(barber._id);
        const numberOfCompletedAppointmentsToday = await getNumberOfCompletedAppointmentsToday(barber._id);
        const numberOfAppointmentsPastWeek = await getNumberOfAppointmentsPastWeek(barber._id);
        const estimatedRevenue = await getEstimatedRevenue(barber._id);
        const totalBookedHours = await getTotalBookedHours(barber._id);

        res.status(200).json({ totalBookedHours, estimatedRevenue, numberOfAppointmentsPastWeek, numberOfAppointmentsPastWeek, numberOfCompletedAppointmentsToday, nextAppointments, numberOfAppointmentsToday, numberOfProductsPurchasedToday, numberOfCancelledAppointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getInfoForBarber, updateBarber, setPreferredLocation, updatePaymentMethod, AddClientToBarber, removeClientFromBarber, removeClientFromBarber, getBarberClients, getBarberById, authBarber, getClosestBarber, getBarberBySearch };
