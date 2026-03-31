const express = require("express");
const cors = require("cors");

const connectDB = require("./db");
const Device = require("./models/Device");
const Log = require("./models/Log");
const Rickshaw = require("./models/Rickshaw");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// POST DEVICE LOG
app.post("/device/log", async (req, res) => {
  try {
    const body = req.body || {};

    const device_id = body.device_id;
    const location = body.location;
    const timestamp = body.timestamp;

    if (!device_id) {
      return res.status(400).json({ error: "device_id required" });
    }

    // Parse location
    let lat = null;
    let lng = null;

    if (location && location.includes(",")) {
      const parts = location.split(",");
      lat = parseFloat(parts[0]);
      lng = parseFloat(parts[1]);
    }

    const status = body.status?.trim() || "active";
    const utcDate = timestamp ? new Date(timestamp) : new Date();
    const rickshaw = await Rickshaw.findOne({ device_id });
    const vehicle_number = rickshaw ? rickshaw.vehicle_number : null;

    // SAVE LOG
    await Log.create({
      device_id,
      lat,
      lng,
      status,
      timestamp: utcDate
    });

    // UPDATE DEVICE
    await Device.findOneAndUpdate(
      { device_id },
      {
        device_id,
        vehicle_number,
        lat,
        lng,
        status,
        lastSeen: new Date(),
        lastLogTime: utcDate
      },
      { upsert: true }
    );

    console.log("Log saved:", device_id);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/rickshaw", async (req, res) => {
  try {
    const data = req.body;

    const rickshaw = await Rickshaw.create(data);

    res.json(rickshaw);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create rickshaw" });
  }
});

// GET DEVICES
app.get("/devices", async (req, res) => {
  const devices = await Device.find();

  const now = new Date();

  const result = devices.map(d => {
    const diff = (now - d.lastSeen) / 1000;

    return {
      device_id: d.device_id,
      lat: d.lat,
      lng: d.lng,
      status: diff > 600 ? "offline" : "active",
      lastSeen: d.lastSeen,
      lastLogTime: d.lastLogTime
    };
  });

  res.json(result);
});

// GET LOGS
app.get("/logs", async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});