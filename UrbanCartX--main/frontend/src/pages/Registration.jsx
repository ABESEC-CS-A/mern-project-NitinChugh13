import React, { useState, useContext } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { signInWithPopup  } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase.js";
// at top of Registration.jsx
import { UserDataContext } from "../context/UserContext.jsx";




function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { serverUrl } = useContext(AuthDataContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userData, getCurrentUser } = useContext(UserDataContext);


  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic front-end validation
    if (!name.trim() || !email.trim() || !password) {
      alert("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
    };

    setLoading(true);
    try {
      // NOTE: removed withCredentials while debugging. If your backend requires cookies,
      // re-add withCredentials: true and ensure the server allows credentials in CORS.
      const result = await axios.post(`${serverUrl}/api/auth/registration`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      console.log("Registration result:", result.data);
      // navigate to login on success
      getCurrentUser();
      navigate("/");
    } catch (error) {
      // Helpful logging to see what backend returned
      console.error("Error while registration:", error);
      console.error("status:", error.response?.status);
      console.error("response data:", error.response?.data);
      // show friendly message
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Registration failed. Check console/network for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth , provider);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;
      const result = await axios.post(`${serverUrl}/api/auth/google`, { name, email }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log("Google login result:", result.data);
        getCurrentUser();
        navigate("/");
      // navigate to login on success
      navigate("/login", {
        state: {
          user: result.data.user,
        },
      })
    } catch (error) {
      console.error("Error while google login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 flex flex-col px-4 relative">
      {/* Logo (Top Left Corner) */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <img
          onClick={() => navigate("/")}
          src={logo}
          alt="UrbanCartX"
          className="h-10 w-auto drop-shadow-lg cursor-pointer"
        />
        <span className="text-white text-xl font-semibold tracking-wide">UrbanCartX</span>
      </div>

      {/* Centered Card */}
      <div className="w-full flex justify-center items-center flex-1">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Title */}
          <h2 className="text-center text-3xl font-bold text-white tracking-wide">Registration Page</h2>
          <p className="text-center text-gray-300 text-sm mt-2 mb-6">Welcome to UrbanCartX, Place your order</p>

          {/* Google Button */}
          <button
            type="button"
            onClick={googleSignUp}
            className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium py-3 rounded-lg transition border border-white/30 mb-4"
          >
            <FcGoogle className="text-2xl" />
            Registration with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center">
            <div className="border-t border-white/30 w-1/3"></div>
            <span className="mx-2 text-gray-300 text-sm">OR</span>
            <div className="border-t border-white/30 w-1/3"></div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSignUp} noValidate>
            {/* Username */}
            <div>
              <label className="text-gray-200 text-sm block mb-1">UserName</label>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter username"
                autoComplete="name"
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-200 text-sm block mb-1">Email</label>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-200 text-sm block mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 outline-none transition pr-10"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-3 cursor-pointer text-gray-300 text-xl"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-lg transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            {/* Login */}
            <p className="text-center text-gray-300 text-sm mt-4">
              You already have an account?{" "}
              <span
                className="text-orange-400 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;
