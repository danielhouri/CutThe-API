const Comment = require("../models/Comment");
const Client = require("../models/Client");
const Barber = require("../models/Barber");

const { tokenValidation } = require("../tools");


// Get all Comments
const getAllComments = async (req, res) => {
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

        const comments = await Comment.find({ barber: barber._id })
            .populate("client", "name");
        res.send(comments);
    } catch (err) {
        res.status(500).send(err);
    }
};


// Get a single Comment by id
const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        res.send(comment);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a single Comment by id
const updateCommentById = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        res.send(comment);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete a single Comment by id
const deleteCommentById = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        res.send(comment);
    } catch (err) {
        res.status(500).send(err);
    }
};

const getCommentsByBarberId = async (req, res) => {
    try {
        const comments = await Comment.find({ barber: req.params.id }).populate('client', 'name');

        if (!comments) {
            res.status(404).send("Comments not found for this barber");
        } else {
            res.send(comments);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Create a new Comment
const createCommentByClient = async (req, res) => {
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

        const { barber, rating, date, text } = req.body;

        const comment = new Comment({
            barber,
            client: client._id,
            date,
            rating,
            text
        })

        await comment.save();
        res.status(201).send(comment);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
};


module.exports = { getAllComments, getCommentsByBarberId, createCommentByClient };



