const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager", "employee"], default: "employee" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    profilephoto: { type: String },
    phone: { type: String },
    address: { type: String },
    joiningDate: { type: Date, default: Date.now },
    position: { type: String },
    salary: { type: Number },
    status: { type: String, enum: ["active", "inactive", "on_leave"], default: "active" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    skills: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);