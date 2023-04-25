const mongoose = require("mongoose");

const listCustomPathsSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    customLink: { type: String, required: true },
    date: {
        type: Date, index: { unique: true, expires: '1d' }, default: Date.now
    },
});

listCustomPathsSchema.path('date').index({ expires: "1d" });

module.exports = mongoose.model("listcustompaths", listCustomPathsSchema);