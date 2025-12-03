// model/orderModel.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
  name: String,
  qty: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  image: String,
  size: String,
});

const orderSchema = new mongoose.Schema(
  
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    customer: {
      name: String,
      email: String,
      phone: String,
    },
    shipping: {
      name: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    items: [orderItemSchema], // array of items
    subtotal: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paymentMethod: String,
    isPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    // optional internal fields you might use
    notes: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
