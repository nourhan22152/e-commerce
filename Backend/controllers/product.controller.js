const products = require("../models/product.model");


exports.addProduct = async (req, res) => {
  try {
    let { name, price, category, variants } = req.body;

    if (!name) return res.status(400).json({ message: "name is required" });
    if (!price || price < 0) return res.status(400).json({ message: "Price must be > 0" });
    if (!category) return res.status(400).json({ message: "category is required" });

    // Convert variants from JSON string → object
    if (typeof variants === "string") {
      variants = JSON.parse(variants);
    }

    const files = req.files || [];

    const processedVariants = variants.map((variant, index) => ({
      ...variant,
      image: files[index]
        ? `http://localhost:4000/${files[index].path.replace(/\\/g, "/")}`
        : null
    }));

    const product = await products.create({
      name,
      price,
      category,
      variants: processedVariants
    });

    res.json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Add Product Error:", error);
  }
};



// exports.addOneProduct = async (req, res) => {
//   try {
//     if (!req.body.name) {
//       return res.status(400).json({ message: "name is required" });
//     }

//     if (!req.body.price || req.body.price < 0) {
//       return res.status(400).json({ message: "Price must be > 0" });
//     }

//     // Build full image URL
//     const imageUrl = req.file
//       ? `http://localhost:4000/${req.file.path.replace(/\\/g, "/")}`
//       : null;

//     const product = await products.create({
//       ...req.body,
//       image: imageUrl
//     });

//     res.json(product);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.addManyproducts = async (req, res) => {
//   try {
//     const files = req.files; // array of images

//     const finalProducts = req.body.products.map((p, index) => ({
//       ...p,
//       image: files[index]
//         ? `http://localhost:4000/${files[index].path.replace(/\\/g, "/")}`
//         : null
//     }));

//     const saved = await products.insertMany(finalProducts);

//     res.json(saved);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



exports.getAllproducts = async (req, res) => {
  try {
    const result = await products.find({ isDeleted: false }).populate("category");

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await products.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateProductbyid = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, price, category, variants } = req.body;

    const files = req.files || [];

    if (variants && typeof variants === "string") {
      variants = JSON.parse(variants);
    }

    const processedVariants = variants
      ? variants.map((variant, index) => ({
        ...variant,
        image: files[index]
          ? `http://localhost:4000/${files[index].path.replace(/\\/g, "/")}`
          : variant.image // keep old image
      }))
      : undefined;

    const updateData = {
      name,
      price,
      category
    };

    if (processedVariants) updateData.variants = processedVariants;

    const updatedProduct = await products.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json(updatedProduct);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.Deleteproductbyid = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await products.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    res.json({ success: true, deletedProduct });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.filterProducts = async (req, res) => {
  try {
    const { min, max, category, size, color } = req.query;

    let query = { isDeleted: false };

    if (min || max) {
      query.price = {};
      if (min) query.price.$gte = Number(min);
      if (max) query.price.$lte = Number(max);
    }

    if (category) {
      query.category = category;
    }

    if (color) {
      query["variants.color"] = { $regex: new RegExp(`^${color}$`, "i") };
    }


    if (size) {
      query["variants.sizes.size"] = size;
    }

    const filtered = await products.find(query).populate("category");

    res.json(filtered);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getProductsByCategory = async (req, res) => {
  try {
    const result = await products.find({
      category: req.params.categoryId,
      isDeleted: false
    }).populate("category");

    res.json({ success: true, data: result });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


exports.filterByColor = async (req, res) => {
  try {
    const { color } = req.query;

    const products = await products.find({ color });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.filterByPrice = async (req, res) => {
  try {
    const { min, max } = req.query;

    let query = {};

    if (min) {
      query.price = {};
      query.price.$gte = Number(min);
    }

    if (max) {
      if (!query.price) query.price = {};
      query.price.$lte = Number(max);
    }

    const filtered = await products.find(query);

    res.json(filtered);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterBySize = async (req, res) => {
  try {
    const { size } = req.query;

    const products = await products.find({ size });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// exports.getProductsByCategory = async (req, res) => {
//   try {
//     const products = await products.find({
//       category: req.params.categoryId,
//       isDeleted: false
//     }).populate("category");

//     res.json({ success: true, data: products });

//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };





// exports.filterByCategory = async (req, res) => {
//   try {
//     const { category } = req.query;

//     const filter = { isDeleted: false }; //soft delete

//     if (category) filter.category = category;
//     // if (subcategory) filter.subcategory = subcategory;

//     const products = await products.find(filter).populate("category");

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       data: products
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };





