// jwt
const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkJwtToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No authorization token." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const { userId, username, exp } = jwt.verify(
      token,
      process.env.JWT_SECRET || "noSecret",
    );

    // pass decoded token data
    res.locals.userId = userId;
    res.locals.username = username;
  } catch (e) {
    return res.status(401).json({ msg: "Authentication failed.", err: e });
  }

  next();
};

module.exports = checkJwtToken;
