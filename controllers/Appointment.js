const Appointment = require("../models/Appointment");
const Client = require("../models/Client");
const Barber = require("../models/Barber");
const Product = require("../models/Product");
const moment = require('moment/moment');

const { tokenValidation, sendNotification, findWaitListAppointment } = require("../tools");

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

        const { barberId, start_time, end_time, service, location, ordered_products, price } = req.body;

        const barber = await Barber.findById(barberId);
        if (!barber) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const appointment = new Appointment({
            barber: barberId,
            client: client._id,
            start_time,
            end_time,
            service,
            location,
            ordered_products,
            price
        });

        const savedAppointment = await appointment.save();

        // Update the quantity of ordered products
        for (const orderedProduct of ordered_products) {
            const { product, quantity } = orderedProduct;

            // Find the product and subtract the quantity bought
            await Product.updateOne(
                { _id: product },
                { $inc: { quantity: -quantity } }
            );
        }

        // Add the appointment id to the barber
        await Client.updateOne(
            { _id: client._id },
            { $push: { appointments: savedAppointment._id } }
        );

        // Send notifications to all messaging_token values
        for (const messagingToken of barber.messaging_token) {
            const date = moment(start_time).format('DD/MM/YYYY')
            const time = moment(start_time).format('HH:mm')

            await sendNotification(messagingToken, barber.name, { code: 4, payload: { date: date, time: time } });
        }

        res.status(201).send(appointment);
    } catch (err) {
        console.log(err)
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
                select: "email messaging_token name",
            },
            {
                path: "barber",
                select: "email messaging_token name",
            },
            {
                path: "ordered_products.product",
                select: "quantity",
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

        // Check if the appointment is already canceled
        if (appointment.status) {
            res.status(400).send("Appointment is already canceled");
            return;
        }

        // Set appointment status to canceled
        appointment.status = true;
        await appointment.save();

        if (appointment.client.email == email) {
            // Notify barber
            // Send notifications to all messaging_token values
            for (const messagingToken of appointment.barber.messaging_token) {
                const date = moment(start_time).format('DD/MM/YYYY')
                await sendNotification(messagingToken, appointment.client.name, { code: 0, payload: { date: date } });
            }
        } else {
            // Notify client
            // Send notifications to all messaging_token values
            for (const messagingToken of appointment.client.messaging_token) {
                const date = moment(start_time).format('DD/MM/YYYY')
                await sendNotification(messagingToken, appointment.barber.name, { code: 0, payload: { date: date } });
            }
        }

        // Add the ordered products' quantity back to the product schema
        for (const orderedProduct of appointment.ordered_products) {
            const { product, quantity } = orderedProduct;
            await Product.findByIdAndUpdate(product._id, { $inc: { quantity: quantity } });
        }

        res.send(appointment);

        findWaitListAppointment(appointment.barber._id, appointment.barber.name, appointment.location._id, appointment.start_time);
    } catch (err) {
        console.log(err);
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

        const { clientId, start_time, end_time, service, location, ordered_products, price } = req.body;

        const client = await Client.findById(clientId);
        if (!client) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const appointment = new Appointment({
            barber: barber._id,
            client: clientId,
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
            { _id: clientId },
            { $push: { appointments: savedAppointment._id } }
        );

        // Update the quantity of ordered products
        for (const orderedProduct of ordered_products) {
            const { product, quantity } = orderedProduct;

            // Find the product and subtract the quantity bought
            await Product.updateOne(
                { _id: product },
                { $inc: { quantity: -quantity } }
            );
        }

        // Send notifications to all messaging_token values
        for (const messagingToken of client.messaging_token) {
            const date = moment(start_time).format('DD/MM/YYYY');
            const time = moment(start_time).format('HH:mm');

            await sendNotification(messagingToken, client.name, { code: 4, payload: { date: date, time: time } });
        }

        res.status(201).send(appointment);
    } catch (err) {
        console.log(err)
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
