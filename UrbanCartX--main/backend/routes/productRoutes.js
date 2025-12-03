// routes/productRoutes.js
import express from "express";
import {
  addProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
  getProductReviews,
  addProductReview,
} from "../controller/productController.js";
import upload from "../middleware/multer.js";

const productRoutes = express.Router();

// POST /api/product/addproduct
productRoutes.post("/addproduct", upload.array("images", 4), addProduct);

// GET /api/product/all
productRoutes.get("/all", getAllProducts);

// DELETE /api/product/delete/:id
productRoutes.delete("/delete/:id", deleteProduct);

// GET single product
productRoutes.get("/:id", getProductById);

// GET reviews
productRoutes.get("/:id/reviews", getProductReviews);

// POST reviews
productRoutes.post("/:id/reviews", addProductReview);

export default productRoutes;
