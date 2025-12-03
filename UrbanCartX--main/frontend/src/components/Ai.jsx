// src/components/Ai.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";

const DEFAULT_AVATAR = "/ai-agent.png";
const NAV_SPEAK_DELAY = 400;

const normalize = (s = "") =>
  String(s)
    .toLowerCase()
    .replace(/[-–—]/g, " ")
    .replace(/\b(please|hey|ok|okay|could you|would you|can you|would you)\b/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function findProduct(products = [], phrase = "") {
  if (!phrase) return null;
  const probe = phrase.toLowerCase().trim();
  const byId = products.find((p) => String(p._id || p.id) === probe);
  if (byId) return byId;
  const byName = products.find((p) => (p.name || "").toLowerCase().includes(probe));
  if (byName) return byName;
  const words = probe.split(/\s+/).filter(Boolean);
  return products.find((p) => words.every((w) => (p.name || "").toLowerCase().includes(w))) || null;
}

function speak(text) {
  try {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    window.speechSynthesis.speak(u);
  } catch (e) {
    // ignore
  }
}

export default function Ai({ avatarSrc = DEFAULT_AVATAR, size = 72 }) {
  const { products = [], setSearch, addToCart, removeFromCart, clearCart } =
    React.useContext(shopDataContext) || {};
  const navigate = useNavigate();

  const recogRef = useRef(null);
  const listeningRef = useRef(false);
  const [listening, setListening] = useState(false);

  // UI state: full placement info (top/bottom/left/right or 'auto')
  const [ui, setUi] = useState({
    btnSize: size,
    left: "auto",
    right: 20,
    top: "auto",
    bottom: 20,
  });

  // cart selectors to try find the cart element
  const CART_SELECTORS = [
    ".cart",
    ".cart-icon",
    ".cart-button",
    ".nav-cart",
    ".cart-wrapper",
    'button[aria-label*="cart"]',
    'a[aria-label*="cart"]',
    ".header-cart",
    ".cart-badge",
    "[data-testid='cart']",
  ];

  function findCartEl() {
    for (const sel of CART_SELECTORS) {
      try {
        const el = document.querySelector(sel);
        if (el) return el;
      } catch {}
    }
    const roleCart = document.querySelector('[role="button"][aria-label*="cart"],[role="link"][aria-label*="cart"]');
    if (roleCart) return roleCart;
    // fallback: scan for "cart" in classnames
    try {
      const all = Array.from(document.querySelectorAll("body *"));
      for (const el of all) {
        const cls = (el.className || "").toString().toLowerCase();
        if (cls.includes("cart") && el.offsetWidth > 8 && el.offsetHeight > 8) return el;
      }
    } catch {}
    return null;
  }

  // check if candidate placement (rect) overlaps cartRect or out-of-viewport
  function isOverlapOrOffscreen(candidateRect, cartRect) {
    // offscreen check
    if (
      candidateRect.left < 0 ||
      candidateRect.top < 0 ||
      candidateRect.right > window.innerWidth ||
      candidateRect.bottom > window.innerHeight
    ) {
      return true;
    }
    if (!cartRect) return false;
    // overlap?
    return !(
      candidateRect.right < cartRect.left ||
      candidateRect.left > cartRect.right ||
      candidateRect.bottom < cartRect.top ||
      candidateRect.top > cartRect.bottom
    );
  }

  // compute placement: tries RB -> LB -> RT -> LT
  useEffect(() => {
    let scheduled = null;

    function computePlacement() {
      // base size based on viewport
      const w = window.innerWidth;
      let btn = Math.round(size);
      if (w <= 360) btn = Math.max(44, Math.round(size * 0.66));
      else if (w <= 480) btn = Math.max(52, Math.round(size * 0.75));
      else if (w <= 768) btn = Math.max(56, Math.round(size * 0.85));
      else btn = size;

      // margins
      const margin = 14; // minimal distance from edges
      const marginLarge = 18;

      // find cart rect if present
      const cartEl = findCartEl();
      const cartRect = cartEl ? cartEl.getBoundingClientRect() : null;

      // helper to create candidate rect given placement
      // positions: right-bottom, left-bottom, right-top, left-top
      const candidates = [];

      // right-bottom
      const rb = {
        left: window.innerWidth - margin - btn,
        top: window.innerHeight - margin - btn,
        right: window.innerWidth - margin,
        bottom: window.innerHeight - margin,
      };
      candidates.push({ key: "rb", rect: rb, style: { left: "auto", right: margin, top: "auto", bottom: margin } });

      // left-bottom
      const lb = {
        left: margin,
        top: window.innerHeight - margin - btn,
        right: margin + btn,
        bottom: window.innerHeight - margin,
      };
      candidates.push({ key: "lb", rect: lb, style: { left: margin, right: "auto", top: "auto", bottom: margin } });

      // right-top
      const rt = {
        left: window.innerWidth - margin - btn,
        top: margin,
        right: window.innerWidth - margin,
        bottom: margin + btn,
      };
      candidates.push({ key: "rt", rect: rt, style: { left: "auto", right: margin, top: margin, bottom: "auto" } });

      // left-top
      const lt = {
        left: margin,
        top: margin,
        right: margin + btn,
        bottom: margin + btn,
      };
      candidates.push({ key: "lt", rect: lt, style: { left: margin, right: "auto", top: margin, bottom: "auto" } });

      // now pick first candidate that doesn't overlap and is within viewport
      let chosen = null;
      for (const cand of candidates) {
        if (!isOverlapOrOffscreen(cand.rect, cartRect)) {
          chosen = cand;
          break;
        }
      }

      // if none chosen, attempt to shrink a bit and try again (avoid overlap with small screens)
      if (!chosen) {
        const shrinkBtn = Math.max(Math.round(btn * 0.85), 40);
        const candidatesShrunk = [];

        candidatesShrunk.push({
          key: "rb-s",
          rect: {
            left: window.innerWidth - margin - shrinkBtn,
            top: window.innerHeight - margin - shrinkBtn,
            right: window.innerWidth - margin,
            bottom: window.innerHeight - margin,
          },
          style: { left: "auto", right: margin, top: "auto", bottom: margin },
          btnSize: shrinkBtn,
        });
        candidatesShrunk.push({
          key: "lb-s",
          rect: { left: margin, top: window.innerHeight - margin - shrinkBtn, right: margin + shrinkBtn, bottom: window.innerHeight - margin },
          style: { left: margin, right: "auto", top: "auto", bottom: margin },
          btnSize: shrinkBtn,
        });
        for (const cand of candidatesShrunk) {
          if (!isOverlapOrOffscreen(cand.rect, cartRect)) {
            chosen = cand;
            break;
          }
        }
        if (!chosen) {
          // final fallback: keep right-bottom but nudge up above cart if cart exists
          if (cartRect) {
            const aboveCartTop = cartRect.top - margin - btn;
            if (aboveCartTop >= margin) {
              chosen = {
                key: "rb-above-cart",
                rect: { left: window.innerWidth - margin - btn, top: aboveCartTop, right: window.innerWidth - margin, bottom: aboveCartTop + btn },
                style: { left: "auto", right: margin, top: Math.round(aboveCartTop), bottom: "auto" },
              };
            }
          }
        }
      }

      // prepare final ui object
      const newUi = { btnSize: btn, left: "auto", right: margin, top: "auto", bottom: margin };
      if (chosen) {
        newUi.left = chosen.style.left;
        newUi.right = chosen.style.right;
        newUi.top = chosen.style.top;
        newUi.bottom = chosen.style.bottom;
        if (chosen.btnSize) newUi.btnSize = chosen.btnSize;
      } else {
        // last resort: right-bottom but ensure it's in viewport (may overlap)
        newUi.left = "auto";
        newUi.right = margin;
        newUi.top = "auto";
        newUi.bottom = marginLarge;
      }

      // update only if changed
      setUi((prev) => {
        const changed =
          prev.btnSize !== newUi.btnSize ||
          prev.left !== newUi.left ||
          prev.right !== newUi.right ||
          prev.top !== newUi.top ||
          prev.bottom !== newUi.bottom;
        if (changed) return newUi;
        return prev;
      });
    }

    // schedule compute with debounce
    const deb = () => {
      if (scheduled) clearTimeout(scheduled);
      scheduled = setTimeout(computePlacement, 90);
    };

    computePlacement();

    window.addEventListener("resize", deb);
    const mo = new MutationObserver(deb);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener("resize", deb);
      mo.disconnect();
      if (scheduled) clearTimeout(scheduled);
    };
  }, [size, products]);

  // init speech recognition once
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) {
      recogRef.current = null;
      return;
    }
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.continuous = false;

    r.onresult = (ev) => {
      const txt = Array.from(ev.results).map((rs) => rs[0].transcript).join(" ").trim();
      handleCommand(txt);
    };
    r.onstart = () => {
      listeningRef.current = true;
      setListening(true);
    };
    r.onend = () => {
      listeningRef.current = false;
      setListening(false);
    };
    r.onerror = () => {
      listeningRef.current = false;
      setListening(false);
    };

    recogRef.current = r;
    return () => {
      try {
        r.onresult = null;
        r.onstart = null;
        r.onend = null;
        r.onerror = null;
        if (r.stop) r.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, setSearch, addToCart, removeFromCart, clearCart, navigate]);

  const toggleListening = useCallback(() => {
    const r = recogRef.current;
    if (!r) {
      speak("Voice recognition not available in this browser.");
      return;
    }
    if (listeningRef.current) {
      try { r.stop(); } catch {}
    } else {
      try { window.speechSynthesis.cancel(); r.start(); } catch (err) { speak("Could not start listening."); }
    }
  }, []);

  const handleKey = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleListening();
    }
  }, [toggleListening]);

  function dispatch(name, detail) {
    try { window.dispatchEvent(new CustomEvent(name, { detail })); } catch {}
  }

  async function handleCommand(raw) {
    if (!raw) { speak("I didn't catch that."); return; }
    const txt = normalize(raw);
    if (!txt) { speak("I didn't understand."); return; }

    // search
    if (/^(search|find)\b/.test(txt)) {
      const q = txt.replace(/^(search|find)\b( for)?\s*/, "").trim();
      if (q) {
        if (typeof setSearch === "function") setSearch(q);
        else dispatch("setSearch", { q });
        speak(`Searching for ${q}`);
        setTimeout(() => navigate("/collections", { state: { q } }), NAV_SPEAK_DELAY);
        return;
      }
    }

    // navigation
    if (/^(go to|navigate to|open|show)\b/.test(txt)) {
      const dest = txt.replace(/^(go to|navigate to|open|show)\b\s*/, "").trim();
      if (/^(home|main)$/.test(dest)) { speak("Going home"); setTimeout(() => navigate("/"), NAV_SPEAK_DELAY); return; }
      if (/^(collections|collection|shop|products|catalog)$/.test(dest)) { speak("Opening collections"); setTimeout(() => navigate("/collections"), NAV_SPEAK_DELAY); return; }
      if (/^(cart|bag)$/.test(dest)) { speak("Opening cart"); setTimeout(() => navigate("/cart"), NAV_SPEAK_DELAY); return; }
      if (/^(checkout)/.test(dest)) { speak("Opening checkout"); setTimeout(() => navigate("/checkout"), NAV_SPEAK_DELAY); return; }
      if (/^(orders|my orders)$/.test(dest)) { speak("Opening orders"); setTimeout(() => navigate("/orders"), NAV_SPEAK_DELAY); return; }
      if (/^(about|about us)$/.test(dest)) { speak("Opening about"); setTimeout(() => navigate("/about"), NAV_SPEAK_DELAY); return; }
      if (/^(contact|contact us)$/.test(dest)) { speak("Opening contact"); setTimeout(() => navigate("/contact"), NAV_SPEAK_DELAY); return; }
      const prod = findProduct(products, dest);
      if (prod) { speak(`Opening ${prod.name}`); setTimeout(() => navigate(`/productdetail/${prod._id || prod.id}`), NAV_SPEAK_DELAY); return; }
      speak(`I couldn't open ${dest}`); return;
    }

    // add to cart
    let m = txt.match(/^add\s+(\d+)\s+(.+?)\s*(to cart)?$/);
    if (m) {
      const qty = Number(m[1]) || 1;
      const name = m[2].trim();
      const prod = findProduct(products, name);
      if (!prod) { speak(`I couldn't find ${name}`); return; }
      const payload = { id: prod._id || prod.id, name: prod.name, price: prod.price, qty, image: prod.image1 || (prod.images?.[0]) || prod.image || "" };
      if (typeof addToCart === "function") addToCart(payload);
      else dispatch("addToCart", payload);
      speak(`${qty} ${prod.name} added to cart`); return;
    }
    m = txt.match(/^add\s+(.+?)(\s+to cart)?$/);
    if (m) {
      const name = m[1].trim();
      const prod = findProduct(products, name);
      if (!prod) { speak(`I couldn't find ${name}`); return; }
      const payload = { id: prod._id || prod.id, name: prod.name, price: prod.price, qty: 1, image: prod.image1 || (prod.images?.[0]) || prod.image || "" };
      if (typeof addToCart === "function") addToCart(payload);
      else dispatch("addToCart", payload);
      speak(`${prod.name} added to cart`); return;
    }

    // remove
    m = txt.match(/^remove\s+(\d+)\s+(.+)$/);
    if (m) {
      const qty = Number(m[1]) || 1;
      const name = m[2].trim();
      const prod = findProduct(products, name);
      if (!prod) { speak(`I couldn't find ${name}`); return; }
      if (typeof removeFromCart === "function") removeFromCart({ id: prod._id || prod.id, qty });
      else dispatch("removeFromCart", { id: prod._id || prod.id, qty });
      speak(`Removed ${qty} of ${prod.name} from cart`); return;
    }
    m = txt.match(/^remove\s+(.+)$/);
    if (m) {
      const name = m[1].trim();
      const prod = findProduct(products, name);
      if (!prod) { speak(`I couldn't find ${name}`); return; }
      if (typeof removeFromCart === "function") removeFromCart({ id: prod._id || prod.id, qty: 9999 });
      else dispatch("removeFromCart", { id: prod._id || prod.id, qty: 9999 });
      speak(`Removed ${prod.name} from cart`); return;
    }

    if (/^(clear cart|empty cart|remove all)/.test(txt)) {
      if (typeof clearCart === "function") clearCart();
      else dispatch("clearCart");
      speak("Cart cleared"); return;
    }

    if (/^(checkout|place order|pay now|pay)/.test(txt)) {
      speak("Opening checkout"); setTimeout(() => navigate("/checkout"), NAV_SPEAK_DELAY); return;
    }

    if (/^cart$/.test(txt)) { speak("Opening cart"); setTimeout(() => navigate("/cart"), NAV_SPEAK_DELAY); return; }
    if (/^home$/.test(txt)) { speak("Going home"); setTimeout(() => navigate("/"), NAV_SPEAK_DELAY); return; }

    const p = findProduct(products, txt);
    if (p) { speak(`Opening ${p.name}`); setTimeout(() => navigate(`/productdetail/${p._id || p.id}`), NAV_SPEAK_DELAY); return; }

    speak("Sorry, I did not understand that.");
  }

  const ringStyle = listening
    ? { boxShadow: `0 0 0 ${Math.round(ui.btnSize * 0.12)}px rgba(56,189,248,0.12), 0 0 0 ${Math.round(ui.btnSize * 0.24)}px rgba(56,189,248,0.06)` }
    : { boxShadow: "none" };

  // compute position style
  const posStyle = {};
  if (ui.left !== undefined && ui.left !== "auto") posStyle.left = ui.left;
  else posStyle.right = ui.right;
  if (ui.top !== undefined && ui.top !== "auto") posStyle.top = ui.top;
  else posStyle.bottom = ui.bottom;

  return (
    <button
      aria-pressed={listening}
      onClick={toggleListening}
      onKeyDown={handleKey}
      title={listening ? "Listening — click to stop" : "Click to talk to assistant"}
      style={{
        position: "fixed",
        ...posStyle,
        width: ui.btnSize,
        height: ui.btnSize,
        padding: 0,
        borderRadius: "9999px",
        border: "2px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
        zIndex: 999999,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 180ms ease, box-shadow 180ms ease, bottom 160ms ease, left 160ms ease, right 160ms ease, top 160ms ease",
        touchAction: "manipulation",
        ...ringStyle,
      }}
    >
      <img
        src={avatarSrc}
        alt="AI"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='%2322c1c3' offset='0'/><stop stop-color='%236a11cb' offset='1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)' rx='8'/><text x='50%' y='54%' font-size='36' text-anchor='middle' fill='white' font-family='sans-serif'>AI</text></svg>`
            );
        }}
      />
    </button>
  );
}
