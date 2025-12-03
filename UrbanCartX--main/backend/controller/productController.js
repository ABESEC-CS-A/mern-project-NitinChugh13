// controller/productController.js
import uploadOnCloudinary from "../config/cloudinary.js";
import product from "../model/productModel.js";

/**
 * POST /api/product/addproduct
 * Add a new product
 */
export const addProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      category,
      subcategory,
      sizes,
      bestseller,
    } = req.body;

    // 1) Basic validation
    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "Missing required product fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images received" });
    }

    console.log("Incoming files:", req.files);

    // 2) Upload all images to Cloudinary
    const uploadResults = await Promise.all(
      req.files.map((file) => uploadOnCloudinary(file.path))
    );

    console.log("Cloudinary upload results:", uploadResults);

    // 3) Normalise to URL
    const imageUrls = uploadResults
      .map((result) => {
        if (!result) return null;
        if (typeof result === "string") return result;
        if (result.secure_url) return result.secure_url;
        if (result.url) return result.url;
        return null;
      })
      .filter(Boolean);

    if (imageUrls.length === 0) {
      return res.status(500).json({
        message: "Add Product error: no valid Cloudinary URLs were returned",
      });
    }

    // 4) Map up to 4 URLs to image1–4
    const [image1, image2 = null, image3 = null, image4 = null] = imageUrls;

    // 5) Parse sizes safely
    let parsedSizes;
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch {
      parsedSizes = [];
    }

    // 6) Create product
    const productData = await product.create({
      name,
      description,
      price: Number(price),
      category,
      subCategory: subcategory,
      sizes: parsedSizes,
      bestSeller: bestseller === "true" || bestseller === true,
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    });

    return res.status(201).json({ product: productData });
  } catch (error) {
    console.log("Add Product error ", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res
      .status(500)
      .json({ message: `Add Product error: ${error.message}` });
  }
};

/**
 * GET /api/product/all
 * Get all products
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await product.find().sort({ createdAt: -1 }); // latest first
    return res.status(200).json({ products });
  } catch (error) {
    console.log("Get All Products error ", error);
    return res
      .status(500)
      .json({ message: `Get All Products error: ${error.message}` });
  }
};

/**
 * DELETE /api/product/delete/:id
 * Delete product by id
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", id });
  } catch (error) {
    console.log("Delete Product error ", error);
    return res
      .status(500)
      .json({ message: `Delete Product error: ${error.message}` });
  }
};

/**
 * GET /api/product/:id
 * Return a single product by id (defensive)
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing product id" });

    // lean() returns plain object (lighter)
    const item = await product.findById(id).lean();
    if (!item) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ product: item });
  } catch (error) {
    console.error("getProductById error:", error);
    return res.status(500).json({ message: "Server error while retrieving product" });
  }
};

/**
 * GET /api/product/:id/reviews
 * Return stored reviews if present, otherwise empty array
 */
export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing product id" });

    // Only return reviews field (if you store reviews inside product doc)
    const item = await product.findById(id, { reviews: 1 }).lean();
    const reviews = item?.reviews ?? [];
    return res.status(200).json({ reviews });
  } catch (error) {
    console.error("getProductReviews error:", error);
    return res.status(500).json({ message: "Server error while retrieving reviews" });
  }
};

/**
 * POST /api/product/:id/reviews
 * Accept a review payload and return the created review object.
 * (Optional: persist to DB if desired)
 */
export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, text } = req.body;

    if (!id) return res.status(400).json({ message: "Missing product id" });
    if (!name || !text) return res.status(400).json({ message: "Missing review name or text" });

    const review = {
      name,
      rating: Number(rating) || 5,
      text,
      createdAt: new Date(),
    };

    // OPTIONAL: persist into product document
    // await product.findByIdAndUpdate(id, { $push: { reviews: review } });

    return res.status(201).json({ review });
  } catch (error) {
    console.error("addProductReview error:", error);
    return res.status(500).json({ message: "Server error while adding review" });
  }
};

