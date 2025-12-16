const Category = require("../models/category.model");
const slugify = require("slugify");

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Build full URL for stored file
        const image = req.file
            ? `http://localhost:4000/${req.file.path.replace(/\\/g, "/")}`
            : null;

        const category = await Category.create({
            name,
            slug: slugify(name),
            image,   
            description
        });

        res.status(201).json({
            success: true,
            data: category
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get All Categories (excluding deleted)
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false });

        res.status(200).json({
            success: true,
            data: categories,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Get Single Category
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({ success: true, data: category });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const name = req.body.name?.trim();
        const description = req.body.description?.trim();

        let imageUrl;

        if (req.file) {
            imageUrl = `http://localhost:4000/${req.file.path.replace(/\\/g, "/")}`;
        }

        const updateData = {};

        if (name) {
            updateData.name = name;
            updateData.slug = slugify(name);
        }

        if (description) {
            updateData.description = description;
        }

        if (imageUrl) {
            updateData.image = imageUrl;
        }

        const updated = await Category.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({ success: true, data: updated });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Soft Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Category not found or already deleted" });
        }

        res.status(200).json({
            success: true,
            message: "Category soft-deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
