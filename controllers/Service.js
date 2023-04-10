const Service = require("../models/Service");

// Create a new service
const createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).send(service);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.send(services);
    } catch (err) {
        res.status(500).send(err);
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
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!service) {
            res.status(404).send("Service not found");
        } else {
            res.send(service);
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete a service by ID
const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            res.status(404).send("Service not found");
        } else {
            res.send(service);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = { createService, getAllServices, getServiceById, updateService, deleteService, };
