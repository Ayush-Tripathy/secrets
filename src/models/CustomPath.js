const mongoose = require("mongoose");

const custompathSchema = new mongoose.Schema({
    path: { type: String, required: true },
    date: {
        type: Date, index: { unique: true, expires: '1d' }, default: Date.now
    },
});

custompathSchema.path('date').index({ expires: "1d" });

module.exports = mongoose.model("customPath", custompathSchema);