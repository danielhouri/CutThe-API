const Appointment = require("../models/Appointment");
const Client = require("../models/Client");
const Barber = require("../models/Barber");

const { tokenValidation } = require("../tools");

// Create a new appointment
const createAppointmentByClient = async (req, res) => {
    try {
        const token = req.headers.authorization;

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

        const { barber, start_time, end_time, service, location, ordered_products, price } = req.body;
        const appointment = new Appointment({
            barber,
            client: client._id,
            start_time,
            end_time,
            service,
            location,
            ordered_products,
            price
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

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const token = req.headers.authorization;

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
            .populate({
                path: 'ordered_products',
                populate: {
                    path: 'product',
                    model: 'Product',
                    select: 'title description price image quantity'
                }
            })
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
        const token = req.headers.authorization;

        const decodedToken = await tokenValidation(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const barber = await Barber.findOne({ email });
        if (!barber) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const appointmentId = req.params.id;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        const client = await Client.findByIdAndUpdate(
            appointment.client,
            { $pull: { appointments: appointmentId } },
            { new: true }
        );

        if (!client) {
            res.status(404).json({ message: 'Client not found' });
            return;
        }

        await Appointment.findByIdAndRemove(appointmentId);

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};


// Cancel an apointment
const cancelAppointment = async (req, res) => {
    try {
        const token = req.headers.authorization;
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

        appointment.status = true;

        await appointment.save();
        res.send(appointment);
    } catch (err) {
        res.status(500).send(err);
    }
};

const getBarberAppointmentsByMonth = async (req, res) => {

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

        const date = new Date(req.params.date)

        const appointments = await Appointment.find({
            barber: barber._id,
            start_time: {
                $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                $lte: new Date(date.getFullYear(), date.getMonth() + 1, 0)
            }
        })
            .populate('client', 'name email')
            .populate('service', 'name')
            .populate('location', 'name')
            .exec();

        res.send(appointments);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

// Create a new appointment
const createAppointmentByBarber = async (req, res) => {
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

        const { client, start_time, end_time, service, location, ordered_products, price } = req.body;

        const appointment = new Appointment({
            barber: barber._id,
            client: client,
            start_time,
            end_time,
            service,
            location,
            ordered_products,
            price
        });

        const savedAppointment = await appointment.save();

        // Add the appointment id to the barber
        await Client.updateOne(
            { _id: client },
            { $push: { appointments: savedAppointment._id } }
        );

        res.status(201).send(appointment);
    } catch (err) {
        res.status(400).send(err);
    }
};

const updateAppointmentTime = async (req, res) => {
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

        const { appointmentId, newStartTime, newEndTime } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { start_time: newStartTime, end_time: newEndTime },
            { new: true }
        );

        if (!appointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        res.status(200).json({ message: 'Appointment time updated successfully', appointment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating appointment time', error });
    }
};


module.exports = { deleteAppointment, updateAppointmentTime, createAppointmentByBarber, getBarberAppointmentsByMonth, createAppointmentByClient, getAppointmentById, updateAppointment, deleteAppointment, cancelAppointment };
