const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: Number, required: true }, 
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "released"], default: "pending" },
  releaseDate: Date,
}, { timestamps: true });

PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true }); 

module.exports = mongoose.model("Payroll", PayrollSchema);
