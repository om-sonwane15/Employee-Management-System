const router = require("express").Router();
const Meeting = require("../models/meeting.model");
const User    = require("../models/user.models");
const { verifyToken, isAdmin } = require("../middleware/middleware");

// helper – return list filtered for employee vs admin
const fetchVisible = async (req) => {
  if (req.user.role === "admin")
    return Meeting.find()
      .populate("organizer", "name")
      .populate("participants", "name email")
      .sort({ startTime: -1 });
  return Meeting.find({
    participants: req.user.id, // invited
  })
    .populate("organizer", "name")
    .populate("participants", "name email")
    .sort({ startTime: -1 });
};

// GET all visible meetings
router.get("/", verifyToken, async (req, res) => {
  res.json(await fetchVisible(req));
});

// CREATE meeting (admin OR any logged-in user)
router.post("/", verifyToken, async (req, res) => {
  const { title, agenda, startTime, endTime, participants, project } = req.body;
  const list = [...new Set([req.user.id, ...(participants || [])])]; // ensure organiser in list
  const joinLink = `https://meet.jit.si/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}`;

  const meeting = await Meeting.create({
    title,
    agenda,
    startTime,
    endTime,
    participants: list,
    organizer: req.user.id,
    project: project || null,
    joinLink,
  });
  res.status(201).json(meeting);
});

// UPDATE meeting (only organiser or admin)
router.put("/:id", verifyToken, async (req, res) => {
  const m = await Meeting.findById(req.params.id);
  if (!m) return res.status(404).json({ message: "Not found" });
  if (req.user.role !== "admin" && !m.organizer.equals(req.user.id))
    return res.status(403).json({ message: "No permission" });

  const fields = ["title", "agenda", "startTime", "endTime", "status", "project"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) m[f] = req.body[f];
  });
  await m.save();
  res.json(m);
});

// ADD participant
router.post("/:id/participants", verifyToken, async (req, res) => {
  const m = await Meeting.findById(req.params.id);
  if (!m) return res.status(404).json({ message: "Not found" });
  if (req.user.role !== "admin" && !m.organizer.equals(req.user.id))
    return res.status(403).json({ message: "No permission" });

  const { userId } = req.body;
  if (!m.participants.includes(userId)) m.participants.push(userId);
  await m.save();
  res.json(m);
});

// REMOVE participant
router.delete("/:id/participants/:userId", verifyToken, async (req, res) => {
  const m = await Meeting.findById(req.params.id);
  if (!m) return res.status(404).json({ message: "Not found" });
  if (req.user.role !== "admin" && !m.organizer.equals(req.user.id))
    return res.status(403).json({ message: "No permission" });

  m.participants = m.participants.filter(
    (u) => u.toString() !== req.params.userId
  );
  await m.save();
  res.json(m);
});

module.exports = router;
