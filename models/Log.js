const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  device_id: String,

  lat: Number,
  lng: Number,

  battery: Number,
  charging: String,
  network: String,

  status: String,

  event: String, // heartbeat / reboot
  app: String,

  timestamp: Date
});

module.exports = mongoose.model("Log", logSchema);