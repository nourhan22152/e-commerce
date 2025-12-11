const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    image: String,
    description: String,
    isDeleted:{type:Boolean , default: false},
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
