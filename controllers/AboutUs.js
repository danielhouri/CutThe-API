const AboutUs = require("../models/AboutUs");

// Create a new AboutUs
const createAboutUs = async (req, res) => {
    try {
        const aboutUs = new AboutUs(req.body);
        await aboutUs.save();
        res.status(201).send(aboutUs);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all AboutUs entries
const getAllAboutUs = async (req, res) => {
    try {
        const aboutUsEntries = await AboutUs.find();
        res.send(aboutUsEntries);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get a single AboutUs entry by id
const getAboutUsById = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findById(req.params.id);
        if (!aboutUs) {
            return res.status(404).send("AboutUs not found");
        }
        res.send(aboutUs);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a single AboutUs entry by id
const updateAboutUsById = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!aboutUs) {
            return res.status(404).send("AboutUs not found");
        }
        res.send(aboutUs);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete a single AboutUs entry by id
const deleteAboutUsById = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findByIdAndDelete(req.params.id);
        if (!aboutUs) {
            return res.status(404).send("AboutUs not found");
        }
        res.send(aboutUs);
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAboutUsByBarberId = async (req, res) => {
    const { id } = req.params;
    try {
        const aboutUs = await AboutUs.findOne({ barber: id })
            .populate({
                path: 'barber',
                select: 'preferred_location phone_number slots',
                populate: {
                    path: 'preferred_location',
                    select: 'address city country'
                }
            });

        if (!aboutUs) {
            res.status(404).send({ message: "About us not found" });
            return;
        }
        res.status(200).send(aboutUs);
    } catch (err) {
        res.status(400).send(err);
    }
};


module.exports = { createAboutUs, getAllAboutUs, getAboutUsById, updateAboutUsById, deleteAboutUsById, getAboutUsByBarberId };



