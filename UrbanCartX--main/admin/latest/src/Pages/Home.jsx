// src/Pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Nav from "../Components/Nav";
import Sidebar from "../Components/Sidebar";
import { useContext } from "react";
import { authDataContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Dashboard Home
 * - Fetches products and orders
 * - Displays cards, recent orders, recent products and a small revenue sparkline
 *
 * Requires:
 * - Nav, Sidebar components
 * - authDataContext providing `serverUrl`
 */

function sparklinePath(values = [], w = 240, h = 48) {
  // simple min/max normalized path generator
  if (!values || values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / Math.max(1, values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * (h - 4) - 2; // padding
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function Home() {
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  // sidebar control (same pattern used across pages)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  }, []);

  // data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch products + orders
  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [pRes, oRes] = await Promise.all([
          axios.get(`${serverUrl}/api/product/all`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/order/admin/all`, { withCredentials: true }),
        ]);

        if (cancelled) return;
        const prods = pRes.data?.products ?? pRes.data ?? [];
        const ords = oRes.data?.orders ?? oRes.data ?? [];

        setProducts(Array.isArray(prods) ? prods : []);
        setOrders(Array.isArray(ords) ? ords : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (serverUrl) fetchAll();
    return () => {
      cancelled = true;
    };
  }, [serverUrl]);

  // derived metrics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const revenue = orders.reduce((s, o) => s + Number(o.total ?? o.amount ?? o.grandTotal ?? 0), 0);

    // best-seller heuristic: count products flagged bestSeller (or most-ordered product if available)
    const bestSellerCount = products.filter((p) => p.bestSeller === true || p.bestSeller === "true").length;

    // recent orders (sorted newest first)
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt ?? b.date ?? 0) - new Date(a.createdAt ?? a.date ?? 0)).slice(0, 6);

    // recent products
    const recentProducts = [...products].sort((a, b) => new Date(b.createdAt ?? b.date ?? 0) - new Date(a.createdAt ?? a.date ?? 0)).slice(0, 6);

    // revenue per day for last N orders (simple sparkline)
    const last10 = [...orders]
      .sort((a, b) => new Date(a.createdAt ?? a.date ?? 0) - new Date(b.createdAt ?? b.date ?? 0))
      .slice(-10)
      .map((o) => Number(o.total ?? o.amount ?? o.grandTotal ?? 0));

    return { totalProducts, totalOrders, revenue, bestSellerCount, recentOrders, recentProducts, revenueSpark: last10 };
  }, [products, orders]);

  // UI helpers
  const fmt = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : n;

  return (
    <div className="w-full min-h-screen bg-[white] text-black overflow-x-hidden relative flex">
      <Sidebar collapsedProp={sidebarCollapsed} onToggleProp={() => setSidebarCollapsed((s) => !s)} />

      <div className={`w-full transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:ml-16" : "md:ml-64"}`}>
        <div className="sticky top-0 z-20 bg-[#0b0f19]/80 backdrop-blur-sm border-b border-black/5">
          <Nav />
        </div>

        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-400">Welcome back</h1>
              <p className="text-sm text-black-300 mt-1">Here’s what's happening with your store right now.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/add")}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg font-semibold shadow"
              >
                Add product
              </button>
              <button
                onClick={() => navigate("/lists")}
                className="px-4 py-2 border border-black/10 rounded-lg text-black/90 hover:bg-black/5"
              >
                View products
              </button>
            </div>
          </div>

          {/* Loading / Error */}
          {loading ? (
            <div className="h-40 flex items-center justify-center text-black-400">Loading dashboard...</div>
          ) : error ? (
            <div className="bg-red-700/10 border border-red-700/20 text-red-200 px-4 py-3 rounded">{error}</div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/6 rounded-lg p-4">
                  <div className="text-xs text-black-400">Products</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold">{fmt(stats.totalProducts)}</div>
                      <div className="text-sm text-black-400">Total items</div>
                    </div>
                    <div className="bg-blue-500/10 text-amber-400 rounded px-3 py-2 font-semibold">Manage</div>
                  </div>
                </div>

                <div className="bg-black/6 rounded-lg p-4">
                  <div className="text-xs text-black-400">Orders</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold">{fmt(stats.totalOrders)}</div>
                      <div className="text-sm text-black-400">Orders placed</div>
                    </div>
                    <div className="bg-blue-500/10 text-black-300 rounded px-3 py-2 font-semibold">Orders</div>
                  </div>
                </div>

                <div className="bg-black/6 rounded-lg p-4">
                  <div className="text-xs text-black-400">Revenue</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold">₹{fmt(stats.revenue)}</div>
                      <div className="text-sm text-black-400">Total revenue</div>
                    </div>
                    <div className="text-sm text-black-400">
                      {/* small sparkline */}
                      <svg width="90" height="36" viewBox="0 0 90 36" className="inline-block">
                        <path d={sparklinePath(stats.revenueSpark, 90, 36)} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-black/6 rounded-lg p-4">
                  <div className="text-xs text-black-400">Best Sellers</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold">{fmt(stats.bestSellerCount)}</div>
                      <div className="text-sm text-black-400">Marked best seller</div>
                    </div>
                    <div className="bg-green-500/10 text-emerald-400 rounded px-3 py-2 font-semibold">Top</div>
                  </div>
                </div>
              </div>

              {/* Two column: recent orders + recent products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <section className="bg-black/6 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Recent orders</h3>
                    <button onClick={() => navigate("/orders")} className="text-sm text-black-300 hover:underline">View all</button>
                  </div>

                  {stats.recentOrders.length === 0 ? (
                    <div className="text-black-400">No recent orders.</div>
                  ) : (
                    <ul className="space-y-3">
                      {stats.recentOrders.map((o) => {
                        const id = o._id ?? o.id ?? "—";
                        const name = o.customer?.name ?? o.shipping?.name ?? "Customer";
                        const total = Number(o.total ?? o.amount ?? o.grandTotal ?? 0);
                        const status = o.status ?? o.orderStatus ?? "Pending";
                        return (
                          <li key={id} className="flex items-center justify-between bg-black/5 rounded p-3">
                            <div>
                              <div className="font-semibold">{name}</div>
                              <div className="text-xs text-black-400">#{String(id).slice(-6)} • {new Date(o.createdAt ?? o.date ?? 0).toLocaleDateString()}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">₹{fmt(total)}</div>
                              <div className={`text-xs mt-1 ${status === "Delivered" ? "text-emerald-400" : status === "Cancelled" ? "text-red-400" : "text-black-400"}`}>{status}</div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>

                {/* Recent Products */}
                <section className="bg-black/6 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Recent products</h3>
                    <button onClick={() => navigate("/lists")} className="text-sm text-black-300 hover:underline">View all</button>
                  </div>

                  {stats.recentProducts.length === 0 ? (
                    <div className="text-black-400">No recent products.</div>
                  ) : (
                    <ul className="space-y-3">
                      {stats.recentProducts.map((p) => {
                        const id = p._id ?? p.id ?? p.name;
                        return (
                          <li key={id} className="flex items-center gap-3 bg-black/5 rounded p-3">
                            <div className="w-14 h-14 bg-black-700 rounded overflow-hidden">
                              {p.image1 ? <img src={p.image1} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-black/5" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-xs text-black-400">{p.category ?? "—"} • ₹{fmt(p.price ?? 0)}</div>
                            </div>
                            <div className="text-sm text-black-300">{new Date(p.createdAt ?? p.date ?? 0).toLocaleDateString()}</div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

