const express = require("express");
const router = express.Router();

const { listDocuments } = require("../controllers/document.controller");

router.get("/", listDocuments);

module.exports = router;