var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userStoreSchema = new Schema({
  username: String,
  password: String,
});

module.exports = mongoose.model("userStore", userStoreSchema);
