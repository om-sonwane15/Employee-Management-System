const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.model');
const { verifyToken, isAdmin } = require('../middleware/middleware');

// Employee: Create a new ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = new Ticket({
      employee: req.user.id,
      subject,
      messages: [{ sender: req.user.id, content: message }]
    });
    await ticket.save();
    res.json({ message: "Ticket submitted", ticket });
  } catch (e) {
    res.status(500).json({ message: "Could not submit ticket", details: e.message });
  }
});

// Employee: Get my tickets & conversation
router.get("/my", verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ employee: req.user.id }).sort({updatedAt: -1});
    res.json({ tickets });
  } catch (e) {
    res.status(500).json({ message: "Failed to load tickets", details: e.message });
  }
});

// Admin: Get all tickets
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("employee").sort({updatedAt: -1});
    res.json({ tickets });
  } catch (e) {
    res.status(500).json({ message: "Failed to load tickets", details: e.message });
  }
});

// Both: Send message in an existing ticket
router.post("/:id/message", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    ticket.messages.push({ sender: req.user.id, content });
    ticket.updatedAt = new Date();
    await ticket.save();
    res.json({ message: "Message sent", ticket });
    // Optionally emit websocket event here!
  } catch (e) {
    res.status(500).json({ message: "Couldn't send message", details: e.message });
  }
});

// Admin: Update ticket status
router.patch("/:id/status", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: "Status updated", ticket });
  } catch (e) {
    res.status(500).json({ message: "Update failed", details: e.message });
  }
});

module.exports = router;
