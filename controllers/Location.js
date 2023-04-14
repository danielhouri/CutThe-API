const Location = require("../models/Location");

// Create a new location
const createLocation = async (req, res) => {
    try {
        const location = new Location(req.body);
        await location.save();
        res.status(201).send(location);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all locations
const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.send(locations);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get a single location by ID
const getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
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
        const location = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
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
        res.status(400).send(err);
    }
};

// Delete a location by ID
const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            res.status(404).send("Location not found");
        } else {
            res.send(location);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = { createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation, };
