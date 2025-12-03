// src/pages/Collections.jsx
import React, { useContext, useMemo, useState, useEffect } from "react";
import { shopDataContext } from "../context/ShopContext";
import Card from "../components/Card";
import Title from "../components/Title";

function Collections() {
  const { products = [], search: contextSearch = "", setSearch } = useContext(shopDataContext);

  // UI state: keep local so input is responsive, but sync with context
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubcats, setActiveSubcats] = useState(new Set());
  const [sortType, setSortType] = useState("relevant");
  const [localSearch, setLocalSearch] = useState(contextSearch || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false);

  // keep localSearch synced with contextSearch when context changes (e.g. user searched from Nav)
  useEffect(() => {
    setLocalSearch(contextSearch || "");
  }, [contextSearch]);

  // whenever localSearch changes we also update context so Nav input shows the same term
  useEffect(() => {
    if (typeof setSearch === "function") setSearch(localSearch);
  }, [localSearch, setSearch]);

  // derive categories & subcategories from products defensively
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p?.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const subcategories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const sc = p?.subcategory || p?.subCategory || p?.sub_cat;
      if (sc) set.add(sc);
    });
    return Array.from(set);
  }, [products]);

  // price meta
  const { minProductPrice, maxProductPrice } = useMemo(() => {
    const prices = products.map((p) => Number(p?.price || 0)).filter(Boolean);
    const min = prices.length ? Math.min(...prices) : 0;
    const max = prices.length ? Math.max(...prices) : 0;
    return { minProductPrice: min, maxProductPrice: max };
  }, [products]);

  function toggleSubcat(name) {
    setActiveSubcats((prev) => {
      const copy = new Set(prev);
      if (copy.has(name)) copy.delete(name);
      else copy.add(name);
      return copy;
    });
  }

  function clearFilters() {
    setActiveCategory("All");
    setActiveSubcats(new Set());
    setMinPrice("");
    setMaxPrice("");
    setLocalSearch("");
    if (typeof setSearch === "function") setSearch("");
  }

  // filter + sort + search (uses localSearch which is synced with context)
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activeSubcats.size > 0) {
      list = list.filter((p) => {
        const sc = p?.subcategory || p?.subCategory || p?.sub_cat || "";
        return activeSubcats.has(sc);
      });
    }

    if ((localSearch || "").trim() !== "") {
      const q = (localSearch || "").trim().toLowerCase();
      list = list.filter((p) => (p?.name || "").toLowerCase().includes(q));
    }

    let min = Number(minPrice) || null;
    let max = Number(maxPrice) || null;
    if (min || max) {
      list = list.filter((p) => {
        const price = Number(p?.price || 0);
        if (min && max) return price >= min && price <= max;
        if (min) return price >= min;
        if (max) return price <= max;
        return true;
      });
    }

    switch (sortType) {
      case "low-high":
        list.sort((a, b) => (Number(a?.price || 0) - Number(b?.price || 0)));
        break;
      case "high-low":
        list.sort((a, b) => (Number(b?.price || 0) - Number(a?.price || 0)));
        break;
      case "newest":
        list.sort((a, b) => {
          const da = new Date(a?.createdAt || 0), db = new Date(b?.createdAt || 0);
          return db - da;
        });
        break;
      case "popular":
        list.sort((a, b) => (Number(b?.rating || 0) - Number(a?.rating || 0)));
        break;
      default:
      // relevant: keep server ordering
    }

    return list;
  }, [products, activeCategory, activeSubcats, localSearch, minPrice, maxPrice, sortType]);

  return (
    <section className="pt-28 px-4 sm:px-8 pb-12 min-h-screen bg-gradient-to-b  from-[white]  text-black to-[#001a26]">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* LEFT SIDEBAR (sticky) */}
        <aside className="hidden lg:block w-[260px] sticky top-28 self-start">
          <div className="text-black font-semibold mb-4">FILTERS</div>

          <div className="space-y-6">
            <div className="bg-black backdrop-blur border border-black rounded-lg p-4">
              <div className="text-sm font-semibold text-slate-200 mb-3">CATEGORIES</div>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-3 py-2 rounded-md transition ${
                      activeCategory === cat
                        ? "bg-[#16494f] text-white font-medium"
                        : "text-slate-200 bg-[#0b2230] hover:bg-[#062e34]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {subcategories.length > 0 && (
              <div className="bg-[#0b2230] border border-[#ffffff14] rounded-lg p-4">
                <div className="text-sm font-semibold text-slate-200 mb-3">SUB-CATEGORIES</div>
                <div className="flex flex-col gap-3 text-slate-200">
                  {subcategories.map((s) => (
                    <label key={s} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activeSubcats.has(s)}
                        onChange={() => toggleSubcat(s)}
                        className="w-4 h-4 rounded bg-white/10"
                      />
                      <span className="text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#0b2230] border border-[#ffffff14] rounded-lg p-4">
              <div className="text-sm font-semibold text-slate-200 mb-3">PRICE</div>

              <div className="flex items-center gap-2 mb-2 text-slate-300 text-sm">
                <input
                  type="number"
                  placeholder={minProductPrice ? `Min (${minProductPrice})` : "Min"}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 p-2 rounded-md bg-[#071a1d] border border-[#ffffff0d] text-white"
                />
                <input
                  type="number"
                  placeholder={maxProductPrice ? `Max (${maxProductPrice})` : "Max"}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 p-2 rounded-md bg-[#071a1d] border border-[#ffffff0d] text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded-md bg-[#0b5660] text-white text-sm"
                  onClick={() => {
                    // filters applied on re-render
                  }}
                >
                  Apply
                </button>
                <button
                  className="px-3 py-2 rounded-md bg-transparent border border-[#ffffff14] text-slate-200 text-sm"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN */}
        <main className="flex-1">
          {/* mobile filter toggle */}
          <div className="lg:hidden mb-4 flex items-center justify-between">
            <button
              onClick={() => setShowFiltersOnMobile((s) => !s)}
              className="px-4 py-2 rounded-md bg-[#0b2230] text-white border border-[#ffffff14]"
            >
              {showFiltersOnMobile ? "Hide Filters" : "Show Filters"}
            </button>
            <div className="text-slate-200 text-sm">Products: {filteredProducts.length}</div>
          </div>

          {/* Mobile filters panel (collapsible) */}
          {showFiltersOnMobile && (
            <div className="mb-6 space-y-4 lg:hidden">
              <div className="bg-[#0b2230] border border-[#ffffff14] rounded-lg p-4">
                <div className="text-sm font-semibold text-slate-200 mb-2">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        activeCategory === cat
                          ? "bg-[#16494f] text-white"
                          : "bg-[#07181a] text-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {subcategories.length > 0 && (
                <div className="bg-[#0b2230] border border-[#ffffff14] rounded-lg p-4">
                  <div className="text-sm font-semibold text-slate-200 mb-2">Sub Categories</div>
                  <div className="flex flex-col gap-2">
                    {subcategories.map((s) => (
                      <label key={s} className="flex items-center gap-2 text-slate-200">
                        <input
                          type="checkbox"
                          checked={activeSubcats.has(s)}
                          onChange={() => toggleSubcat(s)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HEADER ROW: Title + Sort */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-black">ALL COLLECTIONS</h2>

            <div className="flex items-center gap-3">
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="hidden md:inline-block px-3 py-2 rounded-md bg-[white] border border-black text-black outline-none"
              />

              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="px-3 py-2 rounded-md bg-[white] border border-black text-black"
              >
                <option value="relevant">Sort By: Relevant</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4
              gap-6
            "
          >
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-black py-10">No products found.</div>
            ) : (
              filteredProducts.map((item) => {
                const img = item.image1 || item.images?.[0] || item.image || "";
                const id = item._id || item.id || item.name;
                return (
                  <Card
                    key={id}
                    itemId={id}
                    name={item.name}
                    image={img}
                    price={item.price}
                    rating={item.rating}
                    reviewsCount={item.reviewsCount}
                    mrp={item.mrp}
                    isBestSeller={item.isBestSeller}
                    category={item.category}
                  />
                );
              })
            )}
          </div>
        </main>
      </div>
    </section>
  );
}

export default Collections;
