// src/pages/OrderDetails.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/UserContext";
import { format } from "date-fns";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { serverUrl = "" } = useContext(AuthDataContext) || {};
  const { userData } = useContext(UserDataContext) || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await axios.get(`${serverUrl}/api/order/${id}`, { withCredentials: true });
        if (!mounted) return;
        setOrder(res.data?.order ?? res.data);
      } catch (error) {
        console.error("Load order error", error);
        setErr(error?.response?.data?.message || error.message || "Failed to load order");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id, serverUrl]);

  function fmtDate(dateStr) {
    try {
      return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
    } catch {
      return dateStr;
    }
  }

  async function handleUpdateStatus(newStatus) {
    if (!window.confirm(`Change order status to "${newStatus}"?`)) return;
    setUpdating(true);
    try {
      const res = await axios.patch(`${serverUrl}/api/order/update/${id}`, { status: newStatus }, { withCredentials: true });
      setOrder(res.data?.order ?? order);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update order");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this order? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await axios.delete(`${serverUrl}/api/order/delete/${id}`, { withCredentials: true });
      alert("Order deleted");
      navigate("/orders");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete order");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading order...</div>
      </main>
    );
  }

  if (err) {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-rose-400">{err}</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Order not found.</div>
      </main>
    );
  }

  const canManage = userData?.role === "admin" || userData?.isAdmin; // heuristic; adapt to your user model

  return (
    <main className="pt-28 pb-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Order #{order._id}</h1>
            <div className="text-sm text-black">Placed {fmtDate(order.createdAt)}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-black">Status</div>
            <div className="font-semibold text-green-400">{order.status}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Shipping & customer */}
          <div className="md:col-span-1 p-4 rounded-lg bg-white/6 border border-white/6">
            <h3 className="font-semibold mb-2">Customer</h3>
            <div className="text-sm text-black">{order.customer?.name}</div>
            <div className="text-xs text-black">{order.customer?.email}</div>
            <div className="text-xs text-black">{order.customer?.phone}</div>
            <hr className="my-3 border-black" />

            <h3 className="font-semibold mb-2">Shipping</h3>
            <div className="text-sm text-black">{order.shipping?.name}</div>
            <div className="text-xs text-black">{order.shipping?.address}</div>
            <div className="text-xs text-black">{order.shipping?.city}, {order.shipping?.state} {order.shipping?.postalCode}</div>
            <div className="text-xs text-black">{order.shipping?.country}</div>
          </div>

          {/* Right: items + summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="p-4 rounded-lg bg-white/6 border border-white/6">
              <h3 className="font-semibold mb-3">Items</h3>
              <div className="space-y-3">
                {order.items.map((it) => (
                  <div key={it._id || `${it.productId}-${it.name}`} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={it.image || "/placeholder.png"} alt={it.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <div className="font-medium text-black">{it.name}</div>
                        <div className="text-xs text-black">Qty: {it.qty} · {it.size || "—"}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold">{order.total ? (order.total).toLocaleString() : (it.price * it.qty).toLocaleString()}</div>
                      <div className="text-xs text-black">{it.price?.toLocaleString ? it.price.toLocaleString() : it.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/6 border border-white/6">
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="flex justify-between text-sm text-black mb-1"><div>Subtotal</div><div>{order.subtotal?.toLocaleString?.() ?? order.subtotal}</div></div>
              <div className="flex justify-between text-sm text-black mb-3"><div>Shipping</div><div>{order.shippingCost?.toLocaleString?.() ?? order.shippingCost}</div></div>
              <div className="flex justify-between text-lg font-bold"><div>Total</div><div>{order.total?.toLocaleString?.() ?? order.total}</div></div>
            </div>

            {/* Admin / manager actions */}
            {canManage && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdateStatus("Processing")}
                  disabled={updating}
                  className="px-3 py-2 rounded bg-blue-600 text-white"
                >
                  Mark Processing
                </button>
                <button
                  onClick={() => handleUpdateStatus("Shipped")}
                  disabled={updating}
                  className="px-3 py-2 rounded bg-amber-500 text-black"
                >
                  Mark Shipped
                </button>
                <button
                  onClick={() => handleUpdateStatus("Delivered")}
                  disabled={updating}
                  className="px-3 py-2 rounded bg-green-600 text-white"
                >
                  Mark Delivered
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="ml-auto px-3 py-2 rounded bg-red-600 text-white"
                >
                  Delete Order
                </button>
              </div>
            )}

            {/* Non-admin: allow cancel if pending */}
            {!canManage && order.status === "Pending" && (
              <div className="mt-2">
                <button
                  onClick={async () => {
                    if (!window.confirm("Cancel this order?")) return;
                    try {
                      await axios.delete(`${serverUrl}/api/order/delete/${id}`, { withCredentials: true });
                      alert("Order cancelled");
                      navigate("/orders");
                    } catch (err) {
                      alert(err?.response?.data?.message || "Failed to cancel");
                    }
                  }}
                  className="px-3 py-2 rounded bg-red-600 text-white"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link to="/orders" className="text-sm text-black underline">Back to orders</Link>
        </div>
      </div>
    </main>
  );
}
