const Subscription = require("../Models/Subscription");
const Flashcard = require("../Models/FlashCard");
const Todo = require("../Models/Todo");
const webpush = require("web-push");

// exports.sendDailyReminder = async () => {
//   try {
//     const now = new Date();
//     const startWindow = new Date();
//     startWindow.setHours(8, 0, 0, 0); // 8 AM
//     const endWindow = new Date();
//     endWindow.setHours(20, 0, 0, 0); // 8 PM

//     if (now < startWindow || now > endWindow) return;

//     const dueFlashcards = await Flashcard.countDocuments({
//       dueDate: { $lte: now },
//     });

//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);
//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     const pendingTodos = await Todo.countDocuments({
//       isComplete: false,
//       date: { $gte: todayStart, $lte: todayEnd },
//     });

//     if (dueFlashcards === 0 && pendingTodos === 0) return;

//     const payload = JSON.stringify({
//       title: "Study Reminder 📚",
//       body: `You have ${dueFlashcards} flashcards and ${pendingTodos} todos today.`,
//     });

//     // Fetch all subscriptions
//     const subscriptions = await Subscription.find();

//     for (const sub of subscriptions) {
//       try {
//         await webpush.sendNotification(
//           {
//             endpoint: sub.endpoint,
//             keys: {
//               p256dh: sub.keys.p256dh,
//               auth: sub.keys.auth
//             }
//           },
//           payload
//         );
//       } catch (err) {
//         console.error(
//           `Failed to send notification to endpoint ${sub.endpoint}:`,
//           err
//         );
//         // Remove invalid subscription
//         await Subscription.deleteOne({ _id: sub._id });
//       }
//     }

//     console.log("Daily reminder sent to all subscribers.");
//   } catch (err) {
//     console.error("Push error:", err);
//   }
// };
exports.sendDailyReminder = async () => {
  try {
    const now = new Date();

    // Remove the time window restriction
    // const startWindow = new Date();
    // startWindow.setHours(8, 0, 0, 0);
    // const endWindow = new Date();
    // endWindow.setHours(20, 0, 0, 0);
    // if (now < startWindow || now > endWindow) return;

    // Count due flashcards
    const dueFlashcards = await Flashcard.countDocuments({
      dueDate: { $lte: now },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Count pending todos
    const pendingTodos = await Todo.countDocuments({
      isComplete: false,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // Only skip if both are zero
    if (dueFlashcards === 0 && pendingTodos === 0) return;

    const payload = JSON.stringify({
      title: "Study Reminder 📚",
      body: `You have ${dueFlashcards} flashcards and ${pendingTodos} todos today.`,
    });

    const subscriptions = await Subscription.find();

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth,
            },
          },
          payload
        );
      } catch (err) {
        console.error(
          `Failed to send notification to endpoint ${sub.endpoint}:`,
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
