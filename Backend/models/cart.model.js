const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: String,    //snapshot
    price: Number,
    image: String,
    color: String,
    size: String,
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    totalPrice: Number,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date

});

const cartSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            default: null
        },

        items: {
            type: [cartItemSchema],
            default: []
        },


        totalItems: {
            type: Number,
            default: 0,
        },

        totalPrice: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }

);

cartSchema.pre("save", function () {
    this.totalItems = this.items
        .filter(item => item.isDeleted === false)
        .reduce((acc, item) => acc + (item.quantity || 0), 0);

    this.totalPrice = this.items
        .filter(item => item.isDeleted === false)
        .reduce((acc, item) => acc + (item.totalPrice || 0), 0);
});






module.exports = mongoose.model("Cart", cartSchema);