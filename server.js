// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const notificationRoutes = require("./routes/notificationRoutes");
const {
  startQueueWorker,
} = require("./services/notificationService");
const Notification = require("./models/notificationModel");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Notification routes
app.use("/notifications", notificationRoutes);

// ✅ Queue route (returns pending notifications from MongoDB)
app.get("/queue", async (req, res) => {
  try {
    const pendingNotifications = await Notification.find({ status: "pending" });
    res.json({
      count: pendingNotifications.length,
      queue: pendingNotifications,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching queue", error: err.message });
  }
});

// Root route
app.get("/", (req, res) => res.send("✅ Notification Service Running..."));

// Start queue worker (process queue every 30 seconds)
startQueueWorker(30000);

// Use PORT from .env or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
