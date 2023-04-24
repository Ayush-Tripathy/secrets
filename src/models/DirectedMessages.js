const mongoose = require("mongoose");

const directedMessagesSchema = mongoose.Schema({
    id: { type: String, required: true },
    message: { type: String, required: true },
    date: {
        type: Date, index: { unique: true, expires: '1d' }, default: Date.now
    },
});

// directedMessagesSchema.path('TTLField').index({ expires: 86400 });

module.exports = mongoose.model("directedMessages", directedMessagesSchema);