import React, { useState, useContext } from "react";
import logo from "../assets/logo.png";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../Context/AuthContext";
import { adminDataContext } from "../Context/AdminContext";


function Nav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

 const {serverUrl} = useContext(authDataContext)
 const { setAdminData } = useContext(adminDataContext);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setAdminData(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Logout failed");
    }
  };

  return (
    <nav className="w-full px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10 flex justify-between items-center sticky top-0 z-50">

      {/* LEFT - Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin")}>
        <img src={logo} className="h-8" alt="logo" />
        <span className="text-white font-semibold text-lg">
          UrbanCartX <span className="text-amber-400">Admin</span>
        </span>
      </div>

      {/* CENTER - Desktop Links */}
      <div className="hidden md:flex gap-8 text-gray-300 font-medium">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `hover:text-amber-400 transition ${isActive ? "text-amber-400" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `hover:text-amber-400 transition ${isActive ? "text-amber-400" : ""}`
          }
        >
         Add Items
        </NavLink>

        <NavLink
          to="/lists"
          className={({ isActive }) =>
            `hover:text-amber-400 transition ${isActive ? "text-amber-400" : ""}`
          }
        >
         Lists
        </NavLink>

        <NavLink
          to="/Orders"
          className={({ isActive }) =>
            `hover:text-amber-400 transition ${isActive ? "text-amber-400" : ""}`
          }
        >
          Orders
        </NavLink>
      </div>

      {/* RIGHT - Actions */}
      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* MOBILE MENU BUTTON */}
      <button className="md:hidden text-white text-2xl" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-black/60 backdrop-blur-xl border-b border-white/10 flex flex-col items-start p-6 gap-4 md:hidden">

          <NavLink
            to="/admin"
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-amber-400"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/add"
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-amber-400"
          >
           ADD ITEMS
          </NavLink>

          <NavLink
            to="/lists"
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-amber-400"
          >
            Lists
          </NavLink>

          <NavLink
            to="/Orders"
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-amber-400"
          >
            Orders
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Nav;

