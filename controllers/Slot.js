const Slot = require("../models/Slot");
const Barber = require("../models/Barber");
const Location = require("../models/Location");

const { getAvailableSlots, tokenValidation, findWaitListAppointment } = require("../tools");

// Create a new slot
const createSlot = async (req, res) => {
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

        const { location, start_time, end_time } = req.body
        // Check if the location exists
        const existingLocation = await Location.findById(location);
        if (!existingLocation) {
            return res.status(401).json({ message: "Unauthorized - Location does not exist" });
        }

        const slot = new Slot({ barber: barber._id, location, start_time, end_time });
        await slot.save();

        // Add the new slot ID to the array of slots in the LocationSchema
        existingLocation.slots.push(slot._id);
        await existingLocation.save();

        res.status(201).send(slot);

        // Send notification to client that are in the waiting list
        findWaitListAppointment(barber._id, barber.name, location, start_time);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
};

// Get all slots
const getAllSlots = async (req, res) => {
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

        const slots = await Slot.find({ barber: barber._id })
            .populate('location') // Populate the 'location' field
            .sort({ end_time: -1 }); // Sort by 'end_time' in descending order

        res.send(slots);
    } catch (err) {
        console.log(err)
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

        const { location, start_time, end_time } = req.body;

        const slot = await Slot.findByIdAndUpdate(
            req.params.id,
            {
                barbar: barber._id,
                location,
                start_time,
                end_time
            },
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
        console.log(err)
        res.status(400).send(err);
    }
};

const deleteSlot = async (req, res) => {
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

        const slot = await Slot.findByIdAndDelete(req.params.id);
        if (!slot) {
            return res.status(404).send("Slot not found");
        }

        // Get the associated location
        const location = await Location.findById(slot.location);
        if (!location) {
            return res.status(404).send("Location not found");
        }

        // Remove the slot ID from the location's slots array
        const slotIndex = location.slots.indexOf(slot._id);
        if (slotIndex > -1) {
            location.slots.splice(slotIndex, 1);
            await location.save();
        }

        res.send(slot);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};


const getSlotsByBarberAndLocation = async (req, res) => {
    const { barberId, locationId } = req.params;

    try {
        const slots = await getAvailableSlots(barberId, locationId);
        res.send(slots);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = { createSlot, getAllSlots, getSlotById, updateSlot, deleteSlot, getSlotsByBarberAndLocation };
