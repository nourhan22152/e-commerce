const Customer = require("../models/customer.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const jwt = require("jsonwebtoken");

// ❗ bcrypt اتشال لأنه مش مستخدم هنا (ال hashing بيتم داخل ال Customer Model)


// ---------------------------------------
// ✔ REGISTER USER + CREATE USER CART
// ---------------------------------------
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // ✔ Check duplicate email
        const existing = await Customer.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // ✔ Create new customer
        const customer = await Customer.create({ name, email, password, phone });

        // ✔ Create empty cart for this customer
        const cart = await Cart.create({
            customerId: customer._id,
            items: []
        });

        // ✔ Link cartId to customer
        customer.cartId = cart._id;
        await customer.save();

        // ✔ Create JWT using .env values
        const token = jwt.sign(
            { id: customer._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
        

        res.status(201).json({
            message: "Customer registered successfully",
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                cartId: customer.cartId,
                addresses: [],
                role: customer.role
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

        // ✔ Find customer & include password
        const customer = await Customer.findOne({ email }).select("+password");
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        // ✔ Compare password
        const valid = await customer.comparePassword(password);
        if (!valid) return res.status(400).json({ message: "Wrong password" });

        // ✔ Load customer's real cart
        let customerCart = await Cart.findById(customer.cartId);

        // ❗ إذا مفيش cartId → نعمل Cart جديدة
        if (!customerCart) {
            customerCart = await Cart.create({
                customerId: customer._id,
                items: []
            });
            customer.cartId = customerCart._id;
            await customer.save();
        }

        // ✔ Load guest cart if sent
        let guestCart = guestCartId ? await Cart.findById(guestCartId) : null;

        // ❗ لو guestCartId نفس cartId → ممنوع الدمج
        if (guestCartId && guestCartId === customer.cartId.toString()) {
            guestCart = null;
        }

        // ---------------------------------------
        // ✔ MERGE CARTS
        // ---------------------------------------
        if (guestCart && guestCart.items.length > 0) {

            guestCart.items.forEach((guestItem) => {

                const match = customerCart.items.find(
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
                    customerCart.items.push({
                        productId: guestItem.productId,
                        quantity: guestItem.quantity,
                        color: guestItem.color,
                        size: guestItem.size,
                        price: guestItem.price,
                        totalPrice: guestItem.totalPrice
                    });
                }
            });

            await customerCart.save();
        }

        // ✔ Generate token
        const token = jwt.sign(
            { id: customer._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                cartId: customer.cartId,
                addresses: customer.addresses,
                role: customer.role
            },
            cart: customerCart
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
        const customer = await Customer.findById(req.customer);

        res.status(200).json({ customer });

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

        const customer = await Customer.findByIdAndUpdate(req.customer, updates, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            message: "Profile updated",
            customer
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
        const customer = await Customer.findById(req.customer);

        customer.addresses.push(req.body);
        await customer.save();

        res.status(200).json({
            message: "Address added",
            addresses: customer.addresses
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
        const customer = await Customer.findById(req.customer);

        // ❗ لو index غلط
        if (index < 0 || index >= customer.addresses.length) {
            return res.status(400).json({ message: "Invalid address index" });
        }

        customer.addresses[index] = { ...customer.addresses[index], ...req.body };
        await customer.save();

        res.status(200).json({
            message: "Address updated",
            addresses: customer.addresses
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
        const customer = await Customer.findById(req.customer);

        // ❗ حماية من index غلط
        if (index < 0 || index >= customer.addresses.length) {
            return res.status(400).json({ message: "Invalid address index" });
        }

        customer.addresses.splice(index, 1);
        await customer.save();

        res.status(200).json({
            message: "Address deleted",
            addresses: customer.addresses
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.makeAdmin = async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    customer.role = "admin";
    await customer.save();

    res.json({ message: "Customer is now admin", customer });
}
// ---------------------------------------
// ✔ GET ALL USERS (ADMIN ONLY)
// ---------------------------------------
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().select("-password");

        const formatted = customers.map((customer) => ({
            id: customer._id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            role: customer.role,
            cartId: customer.cartId,
            addresses: customer.addresses
        }));

        res.status(200).json({
            count: formatted.length,
            customers: formatted
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
