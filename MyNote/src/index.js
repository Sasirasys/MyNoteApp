const express = require("express");
const router = require("./appRoutes");
var path = require("path");
const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(router);

app.listen(port, () => {
  console.log(`MyNote listening on port ${port}`);
});
