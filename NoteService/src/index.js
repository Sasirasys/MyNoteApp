const express = require("express");
const router = require("./noteRoutes");
const checkJwtToken = require("./checkJwtToken");
const app = express();
const port = 3002;

app.use(express.json());
app.use(checkJwtToken); // application level middleware
app.use("/note", router);

app.listen(port, () => {
  console.log(`NoteService listening on port ${port}`);
});
