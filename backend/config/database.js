const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const { connection } = await mongoose.connect(
      "mongodb://127.0.0.1:27017/gallery"
    );

    console.log(`MongoDB connected: ${connection.host}`)
  } catch (e) {
    console.error(`MongoDB failed: ${error}`);
    process.exit(1);
  }
}