const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },   // ✅ back to message
    channel: { type: String, default: "email" },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
