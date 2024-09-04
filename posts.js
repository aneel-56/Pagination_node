const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  posts: {
    type: String,
    required,
  },
});

module.exports("Posts", postSchema);
