// src/pages/ProductDetails.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { shopDataContext } from "../context/ShopContext";
import { AuthDataContext } from "../context/AuthContext";
import Card from "../components/Card";

/**
 * ProductDetails.jsx
 *
 * - Shows product (loads from backend or from shopDataContext)
 * - Image gallery, qty, add-to-cart, buy-now, remove-from-cart
 * - Reviews list + submit review (POST to backend)
 * - Related products (category)
 *
 * Notes:
 * - Uses backend endpoints under /api/product/:id (singular)
 * - Requires shopDataContext to provide addToCart, removeFromCart, updateCartItemQty, cartItems
 */

function formatINR(value) {
  if (value == null || value === "") return "";
  const num = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]+/g, ""));
  if (Number.isNaN(num)) return value;
  return num.toLocaleString("en-IN");
}

function RatingStars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400" : "text-[#444]"}`}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
        >
          <path d="M10 1.5l2.6 5.27 5.8.84-4.2 4.09.99 5.77L10 14.9 4.81 17.47l.99-5.77L1.6 7.61l5.8-.84L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // shop context
  const {
    products = [],
    currency = "₹",
    addToCart: contextAddToCart,
    removeFromCart,
    updateCartItemQty,
    cartItems = [],
  } = useContext(shopDataContext) || {};

  const { serverUrl = "" } = useContext(AuthDataContext) || {};

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // reviews local
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, text: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(null);

  // find if product already in cart
  const cartItem = useMemo(() => {
    if (!product) return null;
    return cartItems.find((it) => String(it.id) === String(product._id || product.id));
  }, [cartItems, product]);

  // keep local qty in sync with cart item if present
  useEffect(() => {
    if (cartItem) setQty(Number(cartItem.qty || 1));
  }, [cartItem]);

  // fetch product from backend, otherwise fallback to context products
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        if (serverUrl) {
          const res = await axios.get(`${serverUrl}/api/product/${id}`);
          if (!mounted) return;
          setProduct(res.data?.product ?? res.data);
        } else {
          const fromContext = (products || []).find((p) => (p._id || p.id || p.name) === id);
          if (!mounted) return;
          setProduct(fromContext || null);
        }
      } catch (err) {
        if (!mounted) return;
        const fromContext = (products || []).find((p) => (p._id || p.id || p.name) === id);
        if (fromContext) {
          setProduct(fromContext);
        } else {
          setError("Product not found.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id, serverUrl, products]);

  // load reviews from backend if available
  useEffect(() => {
    let mounted = true;
    async function loadReviews() {
      if (!product) return;
      try {
        if (serverUrl) {
          const res = await axios.get(`${serverUrl}/api/product/${product._id || product.id}/reviews`);
          if (!mounted) return;
          setReviews(res.data?.reviews ?? res.data);
        } else {
          setReviews(product.reviews || []);
        }
      } catch (err) {
        setReviews(product.reviews || []);
      }
    }
    loadReviews();
    return () => (mounted = false);
  }, [product, serverUrl]);

  const related = useMemo(() => {
    if (!product) return [];
    return (products || []).filter((p) => p._id !== product._id && p.category === product.category).slice(0, 8);
  }, [product, products]);

  // handlers
  function changeQty(delta) {
    setQty((q) => {
      const next = q + delta;
      if (next < 1) return 1;
      if (product?.stock && next > product.stock) return product.stock;
      // if item is already in cart, update server/local cart quantity immediately
      if (cartItem && typeof updateCartItemQty === "function") {
        updateCartItemQty(product._id || product.id, next);
      }
      return next;
    });
  }

  function handleAddToCart() {
    const payload = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      qty,
      image: product.image1 || product.images?.[0] || product.image || "",
    };

    if (typeof contextAddToCart === "function") {
      contextAddToCart(payload);
    } else {
      window.dispatchEvent(new CustomEvent("addToCart", { detail: payload }));
    }
  }

  function handleRemoveFromCart() {
    const pid = product._id || product.id;
    if (typeof removeFromCart === "function") {
      removeFromCart(pid);
      // reset local qty
      setQty(1);
    } else {
      window.dispatchEvent(new CustomEvent("removeFromCart", { detail: { id: pid } }));
      setQty(1);
    }
  }

  function handleBuyNow() {
    handleAddToCart();
    navigate("/checkout", { state: { product, qty } });
  }

  function toggleWishlist() {
    setIsWishlisted((s) => !s);
    window.dispatchEvent(new CustomEvent("toggleWishlist", { detail: { id: product._id || product.id } }));
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewStatus(null);

    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      setReviewStatus({ ok: false, msg: "Please provide your name and review text." });
      return;
    }

    setReviewLoading(true);
    try {
      if (!serverUrl) {
        const newReview = {
          name: reviewForm.name,
          rating: reviewForm.rating,
          text: reviewForm.text,
          createdAt: new Date().toISOString(),
        };
        setReviews((r) => [newReview, ...r]);
        setReviewStatus({ ok: true, msg: "Review added (local only)." });
        setReviewForm({ name: "", rating: 5, text: "" });
      } else {
        const endpoint = `${serverUrl}/api/product/${product._id || product.id}/reviews`;
        const res = await axios.post(
          endpoint,
          {
            name: reviewForm.name,
            rating: reviewForm.rating,
            text: reviewForm.text,
          },
          { withCredentials: true }
        );

        if (res.data?.review) {
          setReviews((r) => [res.data.review, ...r]);
        } else {
          const rres = await axios.get(`${serverUrl}/api/product/${product._id || product.id}/reviews`);
          setReviews(rres.data?.reviews ?? rres.data);
        }

        setReviewStatus({ ok: true, msg: "Thank you — your review was submitted." });
        setReviewForm({ name: "", rating: 5, text: "" });
      }
    } catch (err) {
      setReviewStatus({ ok: false, msg: err?.response?.data?.message || "Failed to submit review." });
    } finally {
      setReviewLoading(false);
    }
  }

  // render states
  if (loading) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-slate-300">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-slate-300">{error || "Product not found."}</div>
      </div>
    );
  }

  // product exists
  const images = [product.image1, ...(product.images || []), product.image].filter(Boolean);
  const priceNum = Number(product.price || 0);
  const mrpNum = Number(product.mrp || 0);
  const showDiscount = mrpNum && mrpNum > priceNum;
  const discountPercent = showDiscount ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

  return (
    <main className="pt-28 pb-12 min-h-screen bg-gradient-to-b  from-[white]  text-black to-[#001a26] text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: images */}
          <div className="lg:col-span-1">
            <div className="rounded-lg overflow-hidden shadow-lg" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-full h-[60vw] sm:h-[400px] lg:h-[420px]  bg-black flex items-center justify-center">
                <img src={images[mainImageIdx] || images[0]} alt={product.name} className="max-w-full max-h-full object-contain" />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-black/50">
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImageIdx(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border ${idx === mainImageIdx ? "border-black" : "border-transparent"} bg-black/30`}
                    >
                      <img src={src} alt={`${product.name}-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: details */}
          <div className="lg:col-span-2">
            <div className="rounded-lg p-6" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-black">{product.name}</h1>
                  <div className="mt-2 flex items-center gap-3">
                    <RatingStars rating={product.rating || (product.avgRating || 0)} />
                    <div className="text-sm">·</div>
                    <div className="text-sm">{product.reviews?.length ?? reviews.length} reviews</div>
                    <div className="text-sm">·</div>
                    <div className="text-sm">{product.brand || product.seller || ""}</div>
                  </div>

                  <div className="mt-4 flex items-baseline gap-4">
                    <div className="text-2xl font-bold text-black">
                      {currency} {formatINR(priceNum)}
                    </div>
                    {showDiscount && (
                      <>
                        <div className="text-sm text-black line-through">{currency} {formatINR(mrpNum)}</div>
                        <div className="text-sm text-black font-semibold">{discountPercent}% off</div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 text-sm leading-relaxed text-black">
                    {product.description || product.shortDescription || "No description available for this product."}
                  </div>

                  {/* quantity + actions */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
                    <div className="flex items-center bg-black/30 border border-black/20 rounded-md overflow-hidden">
                      <button onClick={() => changeQty(-1)} className="px-3 py-2 text-lg" aria-label="Decrease quantity">-</button>
                      <div className="px-4 py-2 text-sm w-16 text-center">{qty}</div>
                      <button onClick={() => changeQty(1)} className="px-3 py-2 text-lg" aria-label="Increase quantity">+</button>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={handleAddToCart} className="px-5 py-3 bg-black text-white font-semibold rounded-md hover:brightness-95">
                        Add to Cart
                      </button>

                      <button onClick={handleBuyNow} className="px-5 py-3 bg-black border border-white/20 text-white font-semibold rounded-md">
                        Buy Now
                      </button>

                      <button onClick={toggleWishlist} className={`px-3 py-2 rounded-md border ${isWishlisted ? "bg-green-600 text-white" : "bg-black text-white border-black/10"}`} aria-pressed={isWishlisted}>
                        {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                      </button>
                    </div>
                  </div>

                  {/* SKU / stock */}
                  <div className="mt-4 text-sm text-black">
                    SKU: <span className="text-black">{product.sku || (product._id || product.id)}</span>
                    <span className="mx-3">·</span>
                    {product.stock ? <span>In stock: {product.stock}</span> : <span>Stock info not available</span>}
                  </div>

                  {/* cart info + remove */}
                  <div className="mt-4 flex items-center gap-4">
                    {cartItem ? (
                      <>
                        <div className="text-sm text-amber-100">In cart: <span className="font-semibold">{cartItem.qty}</span></div>
                        <button onClick={handleRemoveFromCart} className="text-sm px-3 py-1 rounded-md bg-red-600 text-shadow-black">Remove from Cart</button>
                      </>
                    ) : (
                      <div className="text-sm text-black">Not in cart</div>
                    )}
                  </div>

                  {/* share */}
                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={() => { navigator.clipboard?.writeText(window.location.href); alert("Product link copied to clipboard"); }} className="text-sm underline text-slate-100">Copy link</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-black">Customer Reviews</h3>

              {/* new review form */}
              <form onSubmit={submitReview} className="rounded-lg p-4" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.03))", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    name="name"
                    placeholder="Your name"
                    className="p-2 rounded-md bg-white/3 border border-white/5 text-white"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm((s) => ({ ...s, name: e.target.value }))}
                    disabled={reviewLoading}
                  />
                  <select
                    name="rating"
                    className="p-2 rounded-md bg-white/3 border border-white/5 text-slate-100"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm((s) => ({ ...s, rating: Number(e.target.value) }))}
                    disabled={reviewLoading}
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Terrible</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <button type="submit" disabled={reviewLoading} className="px-4 py-2 bg-yellow-300 text-black rounded-md">{reviewLoading ? "Sending..." : "Submit Review"}</button>
                    <button type="button" className="px-3 py-2 bg-transparent border border-white/5 rounded-md" onClick={() => { setReviewForm({ name: "", rating: 5, text: "" }); setReviewStatus(null); }} disabled={reviewLoading}>Reset</button>
                  </div>
                </div>

                <textarea
                  name="text"
                  placeholder="Write your review..."
                  className="w-full min-h-[80px] p-2 rounded-md bg-white/3 border border-white/5 text-slate-100 mt-3"
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm((s) => ({ ...s, text: e.target.value }))}
                  disabled={reviewLoading}
                />

                {reviewStatus && <div className={`text-sm ${reviewStatus.ok ? "text-emerald-400" : "text-rose-400"} mt-2`}>{reviewStatus.msg}</div>}
              </form>

              {/* reviews list */}
              <div className="mt-4 space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-black">No reviews yet. Be the first to review.</div>
                ) : (
                  reviews.map((r, i) => (
                    <div key={i} className="rounded-md p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white">{r.name}</div>
                          <div className="text-xs text-slate-300">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</div>
                        </div>
                        <RatingStars rating={r.rating} />
                      </div>
                      <div className="mt-2 text-sm text-slate-200">{r.text}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-white mb-4">Related products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.length === 0 ? (
              <div className="text-slate-300">No related products found.</div>
            ) : (
              related.map((rp) => {
                const img = rp.image1 || rp.images?.[0] || rp.image || "";
                return <Card key={rp._id || rp.id || rp.name} itemId={rp._id || rp.id} name={rp.name} image={img} price={rp.price} />;
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
