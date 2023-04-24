const Appointment = require("../models/Appointment");
const Client = require("../models/Client");
const { tokenValidation } = require("../tools");

// Create a new appointment
const createAppointmentByClient = async (req, res) => {
    const token = req.headers.authorization;

    try {
        const decodedToken = await tokenValidation(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const client = await Client.findOne({ email });
        if (!client) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { barber, start_time, end_time, service, location } = req.body;
        const appointment = new Appointment({
            barber,
            client: client._id,
            start_time,
            end_time,
            service,
            location
        });

        const savedAppointment = await appointment.save();

        // Add the appointment id to the barber
        await Client.updateOne(
            { _id: client._id },
            { $push: { appointments: savedAppointment._id } }
        );

        res.status(201).send(appointment);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
    console.log(req)
    try {
        const appointments = await Appointment.find();
        res.send(appointments);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
    const token = req.headers.authorization;
    try {
        const decodedToken = await tokenValidation(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const appointment = await Appointment.findById(req.params.id)
            .populate('barber', 'name email profilePicture')
            .populate('client', 'name email profilePicture')
            .populate('service', 'name duration price')
            .populate('location', 'name address city country')
            .exec();


        if (!appointment) {
            res.status(404).send("Appointment not found");
            return;
        }

        if (appointment.barber.email !== email && appointment.client.email !== email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        res.send(appointment);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

// Update an appointment by ID
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!appointment) {
            res.status(404).send("Appointment not found");
        } else {
            res.send(appointment);
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete an appointment by ID
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            res.status(404).send("Appointment not found");
        } else {
            res.send(appointment);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Cancel an apointment
const cancelAppointment = async (req, res) => {
    const token = req.headers.authorization;
    try {
        const decodedToken = await tokenValidation(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const appointment = await Appointment.findById(req.params.id).populate([
            {
                path: "client",
                select: "email",
            },
            {
                path: "barber",
                select: "email",
            },
        ]);

        if (!appointment) {
            res.status(404).send("Appointment not found");
            return;
        }

        if (appointment.client.email !== email && appointment.barber.email !== email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        appointment.status = "cancelled";

        await appointment.save();
        res.send(appointment);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = { createAppointmentByClient, getAllAppointments, getAppointmentById, updateAppointment, deleteAppointment, cancelAppointment };
