// controller/orderController.js
import Order from "../model/orderModel.js";

/**
 * POST /api/order/create
 * Create a new order
 * Body expects:
 * {
 *   customer: { name, email, phone },
 *   shipping: { name, address, city, state, postalCode, country },
 *   items: [{ productId, name, qty, price, image, size }],
 *   subtotal, shippingCost, total, paymentMethod, notes?
 * }
 */
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      shipping,
      items,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      notes,
      metadata,
    } = req.body;

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items missing" });
    }
    if (!customer || !shipping) {
      return res.status(400).json({ message: "Customer or shipping information missing" });
    }

    const order = await Order.create({
      user : req.userID || null,
      customer,
      shipping,
      items,
      subtotal: Number(subtotal || 0),
      shippingCost: Number(shippingCost || 0),
      total: Number(total || 0),
      paymentMethod: paymentMethod || "COD",
      notes: notes || "",
      metadata: metadata || {},
    });

    return res.status(201).json({ order });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * GET /api/order/all
 * Return all orders (latest first)
 */
// user: only own orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userID })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Get All Orders error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// admin: all orders
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Get All Orders Admin error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};



/**
 * GET /api/order/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ order });
  } catch (err) {
    console.error("Get Order By Id error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * PATCH /api/order/update/:id
 * Body: { status: "Processing" }
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Missing status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order updated", order });
  } catch (err) {
    console.error("Update Order error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * DELETE /api/order/delete/:id
 */
export const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ message: "Order deleted", id: req.params.id });
  } catch (err) {
    console.error("Delete Order error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
