const mongoose = require("mongoose");

const custompathSchema = new mongoose.Schema({
    path: { type: String, required: true },
    TTLField: { type: Date },
});

custompathSchema.path('TTLField').index({ expires: 86400 });

module.exports = mongoose.model("customPath", custompathSchema);