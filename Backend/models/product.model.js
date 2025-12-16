const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
    size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    }
});

const variantSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true
    },
    image: {
        type: String, // صورة اللون
        required: false
    },
    sizes: [sizeSchema] // كل لون يحتوي مقاسات + مخزون كل مقاس
});

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, unique: true },

        description: String,

        price: {
            type: Number,
            required: true,
            min: 0
        },

        variants: [variantSchema], // أهم جزء

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        soldNo: { type: Number, default: 0 },
        madeIn: String,
        material: String,
        style: String,

        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
