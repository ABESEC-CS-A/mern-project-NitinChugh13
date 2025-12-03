// src/pages/Checkout.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";

export default function Checkout() {
  const {
    cartItems,
    subtotal,
    delivery,
    total,
    currency,
    placeOrder,
  } = useContext(shopDataContext);

  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", state: "", postalCode: "", country: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="pt-28 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-semibold">Checkout</h2>
          <div className="mt-6 p-6 rounded bg-white/5">Your cart is empty.</div>
        </div>
      </main>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrMsg(null);

    if (!customer.name || !shipping.address) {
      setErrMsg("Please provide your name and shipping address.");
      return;
    }

    setLoading(true);
    const result = await placeOrder({ customer, shipping, paymentMethod, notes });

    setLoading(false);
    if (result.ok) {
      // pass order id to success page
      navigate("/order-success", { state: { orderId: result.order._id } });
    } else {
      setErrMsg(result.msg || "Failed to place order");
    }
  };

  return (
    <main className="pt-28 pb-12 min-h-screen bg-gradient-to-b from-[white]  text-black to-[#001a26]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="p-4 rounded-lg bg-white/6 border border-black">
              <h3 className="font-semibold mb-3">Contact</h3>
              <input className="w-full p-2 mb-2 rounded bg-white/5 text-black" placeholder="Full name" value={customer.name} onChange={(e)=>setCustomer({...customer, name: e.target.value})} />
              <input className="w-full p-2 mb-2 rounded bg-white/5 text-black" placeholder="Email" value={customer.email} onChange={(e)=>setCustomer({...customer, email: e.target.value})} />
              <input className="w-full p-2 mb-2 rounded bg-white/5 text-black" placeholder="Phone" value={customer.phone} onChange={(e)=>setCustomer({...customer, phone: e.target.value})} />
            </div>

            <div className="p-4 rounded-lg bg-white/6 border border-black">
              <h3 className="font-semibold mb-3">Shipping address</h3>
              <input className="w-full p-2 mb-2 rounded bg-white/5 text-black" placeholder="Recipient name" value={shipping.name} onChange={(e)=>setShipping({...shipping, name: e.target.value})} />
              <input className="w-full p-2 mb-2 rounded bg-white/5 text-black" placeholder="Address" value={shipping.address} onChange={(e)=>setShipping({...shipping, address: e.target.value})} />
              <input className="w-full p-2 mb-2 rounded bg-white/5 text-black" placeholder="City" value={shipping.city} onChange={(e)=>setShipping({...shipping, city: e.target.value})} />
              <input className="w-full p-2 mb-2 rounded bg-white/5 text-black" placeholder="State" value={shipping.state} onChange={(e)=>setShipping({...shipping, state: e.target.value})} />
              <input className="w-full p-2 mb-2 rounded bg-white/5 text-black" placeholder="Postal code" value={shipping.postalCode} onChange={(e)=>setShipping({...shipping, postalCode: e.target.value})} />
              <input className="w-full p-2 mb-2 rounded bg-white/5 text-black" placeholder="Country" value={shipping.country} onChange={(e)=>setShipping({...shipping, country: e.target.value})} />
            </div>

            <div className="p-4 rounded-lg bg-white/6 border border-black">
              <h3 className="font-semibold mb-2">Payment</h3>
              <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} className="w-full p-2 rounded bg-white/5 text-black">
                <option value="COD">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card (placeholder)</option>
              </select>
              <textarea className="w-full p-2 mt-2 rounded bg-white/5 text-black" placeholder="Order notes (optional) " value={notes} onChange={(e)=>setNotes(e.target.value)} />
            </div>

            {errMsg && <div className="text-rose-400">{errMsg}</div>}

            <div>
              <button type="submit" disabled={loading} className="px-4 py-3 bg-yellow-300 text-black rounded font-semibold">
                {loading ? "Placing order..." : `Place order — ${currency} ${total.toLocaleString()}`}
              </button>
            </div>
          </form>

          <aside className="p-4 rounded-lg bg-white/6 border border-black">
            <h3 className="font-semibold mb-4">Order summary</h3>
            <div className="space-y-3">
              {cartItems.map((it) => (
                <div key={it.id} className="flex justify-between">
                  <div>
                    <div className="font-medium text-black">{it.name}</div>
                    <div className="text-xs text-black">{it.qty} × {currency} {Number(it.price).toLocaleString()}</div>
                  </div>
                  <div className="font-semibold">{currency} {(Number(it.price) * Number(it.qty)).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-black mt-4 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-black">
                <div>Subtotal</div>
                <div>{currency} {subtotal.toLocaleString()}</div>
              </div>
              <div className="flex justify-between text-sm text-black">
                <div>Delivery</div>
                <div>{currency} {delivery.toLocaleString()}</div>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2">
                <div>Total</div>
                <div>{currency} {total.toLocaleString()}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
