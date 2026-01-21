const Subscription = require("../Models/Subscription");
const Flashcard = require("../Models/FlashCard");
const Todo = require("../Models/Todo");
const webpush = require("web-push");

// ✅ Set VAPID once
webpush.setVapidDetails(
  "mailto:admin@yourapp.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// ========================
// Subscribe a device
// ========================
exports.subscribe = async (req, res) => {
  try {
    const { subscription, userId } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: "Invalid subscription" });
    }

    // Atomic upsert: create if it doesn't exist, else do nothing
    const result = await Subscription.updateOne(
      { endpoint: subscription.endpoint }, // query by endpoint
      {
        $setOnInsert: {
          userId,
          keys: subscription.keys,
        },
      },
      { upsert: true } // important
    );

    if (result.upsertedCount > 0) {
      // Document was created
      return res.status(201).json({ message: "Subscribed successfully" });
    } else {
      // Already existed
      return res.json({ message: "Already subscribed" });
    }

  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
};


// ========================
// Unsubscribe a device
// ========================
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

// ========================
// Send daily reminders
// ========================
exports.sendDailyReminder = async () => {
  try {
    const now = new Date();
    const startWindow = new Date();
    startWindow.setHours(8, 0, 0, 0); // 8 AM
    const endWindow = new Date();
    endWindow.setHours(20, 0, 0, 0); // 8 PM

    if (now < startWindow || now > endWindow) return;

    const dueFlashcards = await Flashcard.countDocuments({
      dueDate: { $lte: now },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const pendingTodos = await Todo.countDocuments({
      isComplete: false,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (dueFlashcards === 0 && pendingTodos === 0) return;

    const payload = JSON.stringify({
      title: "Study Reminder 📚",
      body: `You have ${dueFlashcards} flashcards and ${pendingTodos} todos today.`,
    });

    // Fetch all subscriptions
    const subscriptions = await Subscription.find();

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
      } catch (err) {
        console.error(
          `Failed to send notification to endpoint ${sub.subscription.endpoint}:`,
          err
        );
        // Remove invalid subscription
        await Subscription.deleteOne({ _id: sub._id });
      }
    }

    console.log("Daily reminder sent to all subscribers.");
  } catch (err) {
    console.error("Push error:", err);
  }
};

// ========================
// Optional: Send custom notification
// ========================
exports.sendNotificationToUser = async (userId, title, body) => {
  try {
    const payload = JSON.stringify({ title, body });
    const subscriptions = await Subscription.find({ userId });

    for (const sub of subscriptions) {
      try {
        const pushSub = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys.p256dh,
            auth: sub.keys.auth,
          },
        };

        await webpush.sendNotification(pushSub, payload);
      } catch (err) {
        console.error(
          `Failed to send notification to endpoint ${sub.endpoint}:`,
          err
        );
        // optionally remove invalid subscription
        await Subscription.deleteOne({ _id: sub._id });
      }
    }
  } catch (err) {
    console.error("Custom notification error:", err);
  }
};
