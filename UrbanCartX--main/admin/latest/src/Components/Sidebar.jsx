// src/Components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiUsers } from "react-icons/fi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import logo from "../assets/logo.png";

function Sidebar({ collapsedProp = undefined, onToggleProp = undefined }) {
  // If parent provides collapsedProp, use it; otherwise local state
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const collapsed = typeof collapsedProp === "boolean" ? collapsedProp : localCollapsed;

  // Keep local state in sync if parent changes
  useEffect(() => {
    if (typeof collapsedProp === "boolean") {
      setLocalCollapsed(collapsedProp);
    }
  }, [collapsedProp]);

  // mobile drawer state (always local)
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <RxDashboard className="text-lg" /> },
    { to: "/add", label: "Add Items", icon: <FiUsers className="text-lg" /> },
    {
      to: "/lists",
      label: "Lists",
      icon: <MdOutlineProductionQuantityLimits className="text-lg" />,
    },
    { to: "/Orders", label: "Orders", icon: <TbTruckDelivery className="text-lg" /> },
    { to: "/settings", label: "Settings", icon: <LuSettings className="text-lg" /> },
  ];

  const linkBase =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all";
  const inactive = "text-gray-300 hover:text-amber-400 hover:bg-white/5";
  const active = "bg-amber-500/10 text-amber-400 border border-amber-500/40";

  // Toggle handler: if parent provided onToggleProp use it, otherwise toggle local state
  const handleToggle = () => {
    if (typeof onToggleProp === "function") {
      onToggleProp();
    } else {
      setLocalCollapsed((c) => !c);
    }
  };

  return (
    <>
      {/* ====== MOBILE TOGGLE BUTTON ====== */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black/70 border border-white/20 rounded-full p-2 text-white shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="open sidebar"
      >
        ☰
      </button>

      {/* ====== MOBILE OVERLAY + DRAWER ====== */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 h-full w-64 bg-[#05070f]/95 border-r border-white/10 transform transition-transform duration-200 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-3 py-4">
            <div className="flex items-center gap-2">
              <img src={logo} className="h-8 w-8" alt="logo" />
              <span className="text-white font-semibold text-sm">
                UrbanCartX <span className="text-amber-400">Admin</span>
              </span>
            </div>
            <button
              className="text-gray-400 hover:text-amber-400 text-xl"
              onClick={() => setMobileOpen(false)}
              aria-label="close"
            >
              ✕
            </button>
          </div>

          <nav className="px-3 flex flex-col gap-1 mt-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? active : inactive}`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* ====== DESKTOP SIDEBAR ====== */}
      <div
        className={`
          hidden md:flex flex-col fixed top-0 left-0 h-screen bg-[#05070f]/95 backdrop-blur-xl border-r border-white/10
          transition-[width] duration-300 z-40
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-3 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} className="h-8 w-8" alt="logo" />
            {!collapsed && (
              <span className="text-white font-semibold">
                UrbanCartX <span className="text-amber-400">Admin</span>
              </span>
            )}
          </div>

          <button
            onClick={handleToggle}
            className="text-gray-400 hover:text-amber-400 text-xs border border-white/20 px-2 py-1 rounded"
            aria-label="toggle sidebar"
          >
            {/* Show arrow pointing inward when expanded and outward when collapsed */}
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* LINKS */}
        <nav className="px-3 flex flex-col gap-1 mt-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive} ${collapsed ? "justify-center" : ""}`
              }
            >
              <span className="text-xl">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className={`mt-auto px-3 py-3 border-t border-white/10`}>
          {!collapsed ? (
            <p className="text-[11px] text-gray-500">
              © {new Date().getFullYear()} UrbanCartX
              <br />
              <span className="text-gray-400">Admin Dashboard</span>
            </p>
          ) : (
            <p className="text-[10px] text-gray-500 text-center w-full">
              © {new Date().getFullYear()}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
