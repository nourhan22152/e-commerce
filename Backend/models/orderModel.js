const mongoose = require("mongoose");


// =====================================================
// 📌 Order Item Snapshot
// =====================================================
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },

    // snapshot from product at checkout time
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    color: String,
    size: String,

    quantity: {
        type: Number,
        default: 1,
        min: 1
    },

    totalPrice: { type: Number, required: true }
}, { _id: false });


// =====================================================
// 📌 Shipping Address Snapshot
// =====================================================

const shippingAddressSchema = new mongoose.Schema({
    label: { type: String, enum: ["home", "work", "other"], default: "other" },
    country: { type: String, default: "Egypt" },
    city: String,
    street: String,
    building: String,
    floor: String,
    apartment: String,
    phone: String,
    notes: String,
}, { _id: false });


// =====================================================
// 📌 Order Schema
// =====================================================
const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        //  Guest Info
        guestInfo: {
            name: String,
            email: String,
            phone: String,
        },

        items: {
            type: [orderItemSchema],
            required: true
        },

        shippingAddress: {
            type: shippingAddressSchema,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending"
        },

        totalItems: { type: Number, required: true },
        totalPrice: { type: Number, required: true },

        deliveredAt: Date,
        cancelledAt: Date
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
