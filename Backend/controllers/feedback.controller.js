const Feedback = require("../models/feedback.model");

const mongoose = require("mongoose");


exports.createFeedback = async (req, res) => {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted and waiting approval" });
};


// PUT /api/feedback/approve/:id
exports.updatefeedback = async (req, res) => {
    const updated = await Feedback.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
    );
    res.json(updated);
};


// GET /api/feedback/approved
exports.getfeedback = async (req, res) => {
    try {
        const approvedFeedback = await Feedback.find({ status: "approved" });
        res.json(approvedFeedback);
    } catch (error) {
        res.status(500).json({ message: "Error fetching approved feedback", error });
    }
};

exports.getallfeedback = async (req, res) => {
    try {
        const approvedFeedback = await Feedback.find({});
        res.json(approvedFeedback);
    } catch (error) {
        res.status(500).json({ message: "Error fetching approved feedback", error });
    }
};

