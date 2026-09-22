const express = require("express");
const { loginPage } = require("./appController");

const router = express.Router();

router.get("/login", loginPage);

module.exports = router;
