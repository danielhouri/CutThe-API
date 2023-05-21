const Product = require('../models/Product');
const Barber = require('../models/Barber');

const { tokenValidation } = require("../tools");

// CREATE
async function createProduct(req, res) {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// READ
async function getAllProducts(req, res) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// UPDATE
async function updateProduct(req, res) {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// DELETE
async function deleteProduct(req, res) {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getProductsByBarberId(req, res) {
    const { barberId } = req.params;
    try {
        const products = await Product.find({ barber: barberId });
        res.send(products);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getProductsByToken(req, res) {
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

        const products = await Product.find({ barber: barber._id });
        res.send(products);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = { getProductsByToken, createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByBarberId };
