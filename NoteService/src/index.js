const express = require("express");
const router = require("./noteRoutes");
const app = express();
const port = 3002;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`NoteService listening on port ${port}`);
});
