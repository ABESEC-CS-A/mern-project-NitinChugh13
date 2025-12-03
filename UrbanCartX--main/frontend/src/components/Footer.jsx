// src/components/Footer.jsx
import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const subscribe = (e) => {
    e.preventDefault();
    // simple validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus({ ok: false, msg: "Please enter a valid email." });
      return;
    }

    // Fire a custom event — replace this with real API call if you want
    window.dispatchEvent(new CustomEvent("newsletterSubscribe", { detail: { email } }));
    setStatus({ ok: true, msg: "Thanks — you’re subscribed!" });
    setEmail("");
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <footer className="border-t border-[#1b3a40] bg-gradient-to-t from-[#083038] via-[#0a3942] to-[#0d434d] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand + short */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-slate-900 flex items-center justify-center text-teal-300 font-bold">
                UC
              </div>
              <div>
                <div className="text-xl font-bold text-white">UrbanCartX</div>
                <div className="text-sm text-slate-300">Shop styles you’ll love — fast shipping, secure payments.</div>
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-300">
              © {new Date().getFullYear()} UrbanCartX. All rights reserved.
            </div>

            <div className="flex items-center gap-3 mt-4">
              <a href="https://facebook.com" aria-label="Facebook" className="p-2 rounded-md bg-[#071a1d] hover:bg-[#0f2b2f]">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="p-2 rounded-md bg-[#071a1d] hover:bg-[#0f2b2f]">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="p-2 rounded-md bg-[#071a1d] hover:bg-[#0f2b2f]">
                <FaTwitter />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className="p-2 rounded-md bg-[#071a1d] hover:bg-[#0f2b2f]">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/collections" className="hover:underline">Collections</a></li>
              <li><a href="/bestsellers" className="hover:underline">Best Sellers</a></li>
              <li><a href="/new" className="hover:underline">New Arrivals</a></li>
              <li><a href="/offers" className="hover:underline">Offers</a></li>
            </ul>
          </div>

          {/* Customer care */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/orders" className="hover:underline">My Orders</a></li>
              <li><a href="/returns" className="hover:underline">Returns & Refunds</a></li>
              <li><a href="/shipping" className="hover:underline">Shipping Info</a></li>
              <li><a href="/faq" className="hover:underline">Help Center</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Stay in the loop</h4>
            <p className="text-sm text-slate-300 mb-3">Sign up for exclusive deals & new arrivals.</p>

            <form onSubmit={subscribe} className="flex gap-2">
              <label htmlFor="footer-email" className="sr-only">Email</label>
              <div className="relative flex-1">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full py-2 px-3 rounded-md bg-[#07171a] border border-[#ffffff10] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <HiOutlineMail />
                </span>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-teal-400 text-black px-3 py-2 rounded-md font-medium hover:brightness-95"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>

            {status && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-3 text-sm ${status.ok ? "text-emerald-400" : "text-rose-400"}`}
              >
                {status.msg}
              </div>
            )}

            {/* payment & security area */}
            <div className="mt-6">
              <div className="text-xs text-slate-400 mb-2">We accept</div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-12 bg-white/10 rounded-md flex items-center justify-center text-xs">VISA</div>
                <div className="h-8 w-12 bg-white/10 rounded-md flex items-center justify-center text-xs">Master</div>
                <div className="h-8 w-12 bg-white/10 rounded-md flex items-center justify-center text-xs">UPI</div>
                <div className="h-8 w-12 bg-white/10 rounded-md flex items-center justify-center text-xs">NetBank</div>
              </div>
              <div className="mt-3 text-[12px] text-slate-400">Secure payments • PCI DSS compliant</div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 border-t border-[#ffffff10] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            <span className="mr-4">Terms & Conditions</span>
            <span className="mr-4">Privacy Policy</span>
            <span className="mr-4">Sitemap</span>
          </div>

          <div className="text-sm text-slate-400">
            Made with ❤️ by UrbanCartX — <span className="font-medium text-slate-200">Delivering joy since 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

