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
var User = require("./userStore");

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

const signupLogic = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide username and password." });
    }

    const userExisted = await User.findOne({ username: username });
    if (userExisted) {
      return res.status(409).json({ msg: "User already existed" });
    }

    const newUser = new User({
      username: username,
      password: password,
    });
    const savedUser = await newUser
      .save()
      .catch((err) => console.log("Error while inserting user:", err.message));

    res.status(200).json({ msg: "User created successfully", savedUser });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const loginLogic = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide username and password." });
    }

    const data = await User.findOne({
      username: username,
      password: password,
    });
    if (!data) return res.status(400).json({ msg: "Login failed." });

    const token = jwt.sign(
      { userId: data._id, username: data.username },
      process.env.JWT_SECRET || "noSecret",
      {
        expiresIn: 300, // or "5m"; note: this will pass "exp" key in payload for checking if the token expired
      },
    );

    res.status(200).json({ msg: "logged in", token });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const data = await User.find({});

    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

module.exports = { signupLogic, loginLogic, getAllUsers };
