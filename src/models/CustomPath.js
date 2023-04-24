const mongoose = require("mongoose");

const custompathSchema = new mongoose.Schema({
    path: { type: String, required: true },
    date: {
        type: Date, index: { unique: true, expires: '1d' }, default: Date.now
    },
});

// custompathSchema.path('TTLField').index({ expires: 86400 });

module.exports = mongoose.model("customPath", custompathSchema);