const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  device_id: String,
  lat: Number,
  lng: Number,
  status: String,
  timestamp: Date
});

module.exports = mongoose.model("Log", logSchema);