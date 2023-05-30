const Notification = require("../models/Notification");
const Client = require("../models/Client");
const Barber = require("../models/Barber");

const { tokenValidation, sendNotification } = require("../tools");

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).send(notification);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Read all notifications
const getAllNotifications = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const client = await Client.findOne({ email }).select('_id');;
        if (!client) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const notifications = await Notification.find({ client: client._id }).sort({ createdAt: -1 });;

        res.send(notifications);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Read a single notification by ID
const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate('client barber');
        if (!notification) {
            return res.status(404).send('Notification not found');
        }
        res.send(notification);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a notification by ID
const updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('client barber');
        if (!notification) {
            return res.status(404).send('Notification not found');
        }
        res.send(notification);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete a notification by ID
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).send('Notification not found');
        }
        res.send(notification);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a notification by ID
const BarberSendNotification = async (req, res) => {
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

        const { clientList, title, body } = req.body;

        for (let clientId of clientList) {
            const client = await Client.findById(clientId);
            if (!barber) {
                res.status(400).json({ message: "Barber not found" });
                return;
            }
            for (messageToken of client.messaging_token) {
                sendNotification(messageToken, title, body, client._id, barber._id);
            }
        }


        res.send();
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = { BarberSendNotification, createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification };
