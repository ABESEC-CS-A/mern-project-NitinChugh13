// routes/userExtraRoutes.js
import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  getCurrentUser,
  updateProfile,
  updatePassword,
  getAdmin
} from "../controller/userController.js";

const router = express.Router();

// compatibility endpoints expected by frontend:
router.get("/me", isAuth, getCurrentUser);            // GET /api/user/me
router.get("/profile", isAuth, getCurrentUser);       // GET /api/user/profile (alias)
router.get("/admin", getAdmin);                       // optional (if you want /api/user/admin)
router.patch("/update", isAuth, updateProfile);       // PATCH /api/user/update
router.patch("/update-password", isAuth, updatePassword); // PATCH /api/user/update-password

export default router;