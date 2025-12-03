// authRoutes.js
import express from "express";
import {
  login,
  logout,
  registration,
  googleLogin,
  adminLogin,
  getCurrentUser,     // ⬅️ add this
} from "../controller/authController.js";
import isAuth from "../middleware/isAuth.js"; // ⬅️ import middleware

const authRoutes = express.Router();

authRoutes.post("/registration", registration);
authRoutes.post("/login", login);
authRoutes.post("/google", googleLogin);
authRoutes.get("/logout", logout);
authRoutes.post("/adminlogin", adminLogin);

// ⭐ NEW: current user route for frontend
authRoutes.get("/getcurrentuser", isAuth, getCurrentUser);

export default authRoutes;

