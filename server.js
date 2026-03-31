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


// 🔥 DEVICE LOG API
app.post("/device/log", async (req, res) => {
  try {
    const body = req.body || {};

    const device_id = body.device_id;
    const location = body.location;
    const event = body.event || "heartbeat";

    if (!device_id) {
      return res.status(400).json({ error: "device_id required" });
    }

    // 📍 Parse location
    let lat = null;
    let lng = null;

    if (location && location.includes(",")) {
      const parts = location.split(",");
      lat = parseFloat(parts[0]);
      lng = parseFloat(parts[1]);
    }

    const timestamp = body.timestamp ? new Date(body.timestamp) : new Date();

    // 🔥 SAVE LOG
    await Log.create({
      device_id,
      lat,
      lng,
      battery: parseInt(body.battery),
      charging: body.charging,
      network: body.network,
      status: body.status,
      event,
      app: body.app,
      timestamp
    });

    // 🔗 FIND RICKSHAW LINK
    const rickshaw = await Rickshaw.findOne({ device_id });
    const vehicle_number = rickshaw ? rickshaw.vehicle_number : null;

    // 🔥 DEVICE UPDATE
    let updateData = {
      device_id,
      vehicle_number,
      lat,
      lng,
      battery: parseInt(body.battery),
      charging: body.charging,
      network: body.network,
      lastSeen: new Date(),
      lastLogTime: timestamp
    };

    if (event === "reboot") {
      updateData.lastRebootTime = timestamp;
    }

    if (event === "app_open") {
      updateData.lastAppOpenTime = timestamp;
    }

    await Device.findOneAndUpdate(
      { device_id },
      updateData,
      { upsert: true }
    );

    console.log("📡 Log:", device_id, event);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔥 GET DEVICES
app.get("/devices", async (req, res) => {
  const devices = await Device.find();

  const now = new Date();

  const result = devices.map(d => {
    const diff = (now - d.lastSeen) / 1000;

    return {
      device_id: d.device_id,
      vehicle_number: d.vehicle_number,
      lat: d.lat,
      lng: d.lng,
      status: diff > 600 ? "offline" : "active",
      lastSeen: d.lastSeen
    };
  });

  res.json(result);
});


// 🔥 GET LOGS
app.get("/logs", async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});


// 🔥 CREATE RICKSHAW
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});