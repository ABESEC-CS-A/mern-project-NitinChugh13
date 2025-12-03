import express from "express";
import isAuth from "../middleware/isAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  getAllOrders,
  getAllOrdersAdmin,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  createOrder,
} from "../controller/orderController.js";

const router = express.Router();

// user routes
router.post("/create", isAuth, createOrder);
router.get("/all", isAuth, getAllOrders);
router.get("/:id", isAuth, getOrderById);
router.patch("/update/:id", isAuth, updateOrderStatus);
router.delete("/delete/:id", isAuth, deleteOrder);

// admin routes
router.get("/admin/all", adminAuth, getAllOrdersAdmin);
router.get("/admin/:id", adminAuth, getOrderById);
router.patch("/admin/update/:id", adminAuth, updateOrderStatus);
router.delete("/admin/delete/:id", adminAuth, deleteOrder);

export default router;
