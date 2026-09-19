var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var noteStoreSchema = new Schema({
  userId: Object,
  title: String,
  content: String,
  createdAt: String,
  lastModified: String,
});

module.exports = mongoose.model("noteStore", noteStoreSchema);
