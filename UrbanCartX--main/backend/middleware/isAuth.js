import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: your token stores { id: userID }
    req.userID = decoded.id;
    req.userEmail = decoded.email;

    if (!req.userID) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    console.log("Auth Error:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default isAuth;
