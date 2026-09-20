const express = require("express");
const {
  createNote,
  readNote,
  readListNote,
  updateNote,
  deleteNote,
} = require("./noteControllers");
const router = express.Router();

router.post("/create", createNote);
router.get("/read/:noteId", readNote);
router.get("/readList", readListNote);
router.put("/update/:noteId", updateNote);
router.delete("/delete/:noteId", deleteNote);

module.exports = router;
