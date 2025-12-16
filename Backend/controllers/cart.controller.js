const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

// --------------------Add to cart-------------------



exports.addToCart = async (req, res) => {
    try {
        const { productId, color, size, quantity } = req.body;


        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { cartId } = req.body;
        let cart = await Cart.findById(cartId);

        if (!cart) {
            cart = await Cart.create({
                customerId: null,
                items: []
            });

            console.log("cart created");
        }



        const existingItem = cart.items.find(
            (item) =>
                item.productId.toString() === productId.toString() &&
                item.color === color &&
                item.size === size &&
                item.isDeleted === false
        );

        if (existingItem) {
            existingItem.quantity += Number(quantity);
            existingItem.totalPrice = Number(existingItem.quantity) * existingItem.price;
        } else {
            cart.items.push({
                productId: new mongoose.Types.ObjectId(productId),
                name: product.name, // snapshot
                price: product.price,
                image: product.variants.find(v => v.color === color)?.image,
                color,
                size,
                quantity: Number(quantity),

                totalPrice: product.price * Number(quantity),
            });
        }

        await cart.save();

        const activeItems = cart.items.filter(item => item.isDeleted === false);

        res.status(200).json({
            cartId: cart._id,
            cart: {
                ...cart.toObject(),
                items: activeItems
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --------------------Update cart---------------
exports.updatequantity = async (req, res) => {
    try {
        const { productId, color, size, quantity } = req.body;

        const { cartId } = req.body;
        let cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(
            (item) =>
                item.productId.toString() === productId.toString() &&
                item.color === color &&
                item.size === size &&
                item.isDeleted === false
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = Number(quantity);
        item.totalPrice = item.price * Number(quantity);

        await cart.save();

        const activeItems = cart.items.filter(item => item.isDeleted === false);

        res.status(200).json({
            cart: {
                ...cart.toObject(),
                items: activeItems
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --------------------Remove item-------------------
exports.deleteFromCart = async (req, res) => {
    try {
        const { productId, color, size } = req.body;

        const { cartId } = req.body;
        let cart = await Cart.findById(cartId);

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(
            (item) =>
                item.productId.toString() === productId.toString() &&
                item.color === color &&
                item.size === size &&
                item.isDeleted === false
        );

        if (!item) return res.status(404).json({ message: "Item not found" });

        item.isDeleted = true;
        item.deletedAt = new Date();

        await cart.save();

        const activeItems = cart.items.filter(item => item.isDeleted === false);

        return res.status(200).json({
            message: "Item removed (soft delete)",
            cartId: cart._id,
            cart: {
                ...cart.toObject(),
                items: activeItems
            }
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// --------------------Get customer cart-----------------
exports.getCart = async (req, res) => {
    try {
        const { cartId } = req.query;
        let cart = await Cart.findById(cartId);
        if (!cart) {
            cart = await Cart.create({
                customerId: null,
                items: []
            });
            console.log("Guest cart created")
        }

        const activeItems = cart.items.filter(item => item.isDeleted === false);

        res.status(200).json({
            cartId: cart._id,
            cart: {
                ...cart.toObject(),
                items: activeItems
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDeletedCart = async (req, res) => {
    try {
        const { cartId } = req.query;
        let cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ message: "Cart is empty" });

        const deleteditems = cart.items.filter(item => item.isDeleted === true);

        res.status(200).json({
            cart: {
                ...cart.toObject(),
                items: deleteditems
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};