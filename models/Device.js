const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  device_id: { type: String, required: true, unique: true },
  vehicle_number: String,
  lat: Number,
  lng: Number,
  status: String,
  lastSeen: Date,
  lastLogTime: Date
});

module.exports = mongoose.model("Device", deviceSchema);