// src/pages/Cart.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";

export default function Cart() {
  const {
    cartItems,
    cartCount,
    subtotal,
    delivery,
    total,
    currency,
    updateCartItemQty,
    removeFromCart,
    clearCart,
  } = useContext(shopDataContext);

  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="pt-28 pb-12 min-h-screen bg-gradient-to-b from-white/5 to-white/2">
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          <div className="p-8 rounded-lg bg-white/5 border border-white/6 text-slate-300">
            Your cart is empty.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-12 min-h-screen bg-gradient-to-b from-white/5 to-white/2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((it) => (
              <div key={it.id} className="flex gap-4 items-center p-4 rounded-lg bg-white/3 border border-white/6">
                <img src={it.image || "/placeholder.png"} alt={it.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold text-white">{it.name}</div>
                  <div className="text-sm text-slate-300">{currency} {Number(it.price).toLocaleString()}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => updateCartItemQty(it.id, (Number(it.qty) || 1) - 1)} className="px-3 py-1 bg-white/10 rounded">-</button>
                    <div className="px-3 py-1 bg-white/5 rounded">{it.qty}</div>
                    <button onClick={() => updateCartItemQty(it.id, (Number(it.qty) || 1) + 1)} className="px-3 py-1 bg-white/10 rounded">+</button>
                    <button onClick={() => removeFromCart(it.id)} className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded">Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">{currency} {(Number(it.price) * Number(it.qty)).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="md:col-span-1 p-4 rounded-lg bg-white/6 border border-white/6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-300">
                <div>Items ({cartCount})</div>
                <div>{currency} {subtotal.toLocaleString()}</div>
              </div>
              <div className="flex justify-between text-sm text-slate-300 mt-2">
                <div>Delivery</div>
                <div>{currency} {delivery.toLocaleString()}</div>
              </div>
              <div className="border-t border-white/8 mt-3 pt-3 flex justify-between items-center">
                <div className="text-lg font-semibold">Total</div>
                <div className="text-lg font-bold">{currency} {total.toLocaleString()}</div>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout", { state: { cartItems } })}
              className="w-full px-4 py-3 bg-yellow-300 text-black font-semibold rounded-md"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => clearCart()}
              className="mt-3 w-full px-4 py-2 bg-transparent border border-white/10 text-sm rounded-md"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
