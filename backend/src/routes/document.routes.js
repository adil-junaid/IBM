const express = require("express");
const router = express.Router();

const {
  listDocuments,
  removeDocument,
} = require("../controllers/document.controller");

router.get("/", listDocuments);

router.delete("/:name", removeDocument);

module.exports = router;