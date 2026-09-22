const express = require("express");
const { loginPage, notePage } = require("./appController");

const router = express.Router();

router.get("/", notePage);
router.get("/login", loginPage);

module.exports = router;
