// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/pushController");

// Subscribe a device
router.post("/subscribe", subscriptionController.subscribe);

// Unsubscribe a device
router.post("/unsubscribe", subscriptionController.unsubscribe);

// Send daily reminder manually (optional/testing)
router.post("/send-daily-reminder", async (req, res) => {
  await subscriptionController.sendDailyReminder();
  res.json({ message: "Daily reminder triggered." });
});

// Send custom notification to a specific user
router.post("/send-notification", async (req, res) => {
  const { userId, title, body } = req.body;
  if (!userId || !title || !body) {
    return res.status(400).json({ error: "Missing userId, title, or body" });
  }

  await subscriptionController.sendNotificationToUser(userId, title, body);
  res.json({ message: "Notification sent." });
});

module.exports = router;
