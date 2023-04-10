const Comment = require("../models/Comment");

// Create a new Comment
const createComment = async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).send(comment);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all Comments
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
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

module.exports = { createComment, getAllComments, getCommentById, updateCommentById, deleteCommentById, };



