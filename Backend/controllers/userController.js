const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");

// ❗ bcrypt اتشال لأنه مش مستخدم هنا (ال hashing بيتم داخل ال User Model)


// ---------------------------------------
// ✔ REGISTER USER + CREATE USER CART
// ---------------------------------------
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // ✔ Check duplicate email
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // ✔ Create new user
        const user = await User.create({ name, email, password, phone });

        // ✔ Create empty cart for this user
        const cart = await Cart.create({
            userId: user._id,
            items: []
        });

        // ✔ Link cartId to user
        user.cartId = cart._id;
        await user.save();

        // ✔ Create JWT using .env values
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
        

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                cartId: user.cartId,
                addresses: [],
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ---------------------------------------
// ✔ LOGIN + MERGE GUEST CART INTO USER CART
// ---------------------------------------
exports.login = async (req, res) => {
    try {
        const { email, password, guestCartId } = req.body;

        // ✔ Find user & include password
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✔ Compare password
        const valid = await user.comparePassword(password);
        if (!valid) return res.status(400).json({ message: "Wrong password" });

        // ✔ Load user's real cart
        let userCart = await Cart.findById(user.cartId);

        // ❗ إذا مفيش cartId → نعمل Cart جديدة
        if (!userCart) {
            userCart = await Cart.create({
                userId: user._id,
                items: []
            });
            user.cartId = userCart._id;
            await user.save();
        }

        // ✔ Load guest cart if sent
        let guestCart = guestCartId ? await Cart.findById(guestCartId) : null;

        // ❗ لو guestCartId نفس cartId → ممنوع الدمج
        if (guestCartId && guestCartId === user.cartId.toString()) {
            guestCart = null;
        }

        // ---------------------------------------
        // ✔ MERGE CARTS
        // ---------------------------------------
        if (guestCart && guestCart.items.length > 0) {

            guestCart.items.forEach((guestItem) => {

                const match = userCart.items.find(
                    (item) =>
                        item.productId.toString() === guestItem.productId.toString() &&
                        item.color === guestItem.color &&
                        item.size === guestItem.size &&
                        item.isDeleted === false
                );

                if (match) {
                    // ✔ Add quantities together
                    match.quantity += guestItem.quantity;
                    match.totalPrice = match.quantity * match.price;
                } else {
                    // ✔ Push clean copy (بدون _id)
                    userCart.items.push({
                        productId: guestItem.productId,
                        quantity: guestItem.quantity,
                        color: guestItem.color,
                        size: guestItem.size,
                        price: guestItem.price,
                        totalPrice: guestItem.totalPrice
                    });
                }
            });

            await userCart.save();
        }

        // ✔ Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                cartId: user.cartId,
                addresses: user.addresses,
                role: user.role
            },
            cart: userCart
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ---------------------------------------
// ✔ GET USER PROFILE
// ---------------------------------------
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ---------------------------------------
// ✔ UPDATE USER PROFILE (WITHOUT PASSWORD)
// ---------------------------------------
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;

        if (updates.password) delete updates.password; // ❗ منع تغيير الباسورد هنا

        const user = await User.findByIdAndUpdate(req.user, updates, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            message: "Profile updated",
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ---------------------------------------
// ✔ ADD ADDRESS
// ---------------------------------------
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        user.addresses.push(req.body);
        await user.save();

        res.status(200).json({
            message: "Address added",
            addresses: user.addresses
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ---------------------------------------
// ✔ UPDATE ADDRESS
// ---------------------------------------
exports.updateAddress = async (req, res) => {
    try {
        const { index } = req.params;
        const user = await User.findById(req.user);

        // ❗ لو index غلط
        if (index < 0 || index >= user.addresses.length) {
            return res.status(400).json({ message: "Invalid address index" });
        }

        user.addresses[index] = { ...user.addresses[index], ...req.body };
        await user.save();

        res.status(200).json({
            message: "Address updated",
            addresses: user.addresses
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ---------------------------------------
// ✔ DELETE ADDRESS
// ---------------------------------------
exports.deleteAddress = async (req, res) => {
    try {
        const { index } = req.params;
        const user = await User.findById(req.user);

        // ❗ حماية من index غلط
        if (index < 0 || index >= user.addresses.length) {
            return res.status(400).json({ message: "Invalid address index" });
        }

        user.addresses.splice(index, 1);
        await user.save();

        res.status(200).json({
            message: "Address deleted",
            addresses: user.addresses
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.makeAdmin = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ message: "User is now admin", user });
}
// ---------------------------------------
// ✔ GET ALL USERS (ADMIN ONLY)
// ---------------------------------------
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        const formatted = users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            cartId: user.cartId,
            addresses: user.addresses
        }));

        res.status(200).json({
            count: formatted.length,
            users: formatted
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
