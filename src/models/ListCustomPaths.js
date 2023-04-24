const mongoose = require("mongoose");

const listCustomPathsSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    customLink: { type: String, required: true },
    TTLField: { type: Date },
});

listCustomPathsSchema.path('TTLField').index({ expires: 86400 });

module.exports = mongoose.model("listcustompaths", listCustomPathsSchema);