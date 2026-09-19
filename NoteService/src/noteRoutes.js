const express = require("express");
const { createNote } = require("./noteControllers");
const router = express.Router();

router.post("/create", createNote);

module.exports = router;
