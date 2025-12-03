// src/pages/OrderSuccess.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <main className="pt-28 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-6 rounded-lg bg-white/6 border border-white/6">
        <h2 className="text-2xl font-bold mb-3">Thank you — your order was placed!</h2>
        {orderId ? <p className="mb-3">Order ID: <strong>{orderId}</strong></p> : <p className="mb-3">We received your order.</p>}
        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="px-4 py-2 rounded bg-slate-900 text-white">View Orders</Link>
          <Link to="/" className="px-4 py-2 rounded bg-yellow-300">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
