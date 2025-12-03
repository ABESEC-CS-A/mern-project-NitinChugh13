// controller/userController.js
import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";   // FIX: correct package for hashing (ESM compatible)

// =====================
// Your existing function
// =====================
export const getCurrentUser = async (req, res) => {
  try {
    let user = await userModel.findById(req.userID).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `getCurrentUser error ${error}` });
  }
};

// =====================
// Your existing function
// =====================
export const getAdmin = async (req, res) => {
  try {
    let adminEmail = req.adminEmail;
    if (!adminEmail) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({
      email: adminEmail,
      role: "admin",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `getAdmin error ${error}` });
  }
};

// =====================
// NEW: UPDATE PROFILE
// =====================
export const updateProfile = async (req, res) => {
  try {
    const id = req.userID;
    if (!id) return res.status(401).json({ message: "Unauthorized" });

    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Name and email are required" });

    const updated = await userModel
      .findByIdAndUpdate(
        id,
        { name, email },
        { new: true, runValidators: true }
      )
      .select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: updated });
  } catch (err) {
    console.log("updateProfile:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: `updateProfile error ${err}` });
  }
};

// ==========================
// NEW: UPDATE PASSWORD
// ==========================
export const updatePassword = async (req, res) => {
  try {
    const id = req.userID;
    if (!id) return res.status(401).json({ message: "Unauthorized" });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Missing fields" });

    const user = await userModel.findById(id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password || "");
    if (!match)
      return res.status(400).json({ message: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.log("updatePassword:", err);
    return res.status(500).json({ message: `updatePassword error ${err}` });
  }
};
