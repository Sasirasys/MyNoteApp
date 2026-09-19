const express = require("express");
const { signupLogic, loginLogic, getAllUsers } = require("./userControllers");
const router = express.Router();

router.post("/signup", signupLogic);
router.post("/login", loginLogic);
router.get("/get-all-users", getAllUsers); // for debugging purpose

module.exports = router;
