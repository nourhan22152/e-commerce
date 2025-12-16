require ("dotenv").config();
const express = require('express');
const app = express();  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');

//connection  "mongodb://127.0.0.1:27017/e-commerce
require("./config/db");

const multer = require("multer");
const path = require("path");

// Folder to save images
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


const productcontroller = require("./controllers/product.controller")
const cartController = require("./controllers/cart.controller")
const customerController = require("./controllers/customer.controller")
const categoryController = require("./controllers/category.controller")
const feedbackController = require("./controllers/feedback.controller")
const { protect, isAdmin } = require("./middlewares/auth.middleware");





//-----------------------------------


app.get("/products/api/filter", productcontroller.filterProducts);
app.get("/products/api/by-category/:categoryId", productcontroller.getProductsByCategory);
app.get("/products/api", productcontroller.getAllproducts);
app.get("/products/api/:id", productcontroller.getProductById);
app.post("/products/api/", upload.array("images"), productcontroller.addProduct);
// app.post("/products/api/many", upload.array("images"), productcontroller.addManyproducts);
app.patch("/products/api/:id", upload.single("image"), productcontroller.updateProductbyid);
app.delete("/products/api/:id", productcontroller.Deleteproductbyid);

/* ----------------------------------------------------------------------------- */
app.post("/cart/api", cartController.addToCart );
app.patch("/cart/api", cartController.updatequantity );
app.get("/cart/api", cartController.getCart );
app.delete("/cart/api", cartController.deleteFromCart);
// app.get("/Deletedcart/api", cartController.getDeletedCart);


// ----------------------------------------------------
// ✔ Import Controllers
// ----------------------------------------

const {
  register,
  login,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  makeAdmin,
  getAllCustomers
} = customerController;

// ✔ Import Auth Middleware



// =================================================================
//                         Customer ROUTES
// =================================================================

// ✔ Public Routes (Register + Login)
app.get("/api/customers/", protect, isAdmin, getAllCustomers);

app.put("/api/customers/makeadmin/:id", protect, isAdmin, makeAdmin)

app.post("/api/customers/register", register);
app.post("/api/customers/login", login);

// ✔ Private Routes (Protected with JWT)-09

app.get("/api/customers/profile",protect, getProfile);
app.put("/api/customers/profile",protect , updateProfile);

app.post("/api/customers/address",protect, addAddress);
app.put("/api/customers/address/:index",protect , updateAddress);
app.delete("/api/customers/address/:index",protect , deleteAddress);

// ------------------------------------------------------------------------------------
const orderController = require("./controllers/order.controller");


app.post("/orders/api", protect, orderController.createOrder);
app.put("/orders/api/:id/cancel", protect, orderController.cancelOrder);
app.put("/orders/api/:id/status", protect, isAdmin, orderController.updateOrderStatus);
app.get("/orders/api/customer", protect, orderController.getCustomerOrders);
app.get("/orders/api", protect, isAdmin, orderController.getAllOrders);
app.get("/orders/api/:id", protect, isAdmin, orderController.getOrderById);

// ---------------------------------------------------------------------------------
app.post("/api/feedback",feedbackController.createFeedback)
app.put("/api/feedback/approve/:id",feedbackController.updatefeedback)
app.get("/api/feedback/approved",feedbackController.getfeedback)
app.get("/api/feedback",feedbackController.getallfeedback)

//--------------------category-----------------------------------
app.post("/categories/api",protect, isAdmin, upload.single("image"), categoryController.createCategory);
app.get("/categories/api", categoryController.getCategories )
app.get("/categories/api/:id", categoryController.getCategoryById );
app.put("/categories/api/:id",protect, isAdmin, upload.single("image"), categoryController.updateCategory);
app.delete("/categories/api/:id",protect, isAdmin, categoryController.deleteCategory);



//listening
const port = 4000;
app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
