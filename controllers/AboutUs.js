const AboutUs = require("../models/AboutUs");
const Barber = require("../models/Barber");
const { tokenValidation } = require("../tools");

// Create a new AboutUs
const createAboutUs = async (req, res) => {
    try {
        const aboutUs = new AboutUs(req.body);
        await aboutUs.save();
        res.status(201).send(aboutUs);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get a single AboutUs entry by id
const getAboutUsById = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { email } = decodedToken;

        let barber = await Barber.findOne({ email });
        if (!barber) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const aboutUs = await AboutUs.findOne({ barber: barber._id }).select('pictures text');
        if (!aboutUs) {
            return res.status(404).send("AboutUs not found");
        }
        res.send(aboutUs);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a single AboutUs entry by id
const updateAboutUsById = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!aboutUs) {
            return res.status(404).send("AboutUs not found");
        }
        res.send(aboutUs);
    } catch (err) {
        res.status(400).send(err);
    }
};


const getAboutUsByBarberId = async (req, res) => {
    const { id } = req.params;
    try {
        const aboutUs = await AboutUs.findOne({ barber: id })
            .populate({
                path: 'barber',
                select: 'preferred_location phone_number slots',
                populate: {
                    path: 'preferred_location',
                    select: 'address city country'
                }
            });

        if (!aboutUs) {
            res.status(404).send({ message: "About us not found" });
            return;
        }
        res.status(200).send(aboutUs);
    } catch (err) {
        res.status(400).send(err);
    }
};

const updateAboutUsImageList = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { email } = decodedToken;

        let barber = await Barber.findOne({ email });
        if (!barber) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { picture } = req.body;
        if (!picture) {
            res.status(400).json({ message: "Missing picture" });
            return;
        }

        // Add the picture to the image list in the aboutUs field
        let aboutUs = await AboutUs.findOne({ barber: barber._id });
        aboutUs.pictures.push(picture);

        // Save the updated barber document
        await aboutUs.save();
        return res.status(200).json({ message: "Image added successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateAboutUsText = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { email } = decodedToken

        let barber = await Barber.findOne({ email });
        if (!barber) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "Missing text" });
        }

        // Update the text in the aboutUs field
        let aboutUs = await AboutUs.findOne({ barber: barber._id });
        if (!aboutUs) {
            // If aboutUs doesn't exist, create a new one
            aboutUs = new AboutUs({ barber: barber._id });
        }
        aboutUs.text = text;

        // Save the updated aboutUs document
        await aboutUs.save();

        return res.status(200).json({ message: "Text updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

const deleteAboutUsImage = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = await tokenValidation(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { email } = decodedToken;

        let barber = await Barber.findOne({ email });
        if (!barber) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const imageIndex = req.params.id;

        // Find the aboutUs document for the barber
        let aboutUs = await AboutUs.findOne({ barber: barber._id });

        if (imageIndex < 0 || imageIndex >= aboutUs.pictures.length) {
            return res.status(404).json({ message: "Invalid image index" });
        }

        // Remove the image from the pictures array
        aboutUs.pictures.splice(imageIndex, 1);

        // Save the updated aboutUs document
        await aboutUs.save();

        return res.status(200).json({ message: "Image deleted successfully" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { deleteAboutUsImage, updateAboutUsText, updateAboutUsImageList, createAboutUs, getAboutUsById, updateAboutUsById, getAboutUsByBarberId };



