const webpush = require("web-push");
const Subscription = require("../Models/Subscription");

// Set VAPID details once
webpush.setVapidDetails(
  "mailto:admin@yourapp.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// =======================
// Subscribe endpoint
// =======================
exports.subscribe = async (req, res) => {
  try {
    const { subscription, userId } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription" });
    }

    const existing = await Subscription.findOne({
      "subscription.endpoint": subscription.endpoint,
    });
    if (existing) return res.json({ message: "Already subscribed" });

    await Subscription.create({
      userId: userId || null,
      subscription,
    });

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
};

// =======================
// Unsubscribe endpoint
// =======================
exports.unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) return res.status(400).json({ error: "Missing endpoint" });

    await Subscription.deleteOne({ "subscription.endpoint": endpoint });
    res.json({ message: "Unsubscribed successfully" });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
};

