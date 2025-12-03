import React, { useState, useContext, useEffect } from "react";
import Nav from "../Components/Nav";
import Sidebar from "../Components/Sidebar";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";

function Add() {
  // images
  const [images, setImages] = useState([]); // File objects
  const [Previews, setPreviews] = useState([]); // preview URLs

  // form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Top Wear");
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState("");
  const [bestseller, setBestseller] = useState(false);

  const { serverUrl } = useContext(authDataContext);

  // sidebar collapsed state (parent controlled)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // initialize collapsed based on screen width (optional)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("stock", stock);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      // all images under same key "images"
      images.forEach((file) => {
        formData.append("images", file);
      });

      const result = await axios.post(serverUrl + "/api/product/addproduct", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(result.data);

      if (result.data) {
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubcategory("Top Wear");
        setSizes([]);
        setStock("");
        setBestseller(false);
        setImages([]);
        setPreviews([]);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error adding product");
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files); // real Files for upload
    setPreviews(files.map((file) => URL.createObjectURL(file))); // for preview
  };

  return (
    <div className="w-full min-h-screen bg-[white] text-black overflow-x-hidden relative flex">
      {/* Controlled sidebar (pass props so parent controls collapse) */}
      <Sidebar collapsedProp={sidebarCollapsed} onToggleProp={() => setSidebarCollapsed((s) => !s)} />

      {/* Content wrapper animates margin when sidebar toggles */}
      <div
        className={`w-full transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:ml-16" : "md:ml-64"}`}
      >
        {/* Nav area: fixed height so content doesn't overlap */}
        <div className="sticky top-0 z-20 bg-[#0b0f19]/80 backdrop-blur-sm border-b border-white/5">
          <Nav />
        </div>

        {/* page content starts below nav; use padding top to separate */}
        <div className="p-6 md:p-8 lg:p-10 max-w-3xl mx-auto">
          <form
            onSubmit={handleAddProduct}
            className="w-full bg-black/6 backdrop-blur-xl border border-black/6 rounded-xl p-6 shadow-xl space-y-5"
          >
            <h2 className="text-2xl font-semibold text-amber-400 text-center">Add New Product</h2>

            {/* PRODUCT NAME */}
            <div>
              <label className="text-sm text-black-300">Product Name</label>
              <input
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter product name"
                className="w-full mt-1 px-4 py-2 bg-black/6 border border-black/10 rounded-lg outline-none focus:border-amber-400"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-black-300">Description</label>
              <textarea
                rows="3"
                required
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Enter description"
                className="w-full mt-1 px-4 py-2 bg-black/6 border border-black/10 rounded-lg outline-none focus:border-amber-400"
              ></textarea>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm text-black-300">Category</label>
              <select
                className="w-full mt-1 px-4 py-2 bg-black/6 border border-black/10 rounded-lg outline-none focus:border-amber-400 required"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                value={category}
              >
                <option>Clothing</option>
                <option>Accessories</option>
                <option>Electronics</option>
                <option>Footwear</option>
                <option>Beauty</option>
              </select>
            </div>

            {/* PRICE + STOCK */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label className="text-sm text-black-300">Price (₹)</label>
                <input
                  required
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  placeholder="Price"
                  className="w-full mt-1 px-4 py-2 bg-black/6 border border-black/10 rounded-lg outline-none focus:border-amber-400"
                />
              </div>

              <div className="w-full sm:w-1/2">
                <label className="text-sm text-black-300">Stock</label>
                <input
                  required
                  onChange={(e) => setStock(e.target.value)}
                  value={stock}
                  type="number"
                  placeholder="Quantity"
                  className="w-full mt-1 px-4 py-2 bg-black/6 border border-black/10 rounded-lg outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="text-sm text-black-300">Product Images</label>
              <input
                required
                type="file"
                multiple
                name="images"
                onChange={handleImages}
                className="w-full mt-1 text-sm text-black-300"
              />

              {/* Previews */}
              {Previews.length > 0 && (
                <div className="mt-3 flex gap-3 flex-wrap">
                  {Previews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-24 h-24 object-cover rounded-lg border border-black/10"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* SIZES */}
            <div>
              <label className="text-sm text-black-300">Sizes</label>

              <div className="flex flex-wrap gap-2 mt-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSizes((prev) =>
                        prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                      );
                    }}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      sizes.includes(size)
                        ? "bg-amber-500 text-black border-amber-500"
                        : "bg-black/6 text-black-300 border-black/10 hover:bg-black/10"
                    } transition`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {sizes.length > 0 && <p className="text-xs text-black-400 mt-1">Selected: {sizes.join(", ")}</p>}
            </div>

            {/* BESTSELLER */}
            <div className="flex items-center justify-between bg-black/5 border border-black/10 rounded-lg px-4 py-3">
              <span className="text-sm text-black-300">Add to Bestseller</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={bestseller} onChange={() => setBestseller(!bestseller)} />
                <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:bg-amber-500 transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-black/20 rounded-full peer-checked:translate-x-5 transition"></div>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Add;
