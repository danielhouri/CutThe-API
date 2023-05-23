const Location = require("../models/Location");
const Barber = require("../models/Barber");

const { tokenValidation } = require("../tools");

// Create a new location
const createLocation = async (req, res) => {
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

        const { name, address, city, country, coordinates } = req.body

        const location = new Location({
            name,
            address,
            city,
            country,
            coordinates,
            barber: barber._id
        });

        await location.save();
        res.status(201).send(location);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
};

// Get all locations
const getAllLocations = async (req, res) => {
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

        const location = await Location.find({ barber: barber._id });
        if (!location) {
            res.status(404).send("Location not found");
        } else {
            res.send(location);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a location by ID
const updateLocation = async (req, res) => {
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

        const { name, address, city, country, coordinates } = req.body

        const location = await Location.findByIdAndUpdate(
            req.params.id,
            {
                name,
                address,
                city,
                country,
                coordinates
            },
            {
                new: true,
                runValidators: true,
            }
        );
        if (!location) {
            res.status(404).send("Location not found");
        } else {
            res.send(location);
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

// Delete a location by ID
const deleteLocation = async (req, res) => {
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

        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            res.status(404).send("Location not found");
        } else {
            res.send(location);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

const getBarberLocations = async (req, res) => {
    try {
        const barberId = req.params.id;
        const locations = await Location.find({ barber: barberId }).select('name address city country');

        if (!locations || locations.length === 0) {
            res.status(404).send("No locations found for the barber");
        } else {
            res.send(locations);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};


module.exports = { createLocation, getAllLocations, updateLocation, deleteLocation, getBarberLocations };
