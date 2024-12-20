const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://ayushtiwari0803:5ZOzO5zTyBQrSIIa@practice.3byp7.mongodb.net/Dev4U");
};

module.exports = connectDB;