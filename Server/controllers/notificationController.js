const Subscription = require("../Models/Subscription");
const Flashcard = require("../Models/FlashCard");
const Todo = require("../Models/Todo");
const webpush = require("web-push");

exports.sendDailyReminder = async () => {
  try {
    const now = new Date();
    const startWindow = new Date();
    startWindow.setHours(8, 0, 0, 0); // 8:00 AM
    const endWindow = new Date();
    endWindow.setHours(20, 0, 0, 0); // 8:00 PM

    // Only send if current time is inside the window
    if (now < startWindow || now > endWindow) return;

    // Count due flashcards
    const dueFlashcards = await Flashcard.countDocuments({
      dueDate: { $lte: now },
    });

    // Count pending todos for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const pendingTodos = await Todo.countDocuments({
      isComplete: false,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // Nothing to notify
    if (dueFlashcards === 0 && pendingTodos === 0) return;

    const payload = JSON.stringify({
      title: "Study Reminder 📚",
      body: `You have ${dueFlashcards} flashcards and ${pendingTodos} todos today.`,
    });

    // Fetch all subscriptions from DB
    const subscriptions = await Subscription.find();

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
      } catch (err) {
        console.error("Failed to send notification, removing subscription:", err);
        // Remove invalid subscription from DB
        await Subscription.deleteOne({ _id: sub._id });
      }
    }

    console.log("Daily reminder sent to all subscribers.");
  } catch (err) {
    console.error("Push error:", err);
  }
};
