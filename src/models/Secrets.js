const mongoose = require("mongoose");

const secretSchema = new mongoose.Schema({
    dedicated: { type: Boolean, required: true },
    dedicatedTo: { type: String },
    body: { type: String, required: true }
});

module.exports = mongoose.model("secrets", secretSchema);