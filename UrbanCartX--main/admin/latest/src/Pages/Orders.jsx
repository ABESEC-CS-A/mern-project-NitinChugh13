// src/Pages/Orders.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import Nav from "../Components/Nav";
import { authDataContext } from "../Context/AuthContext";

/**
 * Orders page for admin
 * - Fetches /api/order/all
 * - PATCH /api/order/update/:id to update status
 * - DELETE /api/order/delete/:id to delete/cancel
 *
 * Adjust endpoints if your backend uses different routes.
 */

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function Orders() {
  const { serverUrl } = useContext(authDataContext);

  // sidebar control (same pattern as Add/Lists)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  }, []);

  // orders data
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI controls
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // newest/oldest/amount-asc/amount-desc

  // pagination (client-side)
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // modal for order details
  const [openOrder, setOpenOrder] = useState(null);

  // fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${serverUrl}/api/order/admin/all`, { withCredentials: true });
        // support both res.data.orders or res.data
        const list = res.data?.orders ?? res.data ?? [];
        setOrders(Array.isArray(list) ? list : []);
        setFiltered(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (serverUrl) fetchOrders();
  }, [serverUrl]);

  // filtering + searching + sorting
  useEffect(() => {
    let tmp = [...orders];

    // status filter
    if (statusFilter !== "All") {
      tmp = tmp.filter((o) => {
        // try common keys: status, orderStatus
        const s = (o.status ?? o.orderStatus ?? "").toString();
        return s.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      tmp = tmp.filter((o) => {
        // match id, customer name, email, phone
        const id = (o._id ?? o.id ?? "").toString().toLowerCase();
        const name =
          (o.customer?.name ?? o.shipping?.name ?? o.name ?? "").toString().toLowerCase();
        const email = (o.customer?.email ?? o.email ?? "").toString().toLowerCase();
        const phone = (o.customer?.phone ?? o.phone ?? "").toString().toLowerCase();
        return id.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q);
      });
    }

    // sort
    tmp.sort((a, b) => {
      if (sortBy === "newest") {
        const ta = new Date(a.createdAt ?? a.date ?? a.created_at ?? 0).getTime();
        const tb = new Date(b.createdAt ?? b.date ?? b.created_at ?? 0).getTime();
        return tb - ta;
      }
      if (sortBy === "oldest") {
        const ta = new Date(a.createdAt ?? a.date ?? a.created_at ?? 0).getTime();
        const tb = new Date(b.createdAt ?? b.date ?? b.created_at ?? 0).getTime();
        return ta - tb;
      }
      if (sortBy === "amount-asc") {
        const aa = Number(a.total ?? a.amount ?? a.grandTotal ?? 0);
        const ab = Number(b.total ?? b.amount ?? b.grandTotal ?? 0);
        return aa - ab;
      }
      if (sortBy === "amount-desc") {
        const aa = Number(a.total ?? a.amount ?? a.grandTotal ?? 0);
        const ab = Number(b.total ?? b.amount ?? b.grandTotal ?? 0);
        return ab - aa;
      }
      return 0;
    });

    setFiltered(tmp);
    setPage(1);
  }, [orders, search, statusFilter, sortBy]);

  // pagination helpers
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // update order status
  const updateStatus = async (orderId, newStatus) => {
    // optimistic
    const prev = orders.slice();
    setOrders((curr) => curr.map((o) => (o._id === orderId || o.id === orderId ? { ...o, status: newStatus } : o)));

    try {
      await axios.patch(`${serverUrl}/api/order/update/${orderId}`, { status: newStatus }, { withCredentials: true });
      // success -> no-op (we already updated)
    } catch (err) {
      console.error("Failed to update status:", err);
      setError(err.response?.data?.message || "Failed to update order status");
      // revert
      setOrders(prev);
    }
  };

  // delete/cancel order
  const handleDelete = async (orderId) => {
    if (!window.confirm("Delete this order? This cannot be undone.")) return;
    try {
      await axios.delete(`${serverUrl}/api/order/delete/${orderId}`, { withCredentials: true });
      setOrders((prev) => prev.filter((o) => o._id !== orderId && o.id !== orderId));
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // helper format
  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleDateString() + " " + dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const calcTotal = (o) => {
    return Number(o.total ?? o.amount ?? o.grandTotal ?? 0);
  };

  return (
    <div className="w-full min-h-screen bg-[white] text-black overflow-x-hidden relative flex">
      <Sidebar collapsedProp={sidebarCollapsed} onToggleProp={() => setSidebarCollapsed((s) => !s)} />

      <div className={`w-full transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:ml-16" : "md:ml-64"} pt-0`}>
        <div className="sticky top-0 z-20 bg-[#0b0f19]/80 backdrop-blur-sm border-b border-white/5">
          <Nav />
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-amber-400 ">Orders</h1>
              <p className="text-sm text-black  text-opacity-60 mt-1">Manage customer orders, update status, and view details.</p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto items-center text-black">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order id, name or email..."
                className="w-full sm:w-80 px-3 py-2 rounded-lg bg-black/5 border border-black/10 placeholder:text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-[black]">
                <option value="All">All</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="amount-desc">Amount: High → Low</option>
                <option value="amount-asc">Amount: Low → High</option>
              </select>
            </div>
          </div>

          {/* stats */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-black/5 px-3 py-1 text-sm text-black">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
              <span>Total orders:</span>
              <span className="font-semibold text-black">{orders.length}</span>
              <span className="text-black">| Showing {filtered.length} matching</span>
            </div>
          </div>

          {/* content */}
          {loading ? (
            <div className="h-48 flex items-center justify-center text-black">Loading orders...</div>
          ) : error ? (
            <div className="text-red-400 bg-red-900/10 p-3 rounded">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-black p-6 bg-black/5 rounded">No orders found.</div>
          ) : (
            <>
              {/* orders list/table */}
              <div className="grid gap-4 md:gap-6">
                {pageItems.map((o) => {
                  const id = o._id ?? o.id ?? "—";
                  const status = o.status ?? o.orderStatus ?? "Pending";
                  const customerName = o.customer?.name ?? o.shipping?.name ?? o.name ?? "Customer";
                  const email = o.customer?.email ?? o.email ?? "";
                  const total = calcTotal(o);

                  return (
                    <div key={id} className="bg-black/5 border border-black/10 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 text-xs text-black">
                          <div className="font-semibold">#{String(id).slice(-6)}</div>
                          <div className="text-xs text-black">{formatDate(o.createdAt ?? o.date)}</div>
                        </div>

                        <div>
                          <div className="font-semibold text-black">{customerName}</div>
                          <div className="text-sm text-black">{email}</div>
                          <div className="text-sm text-black">Items: {(o.items ?? o.cart ?? []).length ?? 0}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold text-emerald-400">₹{total}</div>

                        <select
                          value={status}
                          onChange={(e) => updateStatus(id, e.target.value)}
                          className={`px-3 py-1 rounded-lg bg-black/5 border border-black/10 text-sm ${
                            status === "Cancelled" ? "text-red-400" : status === "Delivered" ? "text-emerald-400" : "text-black"
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => setOpenOrder(o)}
                          className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-black text-sm"
                        >
                          View
                        </button>

                        <button onClick={() => handleDelete(id)} className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-black text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  Showing {(page - 1) * PER_PAGE + 1} - {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-white/6 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <div className="px-3 py-1 bg-white/6 rounded">{page}</div>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded bg-white/6 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Order detail modal */}
        {openOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div>
                  <div className="text-sm text-gray-500">Order</div>
                  <div className="font-semibold">{openOrder._id ?? openOrder.id}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">Status</div>
                  <select
                    value={openOrder.status ?? openOrder.orderStatus ?? "Pending"}
                    onChange={(e) => {
                      const ns = e.target.value;
                      setOpenOrder((o) => ({ ...o, status: ns }));
                      // also update backend & local list
                      updateStatus(openOrder._id ?? openOrder.id, ns);
                    }}
                    className="px-2 py-1 rounded bg-white/5 border"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => setOpenOrder(null)} className="px-3 py-1 rounded bg-red-500 text-white">Close</button>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
                <section>
                  <h3 className="text-sm font-semibold text-gray-700">Customer</h3>
                  <div className="text-sm text-gray-600">{openOrder.customer?.name ?? openOrder.shipping?.name ?? "-"}</div>
                  <div className="text-sm text-gray-500">{openOrder.customer?.email ?? openOrder.email ?? "-"}</div>
                  <div className="text-sm text-gray-500">{openOrder.customer?.phone ?? "-"}</div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-gray-700 mt-3">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    {openOrder.shipping?.address ?? openOrder.address ?? "—"}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-gray-700 mt-3">Items</h3>
                  <div className="space-y-2">
                    {(openOrder.items ?? openOrder.cart ?? []).map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 border rounded p-2">
                        <img src={it.image ?? it.img ?? it.image1} alt={it.name} className="w-14 h-14 object-cover rounded" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{it.name ?? it.title}</div>
                          <div className="text-xs text-gray-500">Qty: {it.qty ?? it.quantity ?? it.count ?? 1}</div>
                        </div>
                        <div className="text-sm font-semibold">₹{Number(it.price ?? it.unitPrice ?? 0)}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-3">
                  <h3 className="text-sm font-semibold text-gray-700">Payment</h3>
                  <div className="text-sm text-gray-600">Method: {openOrder.paymentMethod ?? openOrder.method ?? "—"}</div>
                  <div className="text-sm text-gray-600">Paid: {openOrder.isPaid ? "Yes" : "No"}</div>
                </section>

                <section className="mt-3">
                  <h3 className="text-sm font-semibold text-gray-700">Totals</h3>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Subtotal</div>
                    <div className="text-sm font-semibold">₹{Number(openOrder.subtotal ?? openOrder.itemsTotal ?? openOrder.amount ?? 0)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Shipping</div>
                    <div className="text-sm font-semibold">₹{Number(openOrder.shippingCost ?? openOrder.shipping_fee ?? 0)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Grand Total</div>
                    <div className="text-sm font-semibold">₹{Number(openOrder.total ?? openOrder.amount ?? openOrder.grandTotal ?? 0)}</div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;

