const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");  // Import the auth middleware
const authRoutes = require('./auth'); // Adjust the path to where your auth.js is located

// Initialize app (this must come before you use app in any routes or middleware)
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Use Express's built-in body parser for JSON

// Use routes (ensure routes are added after the app is initialized)
app.use('/api/auth', authRoutes);

// MongoDB connection setup
mongoose.connect(
    "mongodb+srv://teamHurricane:firstPlace1@hurricanedata.tfo8r.mongodb.net/?retryWrites=true&w=majority&appName=hurricaneData",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB Atlas");
});

// Pin Schema
const pinSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    description: String,
    issueType: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Store reference to the user who added the pin
});

const Pin = mongoose.model("Pin", pinSchema);

// Protected API route to save pin data (requires JWT)
app.post("/api/pins", authMiddleware, async (req, res) => {
    try {
        const newPin = new Pin({
            lat: req.body.lat,
            lng: req.body.lng,
            description: req.body.description,
            issueType: req.body.issueType,
            userId: req.user._id  // Get user ID from the token, added by authMiddleware
        });

        // Save the pin using async/await
        const savedPin = await newPin.save();
        res.status(200).send(savedPin);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Public API route to get all pins (doesn't require JWT)
app.get("/api/pins", async (req, res) => {
    try {
        const pins = await Pin.find({});
        res.status(200).send(pins);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
