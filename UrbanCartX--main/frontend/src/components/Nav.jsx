// src/components/Nav.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import logo from "../assets/logo.png";

import { FaSearch, FaShoppingCart, FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { CiShoppingCart } from "react-icons/ci";
import { MdCollectionsBookmark } from "react-icons/md";
import { IoMdContact } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";

import { UserDataContext } from "../context/UserContext";
import { AuthDataContext } from "../context/AuthContext";
import { shopDataContext } from "../context/ShopContext";

const Nav = () => {
  const { userData, setUserData } = useContext(UserDataContext);
  const { serverUrl } = useContext(AuthDataContext);

  // use search from shopDataContext
  const { showSearch, setShowSearch, search, setSearch , cartCount=0} = useContext(shopDataContext);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();

  const HandleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log("Server logout OK");
    } catch (err) {
      console.warn(
        "Logout request failed (continuing to clear client state):",
        err?.response ?? err
      );
    } finally {
      if (typeof setUserData === "function") setUserData(null);
      setShowProfile(false);
      navigate("/login");
    }
  };

  // run search: navigate to /collections and keep search in context
  const runSearch = (term) => {
    // ensure context has the latest value
    if (typeof setSearch === "function") setSearch(term ?? search ?? "");
    // if search panel visible on mobile, hide it
    if (showSearch) setShowSearch(false);
    // navigate to collections where the Collections component will pick the search from context
    navigate("/collections");
  };

  return (
    <>
      {/* MAIN TOP BAR */}
      <header className="fixed inset-x-0 top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        {/* First row: logo + search + right actions */}
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-3 sm:px-4 lg:px-6">
          {/* Left: Logo + name */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="UrbanCartX" className="h-8 w-8 rounded-md " />
            <span className="text-xl font-semibold tracking-tight text-slate-900">
              UrbanCartX
            </span>
          </div>

          {/* Center: search (desktop / tablet) */}
          <div className="hidden flex-1 md:flex">
            <div className="flex w-full items-center rounded-full bg-[#f3f7ff] px-4 py-2 shadow-inner focus-within:ring-2 focus-within:ring-slate-300">
              <FaSearch className="mr-3 h-5 w-5 text-slate-500" />
              <input
                value={search || ""}
                onChange={(e) => typeof setSearch === "function" && setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    runSearch(e.target.value);
                  }
                }}
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            {/* Mobile search icon */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 md:hidden"
              onClick={() => {
                // on mobile: toggle the small search row
                setShowSearch((prev) => !prev);
                // if toggling off and there's a search term, optionally navigate
              }}
            >
              <FaSearch className="h-5 w-5" />
            </button>

            {/* Profile wrapper (relative for dropdown) */}
            <div className="relative">
              {!userData && (
                <button
                  type="button"
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 border border-transparent hover:border-blue-500"
                >
                  <CgProfile className="h-5 w-5" />
                  <span className="hidden sm:inline">Login</span>
                  <span className="sm:hidden">Log in</span>
                  <span className="text-[10px]">▼</span>
                </button>
              )}

              {userData && (
                <button
                  type="button"
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-slate-800 border border-blue-500 hover:bg-blue-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold uppercase text-white">
                    {userData?.name?.slice(0, 1)}
                  </div>
                  <span className="hidden sm:inline">
                    {userData?.name?.split(" ")[0]}
                  </span>
                  <span className="text-[10px]">▼</span>
                </button>
              )}

              {/* Profile dropdown */}
              {showProfile && (
                <div className="absolute right-0 top-[110%] z-40 mt-2 w-56 rounded-xl bg-black text-white shadow-2xl">
                  <ul className="flex flex-col py-2.5 text-[15px]">
                    {userData && (
                      <li
                        className="w-full cursor-pointer px-4 py-2.5 hover:bg-[#2f2f2f]"
                        onClick={() => {
                          HandleLogout();
                          setShowProfile(false);
                        }}
                      >
                        Logout
                      </li>
                    )}

                    {!userData && (
                      <li
                        className="w-full cursor-pointer px-4 py-2.5 hover:bg-[#2f2f2f]"
                        onClick={() => {
                          navigate("/login");
                          setShowProfile(false);
                        }}
                      >
                        Login
                      </li>
                    )}

                    <li className="w-full cursor-pointer px-4 py-2.5 hover:bg-[#2f2f2f]" onClick={() => {
                      navigate("/orders");
                      setShowProfile(false);
                    }}>
                      Orders
                    </li>
                    <li className="w-full cursor-pointer px-4 py-2.5 hover:bg-[#2f2f2f]" onClick={() => {
                      navigate("/about");
                      setShowProfile(false);
                    }}>
                      About
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              type="button"
              className="relative flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white">
                {cartCount}
              </span>
            </button>

            {/* Become a Seller */}
            <button className="hidden items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100 md:flex" onClick={() => navigate("/become-seller")}>
              <span className="h-4 w-4 rounded-sm border border-slate-400" />
              <span>Become a Seller</span>
            </button>

            {/* More icon */}
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100">
              <HiOutlineDotsVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* SECOND ROW – category nav, prettier + responsive */}
        <div className="hidden md:block bg-linear-to-r from-[#f5f7ff] via-white to-[#f5f7ff] border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6">
            <ul className="flex h-11 items-center justify-center gap-3 sm:gap-6 text-sm font-medium text-slate-700">
              <li className="cursor-pointer rounded-full px-4 py-1.5 transition hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-md" onClick={() => navigate("/")}>
                HOME
              </li>
              <li className="cursor-pointer rounded-full px-4 py-1.5 transition hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-md"  onClick={() => navigate("/collections")}>
                COLLECTIONS
              </li>
              <li className="cursor-pointer rounded-full px-4 py-1.5 transition hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-md" onClick={() => navigate("/about")}>
                ABOUT
              </li>
              <li className="cursor-pointer rounded-full px-4 py-1.5 transition hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-md" onClick={() => navigate("/contact")}>
                CONTACT
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile search row (below top bar) */}
        {showSearch && (
          <div className="border-t border-slate-200 bg-[#f3f7ff] md:hidden">
            <div className="mx-auto flex h-12 max-w-6xl items-center px-3 sm:px-4 lg:px-6">
              <div className="flex w-full items-center rounded-full bg-white px-4 py-2 shadow-inner focus-within:ring-2 focus-within:ring-slate-300">
                <FaSearch className="mr-3 h-4 w-4 text-slate-500" />
                <input
                  value={search || ""}
                  onChange={(e) => typeof setSearch === "function" && setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      runSearch(e.target.value);
                    }
                  }}
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  className="ml-2 rounded-full bg-blue-600 px-3 py-1 text-white"
                  onClick={() => runSearch(search)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* BOTTOM MOBILE NAVBAR (unchanged) */}
      <nav className="fixed bottom-0 left-0 z-30 flex h-[72px] w-full items-center justify-between bg-[#191818] px-5 text-[11px] text-white md:hidden">
        <button className="flex flex-col items-center justify-center gap-[2px]" onClick={() => navigate("/")}>
          <FaHome className="h-6 w-6" />
          <span>Home</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-[2px]" onClick={() => navigate("/collections")}>
          <MdCollectionsBookmark className="h-6 w-6" />
          <span>Collections</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-[2px]" onClick={() => navigate("/contact")}>
          <IoMdContact className="h-6 w-6" />
          <span>Contact</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-[2px]" onClick={() => navigate("/cart")}>
          <CiShoppingCart className="h-6 w-6" />
          <span>Cart</span>
        </button>
      </nav>
    </>
  );
};

export default Nav;
