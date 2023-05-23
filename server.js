const router = require("./router");
const mongoose = require("mongoose");
const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
app.use(bodyParser.json())

dotenv.config({ path: "./tools.env" });

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

// Start the server and listen on a specific port
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});