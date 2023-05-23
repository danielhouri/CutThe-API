const router = require("./router");
const mongoose = require("mongoose");
const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const { sendNotifaction } = require("./tools");

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

sendNotifaction('fbmQhHKXQGavzjxhJ4foK4:APA91bG6ZpyTyG-nSD12ksX7JxCNs4DMNsVkBm1yVIJ7uCzUJQOLddkvj-Yvke_dJxeb3q1rKsFZqFaVggPcV63_b9uqgtqNjsChWZlwDUh2_0_fq7Ux44UA-RVeSRp1ZWbh5UDlb4gX');