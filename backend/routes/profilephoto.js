// Update your profilephoto.js file with this corrected version

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user.models");
const router = express.Router();
const { verifyToken } = require("../middleware/middleware");

// Create profilepics directory if it doesn't exist
const uploadDir = path.join(__dirname, "../profilepics");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profilepics");
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const allowedTypes = {
  jpeg: "image/jpeg", 
  jpg: "image/jpeg", 
  png: "image/png"
}; 

// Multer configuration
const upload = multer({
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Check if file type is allowed
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file format. Only JPEG, JPG, and PNG files are allowed."));
    }

    // Additional check for file format from body if provided
    const fileFormat = req.body.fileFormat;
    if (fileFormat && allowedTypes[fileFormat] && file.mimetype !== allowedTypes[fileFormat]) {
      return cb(new Error(`File type mismatch! Expected ${fileFormat.toUpperCase()} but received ${file.mimetype}`));
    }

    cb(null, true);
  }
});

// Upload or update profile photo
router.post("/uploadpic", verifyToken, (req, res) => {
  upload.single("profilep")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({message: "File size exceeded (max 5MB)"});
        }
        return res.status(400).json({message: err.message});
      }

      if (err) {
        return res.status(400).json({message: err.message});
      }

      if (!req.file) {
        return res.status(400).json({message: "No file uploaded or invalid format"});
      }

      const userId = req.user.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({message: "User not found"});
      }

      const newFilePath = `profilepics/${req.file.filename}`;

      // Delete old profile photo if exists
      if (user.profilephoto) {
        const oldFilePath = path.join(__dirname, "../", user.profilephoto);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (deleteError) {
            console.log("Could not delete old photo:", deleteError.message);
          }
        }
      }

      // Save new photo path
      user.profilephoto = newFilePath;
      await user.save();

      res.status(200).json({
        message: "Profile photo uploaded successfully",
        filePath: newFilePath
      });

    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        message: "Error uploading photo",
        details: error.message
      });
    }
  });
});

// Download profile photo
router.get("/download", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user || !user.profilephoto) {
      return res.status(404).json({message: "Profile photo not found"});
    }

    const filePath = path.join(__dirname, "../", user.profilephoto);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({message: "Profile image file not found"});
    }

    // Set appropriate headers
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
    
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({
      message: "Error retrieving profile photo", 
      details: err.message
    });
  }
});

// Download specific user's profile photo (for admin)
router.get("/download/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user || !user.profilephoto) {
      return res.status(404).json({message: "Profile photo not found"});
    }

    const filePath = path.join(__dirname, "../", user.profilephoto);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({message: "Profile image file not found"});
    }

    // Set appropriate headers
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
    
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({
      message: "Error retrieving profile photo", 
      details: err.message
    });
  }
});

module.exports = router;
