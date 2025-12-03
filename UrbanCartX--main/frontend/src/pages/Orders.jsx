// src/pages/Orders.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/UserContext"; // optional
import { format } from "date-fns";

export default function Orders() {
  const { serverUrl = "" } = useContext(AuthDataContext) || {};
  const { userData } = useContext(UserDataContext) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        // Try user-specific endpoint if available, otherwise fall back to global list
        let res;
        try {
          res = await axios.get(`${serverUrl}/api/user/orders`, { withCredentials: true });
        } catch (e) {
          // fallback
          res = await axios.get(`${serverUrl}/api/order/all`, { withCredentials: true });
        }
        if (!mounted) return;
        const fetched = res.data?.orders ?? res.data?.orders ?? [];
        setOrders(fetched);
      } catch (error) {
        console.error("Load orders error", error);
        setErr(error?.response?.data?.message || error.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [serverUrl]);

  function formatDate(dateStr) {
    try {
      return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
    } catch {
      return dateStr;
    }
  }

  if (loading) {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading orders...</div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-semibold mb-6">Orders</h1>

        {err && (
          <div className="mb-4 text-rose-400">
            {err}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="p-6 rounded bg-black/6 border border-white/6 text-center text-slate-300">No orders found.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="p-4 rounded-lg bg-black/6 border border-white/6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-black">#{o._id?.slice(-6)}</div>
                    <div className="text-sm text-black">{formatDate(o.createdAt)}</div>
                    <div className="ml-4 text-sm text-black">Status: <span className="font-medium text-green-400 ml-2">{o.status}</span></div>
                  </div>

                  <div className="mt-2 text-sm text-black">
                    {o.customer?.name ? <>Customer: <span className="font-medium text-black">{o.customer.name}</span></> : null}
                    {o.items?.length ? <span className="ml-3">Items: <span className="font-medium">{o.items.length}</span></span> : null}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <div className="text-sm text-black">Total</div>
                    <div className="font-semibold">{o.total?.toLocaleString?.() ?? o.total}</div>
                  </div>
                  <button
                    onClick={() => navigate(`/orders/${o._id}`)}
                    className="px-3 py-2 rounded bg-slate-900 text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
