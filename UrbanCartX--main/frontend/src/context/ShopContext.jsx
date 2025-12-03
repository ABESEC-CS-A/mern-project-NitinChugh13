// src/context/ShopContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/UserContext.jsx";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const { serverUrl = "" } = useContext(AuthDataContext || {});
  const { userData } = useContext(UserDataContext || {});
  const userId = userData?._id ?? null;

  const cartKey = React.useMemo(() => `ucx_cart_v1_${userId ?? "guest"}`, [userId]);

  // products
  const [products, setProducts] = useState([]);

  // search UI state
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // currency + misc
  const currency = "₹";
  const delivery_fee = 40;

  // cartItems INIT — FIXED
  const [cartItems, setCartItems] = useState(() => {
    try {
      const userRaw = localStorage.getItem(`ucx_cart_v1_${userId ?? "guest"}`);
      const guestRaw = localStorage.getItem("ucx_cart_v1");

      if (userRaw) return JSON.parse(userRaw);
      if (guestRaw) return JSON.parse(guestRaw);

      return [];
    } catch {
      return [];
    }
  });

  // cart migration when user changes — unchanged
  useEffect(() => {
    try {
      const userStorageKey = `ucx_cart_v1_${userId ?? "guest"}`;
      const currentUserRaw = localStorage.getItem(userStorageKey);
      const guestRaw = localStorage.getItem("ucx_cart_v1");

      if (userId) {
        if (currentUserRaw) {
          setCartItems(JSON.parse(currentUserRaw));
        } else if (guestRaw) {
          localStorage.setItem(userStorageKey, guestRaw);
          setCartItems(JSON.parse(guestRaw));
        } else {
          setCartItems([]);
        }
      } else {
        if (guestRaw) setCartItems(JSON.parse(guestRaw));
        else setCartItems([]);
      }
    } catch (e) {
      console.error("Cart init/migrate error:", e);
    }
  }, [userId]);

  // fetch products
  const getProducts = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/product/all`);
      setProducts(result.data?.products ?? []);
    } catch (error) {
      console.log("Get Products error ", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [serverUrl]);

  // persist cart — FIXED
  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems, cartKey]);

  // derived
  const cartCount = useMemo(
    () => cartItems.reduce((s, it) => s + (Number(it.qty) || 0), 0),
    [cartItems]
  );
  const subtotal = useMemo(
    () => cartItems.reduce((s, it) => s + (Number(it.price || 0) * Number(it.qty || 0)), 0),
    [cartItems]
  );
  const delivery = cartItems.length ? delivery_fee : 0;
  const total = subtotal + delivery;

  // cart helpers
  const addToCart = (payload) => {
    if (!payload || !payload.id) return;
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => String(p.id) === String(payload.id));
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Number(next[idx].qty || 0) + Number(payload.qty || 1) };
        return next;
      }
      return [
        ...prev,
        {
          id: payload.id,
          name: payload.name,
          price: Number(payload.price || 0),
          qty: Number(payload.qty || 1),
          image: payload.image || "",
          meta: payload.meta || {},
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const updateCartItemQty = (id, qty) => {
    setCartItems((prev) =>
      prev
        .map((p) => (String(p.id) === String(id) ? { ...p, qty: Number(qty) } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  // placeOrder (unchanged)
  const placeOrder = async ({ customer, shipping, paymentMethod = "COD", notes = "", metadata = {} }) => {
    if (!serverUrl) return { ok: false, msg: "Server not configured" };
    if (!cartItems || cartItems.length === 0) return { ok: false, msg: "Cart is empty" };

    const payload = {
      customer,
      shipping,
      items: cartItems.map((it) => ({
        productId: it.id,
        name: it.name,
        qty: Number(it.qty || 1),
        price: Number(it.price || 0),
        image: it.image,
        size: it.size || "",
      })),
      subtotal,
      shippingCost: delivery,
      total,
      paymentMethod,
      notes,
      metadata,
    };

    try {
      const res = await axios.post(`${serverUrl}/api/order/create`, payload, { withCredentials: true });
      if (res.status === 201 && res.data?.order) {
        clearCart();
        return { ok: true, order: res.data.order };
      }
      return { ok: false, msg: res.data?.message || "Failed to place order" };
    } catch (err) {
      return { ok: false, msg: err?.response?.data?.message || err.message || "Server error" };
    }
  };

  const value = {
    products,
    setProducts,
    currency,
    delivery_fee,
    getProducts,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    cartCount,
    subtotal,
    delivery,
    total,
    addToCart,
    removeFromCart,
    updateCartItemQty,
    clearCart,
    placeOrder,
  };

  return <shopDataContext.Provider value={value}>{children}</shopDataContext.Provider>;
}

export default ShopContext;
