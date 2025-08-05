const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ["present", "absent", "late", "half_day"], required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);