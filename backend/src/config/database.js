const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;