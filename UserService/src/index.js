const express = require("express");
const cors = require("cors");
const router = require("./userRoutes");
const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
app.use("/user", router);

app.listen(port, () => {
  console.log(`UserService listening on port ${port}`);
});
