const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }, // date only
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ["present", "absent", "halfday", "holiday"], default: "present" }
}, { timestamps: true });

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
