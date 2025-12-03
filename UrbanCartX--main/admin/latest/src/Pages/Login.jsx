// src/pages/Login.jsx  (admin side)
import React, { useState, useContext } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { adminDataContext } from "../Context/AdminContext";
import { authDataContext } from "../Context/AuthContext";


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const {serverUrl} = useContext(authDataContext)
  let {adminData , getAdmin} = useContext(adminDataContext)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter admin email and password");
      return;
    }

    const payload = { email: email.trim(), password };

    setLoading(true);
    try {
      // adjust URL to match your backend route for adminLogin()
      const res = await axios.post(
        `${serverUrl}/api/auth/adminlogin`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Admin login success:", res.data);

      // redirect to admin dashboard (change path if needed)
      getAdmin()
      navigate("/");
    } catch (error) {
      console.error("Admin login error:", error);
      console.error("status:", error.response?.status);
      console.error("response data:", error.response?.data);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Admin login failed. Please check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  // const adminLogin = async (e)=>{
  //   e.preventDefault();
  //   try {
  //    const result = await axios.post(serverUrl + '/api/auth/adminlogin',{email,password} , {withCredentials: true});
  //    console.log(result.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col px-4 relative">
      {/* Logo Top Left */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <img
          src={logo}
          alt="UrbanCartX"
          className="h-9 w-auto drop-shadow-lg cursor-pointer"
          onClick={() => navigate("/")}
        />
        <span className="text-white text-lg font-semibold tracking-wide">
          UrbanCartX <span className="text-amber-400">Admin</span>
        </span>
      </div>

      {/* Center Card */}
      <div className="w-full flex justify-center items-center flex-1">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-8 shadow-2xl">
          {/* Title */}
          <h2 className="text-center text-3xl font-bold text-white tracking-wide">
            Admin Login
          </h2>
          <p className="text-center text-gray-300 text-sm mt-2 mb-6">
            Sign in to manage the UrbanCartX dashboard
          </p>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleAdminLogin} noValidate>
            {/* Email */}
            <div>
              <label className="text-gray-200 text-sm block mb-1">
                Admin Email
              </label>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter admin email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-200 text-sm block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition pr-10"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-3 cursor-pointer text-gray-300 text-xl"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>
              </div>
            </div>

            {/* Small hint */}
            <p className="text-xs text-gray-400">
              Use the admin credentials set in your <code>.env</code> file.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg shadow-lg transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
