const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  device_id: { type: String, unique: true },

  vehicle_number: String,

  lat: Number,
  lng: Number,

  battery: Number,
  network: String,

  lastSeen: Date,
  lastLogTime: Date,

  lastAppOpenTime: Date,
  lastRebootTime: Date
});

module.exports = mongoose.model("Device", deviceSchema);