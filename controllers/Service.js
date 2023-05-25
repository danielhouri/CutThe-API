const Service = require("../models/Service");
const Barber = require("../models/Barber");
const { tokenValidation } = require("../tools");

// Create a new service
const createService = async (req, res) => {
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

        const { name, duration, price } = req.body

        const service = new Service({
            barber: barber._id,
            name,
            duration,
            price
        });

        await service.save();
        res.status(201).send(service);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
};

// Get a single service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            res.status(404).send("Service not found");
        } else {
            res.send(service);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a service by ID
const updateService = async (req, res) => {
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

        const { name, duration, price } = req.body

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            {
                name: name, duration: duration, price: price
            },
            {
                new: true,
            }
        );
        if (!service) {
            res.status(404).send("Service not found");
        } else {
            res.send(service);
        }
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
};

// Delete a service by ID
const deleteService = async (req, res) => {
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

        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            res.status(404).send("Service not found");
        } else {
            res.send(service);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

// Get services of a baber
const getServicesByBarberId = async (req, res) => {
    try {
        const barberId = req.params.id;
        const services = await Service.find({ barber: barberId });
        res.send(services);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

// Get services of a baber
const getServicesByToken = async (req, res) => {
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

        const services = await Service.find({ barber: barber._id });
        res.send(services);

    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

module.exports = { getServicesByToken, createService, getServiceById, updateService, deleteService, getServicesByBarberId };
