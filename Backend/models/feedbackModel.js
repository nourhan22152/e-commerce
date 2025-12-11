const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    message: { type: String, required: true },
    userName: { type: String },
    status: { type: String, default: "pending" }, // pending | approved | rejected
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
