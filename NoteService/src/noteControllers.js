// database
var mongoose = require("mongoose");
var dbServer = "127.0.0.1:27017";
const dbPort = "27017";
const dbName = "myNoteDb";
var Note = require("./noteStore");

if (!process.env.DATABASE_HOST) {
  console.log("WARNING: the environment variable DATABASE_HOST is not set");
} else {
  dbServer = process.env.DATABASE_HOST + ":" + dbPort;
}

let connection = `mongodb://${dbServer}/${dbName}`;

mongoose
  .connect(connection)
  .then(() => console.log("Connected to database", dbName))
  .catch((err) => {
    console.error("Database connection error", dbName);
    console.error(" trying to connect to server:", connection);
  });

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const currentTime = new Date().toISOString();

    const newNote = new Note({
      title: title.trim() == "" ? "Untitled" : title,
      content: content ?? "",
      userId: res.locals.userId,
      createdAt: currentTime,
      lastModified: currentTime,
    });
    const savedNote = await newNote.save().catch((err) => {
      return res
        .status(400)
        .json({ msg: `Error while creating note: ${err.message}` });
    });

    res
      .status(200)
      .json({ msg: "Note created successfully.", data: savedNote });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const readNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const data = await Note.findOne({ _id: noteId, userId: res.locals.userId });

    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const readListNote = async (req, res) => {
  try {
    const data = await Note.find(
      { userId: res.locals.userId },
      { title: 1, content: 1, createdAt: 1, lastModified: 1 },
    );

    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { title, content } = req.body;

    const currentTime = new Date().toISOString();

    const updatedNote = await Note.updateOne(
      { _id: noteId, userId: res.locals.userId },
      {
        title: title.trim() == "" ? "Untitled" : title,
        content: content ?? "",
        lastModified: currentTime,
      },
      { new: true },
    );

    if (!updatedNote) {
      return res.status(400).json({ msg: `Update note failed.` });
    }

    res
      .status(200)
      .json({ msg: "Note updated successfully.", data: updatedNote });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const deletedNote = await Note.deleteOne({
      _id: noteId,
      userId: res.locals.userId,
    });

    res
      .status(200)
      .json({ msg: "Note deleted successfully.", data: deletedNote });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

module.exports = { createNote, readNote, readListNote, updateNote, deleteNote };
