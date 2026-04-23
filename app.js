const path = require('path');
require('dotenv').config();

const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// ✅ FIX: Proper MongoDB connection (NO extra options, NO user/pass separately)
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
});

// Schema
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// ✅ FIX: async/await instead of callback
app.post('/planet', async (req, res) => {
    try {
        const planetData = await planetModel.findOne({ id: req.body.id });

        if (!planetData) {
            return res.status(404).json({ message: "Planet not found" });
        }

        res.json(planetData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error in Planet Data" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/os', (req, res) => {
    res.json({
        os: OS.hostname(),
        env: process.env.NODE_ENV
    });
});

app.get('/live', (req, res) => {
    res.json({ status: "live" });
});

app.get('/ready', (req, res) => {
    res.json({ status: "ready" });
});

app.listen(3000, () => {
    console.log("Server successfully running on port - 3000");
});

module.exports = app;