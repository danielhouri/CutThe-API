const Client = require("../models/Client");
const { tokenValidation } = require("../tools");

const authClient = async (req, res) => {
    const token = req.headers.authorization;

    try {
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { name, given_name, family_name, email } = decodedToken;

        let client = await Client.findOne({ email });

        if (!client) {
            client = new Client({ name, given_name, family_name, email });
            await client.save();
        }

        res.status(201).json(client);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const createClient = async (req, res) => {
    try {
        const client = new Client({
            name: req.body.name,
            email: req.body.email,
            given_name: req.body.given_name,
            family_name: req.body.family_name,
            profilePicture: req.body.profilePicture,
            preferred_barbers: [],
            appointments: []
        });
        await client.save();
        res.status(201).send(client);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getClientById = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const client = await Client.findOne({ email: email })
            .populate({
                path: 'preferred_barber',
                populate: {
                    path: 'preferred_location',
                    model: 'Location'
                }
            })
            .populate({
                path: 'appointments',
                populate: [
                    {
                        path: 'barber',
                        model: 'Barber'
                    },
                    {
                        path: 'location',
                        model: 'Location'
                    }
                ],
                match: { status: false, start_time: { $gte: new Date() } },
                options: { sort: { date: 1 } }
            })
            .exec();
        if (!client) {
            res.status(404).send("Client not found");
            return;
        } else {
            res.send(client);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

const updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!client) {
            res.status(404).send("Client not found");
        } else {
            res.send(client);
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            res.status(404).send("Client not found");
        } else {
            res.send(client);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getClientAppointments = async (req, res) => {
    const token = req.headers.authorization;

    try {
        const decodedToken = await tokenValidation(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { email } = decodedToken;

        const client = await Client.findOne({ email: email })
            .populate({
                path: 'appointments',
                populate: [
                    {
                        path: 'barber',
                        model: 'Barber'
                    },
                    {
                        path: 'location',
                        model: 'Location'
                    }
                ],
                options: { sort: { date: -1 } }
            })
            .exec();

        if (!client) {
            res.status(404).send("Client not found");
        } else {
            res.send(client);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};


module.exports = { createClient, getClientById, updateClient, deleteClient, authClient, getClientAppointments };
