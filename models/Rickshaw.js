const mongoose = require("mongoose");

const rickshawSchema = new mongoose.Schema({
  vehicle_number: {
    type: String,
    unique: true
  },

  driver: {
    name: String,
    phone: String,
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String
    }
  },

  kyc: {
    aadhaar_number: String,
    pan_number: String
  },

  bank: {
    account_holder_name: String,
    account_number: String,
    ifsc_code: String,
    upi_id: String
  },

  device_id: {
    type: String,
    unique: true,
    sparse: true
  },

  status: {
    type: String,
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Rickshaw", rickshawSchema);