import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Nav from "../Components/Nav";
import Sidebar from "../Components/Sidebar";
import { authDataContext } from "../Context/AuthContext";

function Lists() {
  const { serverUrl } = useContext(authDataContext);

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // parent-controlled collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // initialize collapsed based on screen width (optional)
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarCollapsed(true);
    else setSidebarCollapsed(false);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${serverUrl}/api/product/all`, {
          withCredentials: true,
        });
        const list = res.data.products || [];
        setProducts(list);
        setFiltered(list);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.response?.data?.message || "Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (serverUrl) fetchProducts();
  }, [serverUrl]);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.subCategory?.toLowerCase().includes(term)
      )
    );
  }, [search, products]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${serverUrl}/api/product/delete/${id}`, { withCredentials: true });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[white] text-black overflow-x-hidden relative flex">
      {/* Sidebar controlled by parent: pass collapsedProp and handler */}
      <Sidebar collapsedProp={sidebarCollapsed} onToggleProp={() => setSidebarCollapsed((s) => !s)} />

      {/* Main content: it smoothly shifts using transition-all */}
      <div className={`w-full transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:ml-16" : "md:ml-64"} pt-0`}>
        {/* Nav inside this wrapper to avoid overlap */}
        <div className="sticky top-0 z-20 bg-[#0b0f19]/80 backdrop-blur-sm border-b border-white/5">
          <Nav />
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">Products List</h1>
              <p className="text-sm text-black-300 mt-1">Manage all products added to UrbanCartX.</p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-black/10 bg-white/5 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-3 py-1 text-sm text-black-200">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
              <span>Total products:</span>
              <span className="font-semibold text-black">{products.length}</span>
            </div>
          </div>

          {/* grid */}
          {loading ? (
            <div className="h-40 flex items-center justify-center text-gray-300">Loading...</div>
          ) : error ? (
            <div className="text-red-400 bg-red-900/10 p-3 rounded">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-300 p-6 bg-white/5 rounded">No products</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <div key={item._id} className="bg-white rounded-lg overflow-hidden text-slate-900 shadow">
                  <div className="relative pt-[60%]">
                    {item.image1 && (
                      <img src={item.image1} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {item.bestSeller && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">BEST SELLER</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="font-semibold text-emerald-600">₹{item.price}</div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400">Added: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</div>
                      <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lists;
