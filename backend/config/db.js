const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error("Error in DB Connection:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
    