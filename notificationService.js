const Notification = require("../models/notificationModel");
const { sendEmail } = require("./emailService");

let queue = [];

function addToQueue(notification) {
  queue.push(notification);
}

function getQueueItems() {
  return queue;
}

function startQueueWorker(interval) {
  setInterval(async () => {
    if (queue.length === 0) return;

    const notification = queue.shift();

    try {
      if (Math.random() < 0.1) throw new Error("Random simulated failure");

      // ✅ Use "content" field here
      const success = await sendEmail(
        notification.recipient,
        notification.subject,
        notification.message
      );

      if (success) {
        await Notification.findByIdAndUpdate(notification._id, {
          status: "sent",
        });
        console.log(`📩 Notification ${notification._id} sent`);
      } else {
        await Notification.findByIdAndUpdate(notification._id, {
          status: "failed",
        });
        console.log(`⚠️ Notification ${notification._id} failed`);
      }
    } catch (err) {
      await Notification.findByIdAndUpdate(notification._id, {
        status: "failed",
      });
      console.error(`❌ Notification ${notification._id} error: ${err.message}`);
    }
  }, interval);
}

module.exports = { addToQueue, getQueueItems, startQueueWorker };
