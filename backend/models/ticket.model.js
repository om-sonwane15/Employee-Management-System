const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const TicketSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ticket", TicketSchema);
