const Order = require("../models/orderModel")
const Product = require("../models/productModel");
const mongoose = require("mongoose");

// this is the old function i have made without varient
// exports.createOrder = async (req, res) => {
//     try {
//         // 1) Validate items
//         if (!req.body.items || req.body.items.length === 0) {
//             return res.status(400).json({ message: "Items are required" });
//         }

//         const orderItems = [];

//         for (let item of req.body.items) {
//             const product = await Product.findById(item.productId);

//             if (!product) {
//                 return res.status(400).json({ message: "Product not found" });
//             }


//             const variant = product.variants.find(v =>
//                 v.color === item.color && v.size === item.size
//             );

//             if (!variant) {
//                 return res.status(400).json({
//                     message: `Color "${item.color}" or size "${item.size}" not available for ${product.name}`
//                 });
//             }

//             // Optional: check color
//             // if (item.color && (!product.color || !product.color.includes(item.color))) {
//             //     return res.status(400).json({
//             //         message: `Color "${item.color}" not available for ${product.name}`
//             //     });
//             // }

//             // // Optional: check size
//             // if (item.size && (!product.size || !product.size.includes(item.size))) {
//             //     return res.status(400).json({
//             //         message: `Size "${item.size}" not available for ${product.name}`
//             //     });
//             // }

//             // snapshot
//             orderItems.push({
//                 productId: product._id,
//                 name: product.name,
//                 price: product.price,
//                 image: product.image,
//                 color: item.color,
//                 size: item.size,
//                 quantity: item.quantity,
//                 totalPrice: product.price * item.quantity
//             });
//         }

//         // 2) Create order
//         const order = await Order.create({
//             userId: req.user ? req.user._id : null,
//             guestInfo: req.user ? null : req.body.guestInfo,
//             items: orderItems,
//             shippingAddress: req.body.shippingAddress,
//             paymentMethod: req.body.paymentMethod,
//             totalItems: orderItems.reduce((sum, i) => sum + i.quantity, 0),
//             totalPrice: orderItems.reduce((sum, i) => sum + i.totalPrice, 0),
//         });

//         // 3) Atomic Stock Update
//         for (let item of orderItems) {
//             const update = await Product.updateOne(
//                 {
//                     _id: item.productId,
//                     stock: { $gte: item.quantity } // ensure stock is enough
//                 },
//                 {
//                     $inc: {
//                         stock: -item.quantity,
//                         soldNo: item.quantity
//                     }
//                 }
//             );

//             // If stock not enough → rollback manually by deleting order
//             if (update.modifiedCount === 0) {
//                 await Order.findByIdAndDelete(order._id);

//                 return res.status(400).json({
//                     message: `Not enough stock left for ${item.name}`
//                 });
//             }
//         }

//         res.status(201).json({ message: "Order created", order });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };




// exports.createOrder = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const orderItems = [];

//         for (let item of req.body.items) {
//             const product = await Product.findById(item.productId).session(session);

//             if (!product) {
//                 throw new Error("Product not found");
//             }
//             // Validate color
//             if (item.color && !product.color.includes(item.color)) {
//                 return res.status(400).json({
//                     message: `Color "${item.color}" is not available for ${product.name}`
//                 });
//             }

//             // Validate size
//             if (item.size && !product.size.includes(item.size)) {
//                 return res.status(400).json({
//                     message: `Size "${item.size}" is not available for ${product.name}`
//                 });
//             }
//             if (product.stock < item.quantity) {
//                 throw new Error(`Only ${product.stock} left of ${product.name}`);
//             }

//             // snapshot
//             orderItems.push({
//                 productId: product._id,
//                 name: product.name,
//                 price: product.price,
//                 color: item.color,
//                 size: item.size,
//                 quantity: item.quantity,
//                 totalPrice: product.price * item.quantity
//             });

//             // reduce stock inside transaction
//             await Product.updateOne(
//                 { _id: item.productId },
//                 { $inc: { stock: -item.quantity, soldNo: item.quantity } }
//             ).session(session);
//         }

//         const order = await Order.create([{
//             userId: req.user ? req.user._id : null,
//             guestInfo: req.user ? null : req.body.guestInfo,
//             items: orderItems,
//             shippingAddress: req.body.shippingAddress,
//             paymentMethod: req.body.paymentMethod,
//             totalItems: orderItems.reduce((a, i) => a + i.quantity, 0),
//             totalPrice: orderItems.reduce((a, i) => a + i.totalPrice, 0),
//         }], { session });

//         await session.commitTransaction();
//         session.endSession();

//         res.status(201).json({ message: "Order created", order: order[0] });

//     } catch (err) {
//         await session.abortTransaction();
//         session.endSession();
//         res.status(400).json({ message: err.message });
//     }
// };

exports.createOrder = async (req, res) => {
    try {
        if (!req.body.items || req.body.items.length === 0) {
            return res.status(400).json({ message: "Items are required" });
        }

        const orderItems = [];

        for (let item of req.body.items) {

            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ message: "Product not found" });
            }


            const variant = product.variants.find(v => v.color === item.color);
            if (!variant) {
                return res.status(400).json({
                    message: `Color "${item.color}" not available for ${product.name}`
                });
            }


            const sizeObj = variant.sizes.find(s => s.size === item.size);

            if (!sizeObj) {
                return res.status(400).json({
                    message: `Size "${item.size}" not available for ${product.name}`
                });
            }


            if (sizeObj.stock < item.quantity) {
                return res.status(400).json({
                    message: `Only ${sizeObj.stock} left in stock for ${product.name}`
                });
            }


            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: variant.image,
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                totalPrice: product.price * item.quantity
            });



        }


        await Promise.all(
            orderItems.map(async (i) =>
                Product.updateOne(
                    { _id: i.productId, "variants.color": i.color, "variants.sizes.size": i.size },
                    {
                        $inc: {
                            "variants.$[v].sizes.$[s].stock": -i.quantity,
                            soldNo: i.quantity
                        }
                    },
                    {
                        arrayFilters: [
                            { "v.color": i.color },
                            { "s.size": i.size }
                        ]
                    }
                )
            )
        );


        const order = await Order.create({
            userId: req.user ? req.user._id : null,
            guestInfo: req.user ? null : req.body.guestInfo,
            items: orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            totalItems: orderItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: orderItems.reduce((sum, i) => sum + i.totalPrice, 0),
        });

        res.status(201).json({ message: "Order created", order });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Allow cancellation only for the user's own order
        if (order.userId && order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not allowed to cancel this order" });
        }

        // Allowed statuses to cancel
        if (order.status !== "pending" && order.status !== "confirmed") {
            return res.status(400).json({
                message: `Cannot cancel order when status is '${order.status}'`
            });
        }

        // 1) Update order status
        order.status = "cancelled";
        order.cancelledAt = new Date();
        await order.save();

        // 2) Return stock for each variant + size
        for (let item of order.items) {
            await Product.updateOne(
                {
                    _id: item.productId,
                    "variants.color": item.color,
                    "variants.sizes.size": item.size
                },
                {
                    $inc: {
                        "variants.$[v].sizes.$[s].stock": item.quantity,
                        soldNo: -item.quantity
                    }
                },
                {
                    arrayFilters: [
                        { "v.color": item.color },
                        { "s.size": item.size }
                    ]
                }
            );
        }

        return res.json({
            message: "Order has been cancelled successfully",
            order
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // --------- 1. Prevent updating cancelled orders ---------
        if (order.status === "cancelled") {
            return res.status(400).json({
                message: "Cannot update a cancelled order"
            });
        }

        // --------- 2. Prevent updating delivered orders ---------
        if (order.status === "delivered") {
            return res.status(400).json({
                message: "Order is already delivered. No further updates allowed."
            });
        }

        // ---------  3. Allowed status transitions table ---------
        const allowedTransitions = {
            pending: ["confirmed", "shipped", "delivered", "cancelled"],
            confirmed: ["shipped", "delivered", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: []
        };

        const currentStatus = order.status;

        // ---------  4. Prevent invalid transitions ---------
        if (!allowedTransitions[currentStatus].includes(status)) {
            return res.status(400).json({
                message: `Cannot change status from '${currentStatus}' to '${status}'`
            });
        }

        // ---------  5. Apply status update ---------
        order.status = status;

        // Set delivery time automatically
        if (status === "delivered") {
            order.deliveredAt = new Date();
        }

        // Cancelled by admin → keep cancelledAt
        if (status === "cancelled") {
            order.cancelledAt = new Date();
        }

        await order.save();

        return res.json({
            message: `Order status updated to ${status}`,
            order
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getUserOrders = async (req, res) => {
    try {

        const userId = req.user._id;

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(200).json({ message: "No orders found for this user", orders: [] });
        }

        res.status(200).json({
            message: "User orders fetched successfully",
            orders
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        // Optional filters
        const { status } = req.query;

        let filter = {};

        // فلترة حسب الحالة لو مبعوتة
        if (status) {
            filter.status = status;
        }

        // هات كل الأوردرز مع ترتيب من الأحدث للأقدم
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .populate("userId", "name email"); // لو عايزة بيانات اليوزر

        res.status(200).json({
            message: "All orders fetched successfully",
            count: orders.length,
            orders
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate("userId", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order fetched successfully",
            order
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


