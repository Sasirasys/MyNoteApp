const express = require("express");
const router = require("./userRoutes");
const app = express();
const port = 3001;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`UserService listening on port ${port}`);
});
