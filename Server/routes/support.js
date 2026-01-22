const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");

router.post("/email", supportController.sendSupportEmail);

module.exports = router;