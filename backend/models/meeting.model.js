const mongoose = require("mongoose");
const { Schema } = mongoose;

const MeetingSchema = new Schema(
  {
    title: { type: String, required: true },
    agenda: String,
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    project: { type: Schema.Types.ObjectId, ref: "Project" }, // optional
    startTime: { type: Date, required: true },
    endTime: Date,
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed"],
      default: "scheduled",
    },
    joinLink: String, // e.g. generated Jitsi / Zoom URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
