const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    text: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const FileSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    uploader: { type: Schema.Types.ObjectId, ref: "User", required: true },
    originalName: String,
    storedName: String, // multer’s generated filename
    size: Number,
    mime: String,
    isForAdmin: { type: Boolean, default: false },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
