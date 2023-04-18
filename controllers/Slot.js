const Slot = require("../models/Slot");

// Create a new slot
const createSlot = async (req, res) => {
    try {
        const slot = new Slot(req.body);
        await slot.save();
        res.status(201).send(slot);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all slots
const getAllSlots = async (req, res) => {
    try {
        const slots = await Slot.find();
        res.send(slots);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get a single slot by ID
const getSlotById = async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (!slot) {
            res.status(404).send("Slot not found");
        } else {
            res.send(slot);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a slot by ID
const updateSlot = async (req, res) => {
    try {
        const slot = await Slot.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!slot) {
            res.status(404).send("Slot not found");
        } else {
            res.send(slot);
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete a slot by ID
const deleteSlot = async (req, res) => {
    try {
        const slot = await Slot.findByIdAndDelete(req.params.id);
        if (!slot) {
            res.status(404).send("Slot not found");
        } else {
            res.send(slot);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getSlotsByBarberAndLocation = async (req, res) => {
    const { barberId, locationId } = req.params;

    try {
        const slots = await Slot.find({
            barber: barberId,
            location: locationId
        });

        res.send(slots);
    } catch (err) {
        res.status(500).send(err);
    }
};


module.exports = { createSlot, getAllSlots, getSlotById, updateSlot, deleteSlot, getSlotsByBarberAndLocation };
