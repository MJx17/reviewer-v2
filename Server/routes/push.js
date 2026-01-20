const express = require("express");
const router = express.Router();
const pushController = require("../controllers/pushController");

// Save subscription
router.post("/subscribe", pushController.subscribe);

// Remove subscription
router.post("/unsubscribe", pushController.unsubscribe);

module.exports = router;
