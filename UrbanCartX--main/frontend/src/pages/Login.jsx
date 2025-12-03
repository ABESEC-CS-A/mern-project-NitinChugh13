import React, { useState, useContext } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { signInWithPopup  } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase.js";
import { UserDataContext } from "../context/UserContext.jsx";
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { serverUrl } = useContext(AuthDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getCurrentUser } = useContext(UserDataContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter email and password");
      return;
    }

    const payload = { email: email.trim(), password };

    setLoading(true);
    try {
      // If your backend requires cookies for session, add { withCredentials: true } here.
      const res = await axios.post(`${serverUrl}/api/auth/login`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      console.log("Login success:", res.data);
      getCurrentUser();
      navigate("/");

      // If your backend returns a token or user, you can save it here (context/localStorage)
      // e.g. authContext.setUser(res.data.user) or localStorage.setItem('token', res.data.token)

      navigate("/"); // redirect on success (adjust as needed)
    } catch (error) {
      console.error("Login error:", error);
      console.error("status:", error.response?.status);
      console.error("response data:", error.response?.data);

      // Friendly messaging based on server response
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Login failed. Check console/network for details.");
      }
    } finally {
      setLoading(false);
    }
  };
    const googleLogin = async () => {
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
      // navigate("/login", {
      //   state: {
      //     user: result.data.user,
      //   },
      // })
    } catch (error) {
      console.error("Error while google login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 flex flex-col px-4 relative">
      {/* Logo Top Left */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <img
          src={logo}
          alt="UrbanCartX"
          className="h-10 w-auto drop-shadow-lg cursor-pointer"
          onClick={() => navigate("/")}
        />
        <span className="text-white text-xl font-semibold tracking-wide">UrbanCartX</span>
      </div>

      {/* Center Card */}
      <div className="w-full flex justify-center items-center flex-1">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Title */}
          <h2 className="text-center text-3xl font-bold text-white tracking-wide">Login</h2>
          <p className="text-center text-gray-300 text-sm mt-2 mb-6">Welcome back to UrbanCartX</p>

          {/* Google Login */}
          <button
            onClick={googleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium py-3 rounded-lg transition border border-white/30"
          >
            <FcGoogle className="text-2xl" />
            Login with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center">
            <div className="border-t border-white/30 w-1/3"></div>
            <span className="mx-2 text-gray-300 text-sm">OR</span>
            <div className="border-t border-white/30 w-1/3"></div>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleLogin} noValidate>
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

            {/* Forgot Password */}
            <div className="text-right">
              <span className="text-sm text-orange-400 hover:underline cursor-pointer">Forgot Password?</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-lg transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register */}
            <p className="text-center text-gray-300 text-sm mt-4">
              Don't have an account?{" "}
              <span
                className="text-orange-400 cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
