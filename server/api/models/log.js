const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: { type: String, required: true },
    subject: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now },
    content: { type: String, required: true }
});

module.exports = mongoose.model('Log', logSchema);