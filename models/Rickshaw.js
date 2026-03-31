const mongoose = require("mongoose");

const rickshawSchema = new mongoose.Schema({

  // 🚗 VEHICLE DETAILS
  vehicle_number: {
    type: String,
    required: true,
    unique: true
  },
  vehicle_type: {
    type: String,
    default: "auto"
  },
  registration_date: Date,
  insurance_valid_till: Date,

  // 👨 DRIVER DETAILS
  driver: {
    name: String,
    phone: String,
    alternate_phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String
    }
  },

  // 🪪 KYC DETAILS (VERY IMPORTANT)
  kyc: {
    aadhaar_number: String,
    pan_number: String,
    aadhaar_verified: { type: Boolean, default: false },
    pan_verified: { type: Boolean, default: false }
  },

  // 💰 BANK DETAILS
  bank: {
    account_holder_name: String,
    account_number: String,
    ifsc_code: String,
    bank_name: String,
    upi_id: String
  },

  // 📱 DEVICE LINK
  device_id: {
    type: String,
    unique: true,
    sparse: true
  },

  // ⚙️ OPERATIONAL DATA
  status: {
    type: String,
    default: "active" // active / inactive / suspended
  },

  joined_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Rickshaw", rickshawSchema);