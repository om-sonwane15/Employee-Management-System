const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendance.model");
const { verifyToken, isAdmin } = require("../middleware/middleware");

// Employee clock-in
router.post("/checkin", verifyToken, async (req, res) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  try {
    let record = await Attendance.findOne({ employee: req.user.id, date: today });
    if (record && record.checkIn) return res.status(400).json({ message: "Already checked in today."});
    record = record || new Attendance({ employee: req.user.id, date: today });
    record.checkIn = new Date();
    await record.save();
    res.json({ message: "Checked in!", attendance: record });
  } catch (e) {
    res.status(500).json({ message: "Error checking in.", details: e.message });
  }
});

// Employee clock-out
router.post("/checkout", verifyToken, async (req, res) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  try {
    let record = await Attendance.findOne({ employee: req.user.id, date: today });
    if (!record || !record.checkIn) return res.status(400).json({ message: "Check in first."});
    if (record.checkOut) return res.status(400).json({ message: "Already checked out today."});
    record.checkOut = new Date();
    await record.save();
    res.json({ message: "Checked out!", attendance: record });
  } catch (e) {
    res.status(500).json({ message: "Error checking out.", details: e.message });
  }
});

// Employee: My attendance records
router.get("/my", verifyToken, async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.user.id }).sort({date: -1});
    res.json({ attendance: records });
  } catch (e) {
    res.status(500).json({ message: "Error loading attendance", details: e.message });
  }
});

// Admin: all attendance, filter/search
router.get("/", verifyToken, isAdmin, async (req, res) => {
  const { employeeId, date } = req.query;
  let q = {};
  if (employeeId) q.employee = employeeId;
  if (date) {
    const d = new Date(date); d.setHours(0,0,0,0);
    q.date = d;
  }
  try {
    const records = await Attendance.find(q).populate("employee").sort({date: -1});
    res.json({ attendance: records });
  } catch (e) {
    res.status(500).json({ message: "Error loading records", details: e.message });
  }
});

// Admin: update attendance (edit)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Updated", attendance: record });
  } catch (e) {
    res.status(500).json({ message: "Update failed", details: e.message });
  }
});

module.exports = router;
