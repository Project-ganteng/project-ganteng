const express = require("express");
const router = express.Router();
const { summarizeChat } = require("../controllers/aiController");

router.post("/summary", summarizeChat);
module.exports = router;
