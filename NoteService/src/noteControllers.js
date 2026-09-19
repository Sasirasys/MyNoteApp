// jwt
const jwt = require("jsonwebtoken");
require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.log("WARNING: no JWT_SECRET");
}

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
  res.status(200).json({ msg: "create note!" });
};

module.exports = { createNote };
