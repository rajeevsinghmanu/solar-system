const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// ✅ Mongo connection (works for local + CI + prod)
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Add auth only if provided
if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
    options.user = process.env.MONGO_USERNAME;
    options.pass = process.env.MONGO_PASSWORD;
}

mongoose.connect(mongoURI, options, function(err) {
    if (err) {
        console.log("❌ MongoDB error: " + err);
    } else {
        console.log("✅ MongoDB Connected");
    }
});

// Schema
const dataSchema = new mongoose.Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// API
app.post('/planet', function(req, res) {
    planetModel.findOne({ id: req.body.id }, function(err, planetData) {
        if (err) {
            console.log("Error fetching planet data");
            return res.status(500).send("Error in Planet Data");
        }
        res.send(planetData);
    });
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', function(req, res) {
    res.json({
        os: OS.hostname(),
        env: process.env.NODE_ENV
    });
});

app.get('/live', function(req, res) {
    res.json({ status: "live" });
});

app.get('/ready', function(req, res) {
    res.json({ status: "ready" });
});

// ✅ Prevent server start during tests
if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server successfully running on port - 3000");
    });
}

module.exports = app;