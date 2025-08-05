const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String },
    goals: [{ type: String }],
    strengths: [{ type: String }],
    areasForImprovement: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Performance", performanceSchema);