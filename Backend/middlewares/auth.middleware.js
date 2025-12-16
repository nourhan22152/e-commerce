const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.model");


// ---------------------------------------------
// ✔ PROTECT (requires login)
// ---------------------------------------------
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const customer = await Customer.findById(decoded.id);

        if (!customer) {
            return res.status(401).json({ message: "Customer no longer exists" });
        }

        req.customer = customer; // نحفظ بيانات اليوزر كلها

        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};



// ---------------------------------------------
// ✔ ADMIN GUARD (for admin-only routes)
// ---------------------------------------------
const isAdmin = (req, res, next) => {
    if (!req.customer) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.customer.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
};


module.exports = {
    protect,
    isAdmin
};
