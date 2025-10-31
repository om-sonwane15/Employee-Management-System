const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("../models/file.model");
const Project = require("../models/project.model");
const { verifyToken, isAdmin } = require("../middleware/middleware");

// ───── storage ─────
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) =>
    cb(null, Date.now() + "-" + Math.random().toString(36).slice(2) + path.extname(file.originalname)),
});

const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } }); // 15 MB

// helper: ensure requester is in project
async function ensureMember(req, res, next) {
  const proj = await Project.findById(req.body.project || req.params.projectId);
  if (!proj)
    return res.status(404).json({ message: "Project not found" });

  const isMember =
    req.user.role === "admin" ||
    proj.employees.some((e) => e.equals(req.user.id));
  if (!isMember)
    return res.status(403).json({ message: "Not part of this project" });

  req.project = proj;
  next();
}

// ─────────────────── employee / in-charge ───────────────────

// upload a file
router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  ensureMember,
  async (req, res) => {
    const { isForAdmin = false } = req.body;
    const doc = await File.create({
      project: req.project._id,
      uploader: req.user.id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mime: req.file.mimetype,
      size: req.file.size,
      isForAdmin,
    });
    res.status(201).json(doc);
  }
);

// list files for a project (members only)
router.get("/project/:projectId", verifyToken, ensureMember, async (req, res) => {
  const list = await File.find({ project: req.project._id }).populate(
    "uploader",
    "name"
  );
  res.json(list);
});

// ─────────────────── admin area ───────────────────

// list files flagged for admin
router.get("/admin", verifyToken, isAdmin, async (_, res) => {
  res.json(await File.find({ isForAdmin: true }).populate("project", "name"));
});

// add a comment (admin only)
router.post("/:id/comment", verifyToken, isAdmin, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "Empty comment" });
  const f = await File.findById(req.params.id);
  if (!f) return res.status(404).json({ message: "Not found" });

  f.comments.push({ user: req.user.id, text });
  await f.save();
  res.json(f);
});

// ─────────────────── download (all authorised) ───────────────────
router.get("/:id/download", verifyToken, async (req, res) => {
  const f = await File.findById(req.params.id).populate("project");
  if (!f) return res.status(404).json({ message: "Not found" });

  // access check
  if (
    req.user.role !== "admin" &&
    !f.project.employees.some((e) => e.equals(req.user.id))
  )
    return res.status(403).json({ message: "No permission" });

  res.download(path.join(UPLOAD_DIR, f.storedName), f.originalName);
});

module.exports = router;
