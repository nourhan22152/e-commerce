const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
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


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        default: null
    },
    phone: {
        type: String,
        match: [/^[0-9]{11}$/, "Invalid phone number"]
    },
    addresses: [addressSchema],
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

},
    { timestamps: true }
);


// // 🔒 Hash password before save
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});


// 🔐 Compare password method
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
