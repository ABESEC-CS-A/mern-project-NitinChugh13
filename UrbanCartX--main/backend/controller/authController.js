import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genrateToken , genrateToken1 } from "../config/token.js";

/**
 * Cookie options: for local dev use secure: false and sameSite: 'Strict' (no HTTPS).
 * In production (HTTPS) you should use secure: true and sameSite: 'None'.
 */
const cookieOptionsDev = {
  httpOnly: true,
  secure: true,      // false for localhost/dev. Set to true in production (HTTPS)
  sameSite: "none", // 'None' + secure:true is required for cross-site cookies in production
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashPassword });

    const token = genrateToken(user._id);
    res.cookie("token", token, cookieOptionsDev);

    // remove password before sending user object
    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(201).json({ user: userSafe });
  } catch (error) {
    console.error("SignUp error:", error);
    return res.status(500).json({ message: `Registration error: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user.password is null (e.g. created via Google) block password login:
    if (!user.password) {
      return res.status(400).json({ message: "This account uses social login. Use Google sign-in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = genrateToken(user._id);
    res.cookie("token", token, cookieOptionsDev);

    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({ user: userSafe });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

export const logout = async (req, res) => {
  try {
    // Match cookie options used when setting the cookie (secure/sameSite)
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,   // match cookieOptionsDev.secure
      sameSite: "none",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required from Google" });
    }

    let user = await User.findOne({ email });

    // create user if not exists (no password for social users)
    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email,
        password: null,
      });
    }

    const token = genrateToken(user._id);
    res.cookie("token", token, cookieOptionsDev);

    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({ user: userSafe, message: "Google login successful" });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: `Google login error: ${error.message}` });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    const token = genrateToken1(email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,      // dev = false, prod(https) = true
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: {
        email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res
      .status(500)
      .json({ success: false, message: `Admin login error: ${error.message}` });
  }
};

// ⬇️ add this at the end of authController.js

export const getCurrentUser = async (req, res) => {
  try {
    // isAuth middleware ne req.userID set kiya hoga
    if (!req.userID) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.userID).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    return res
      .status(500)
      .json({ message: `Get current user error: ${error.message}` });
  }
};



