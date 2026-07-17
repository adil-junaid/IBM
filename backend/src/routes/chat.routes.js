const express = require("express");
const router = express.Router();

const { chatWithDocument } = require("../controllers/chat.controller");

router.post("/", chatWithDocument);

module.exports = router;