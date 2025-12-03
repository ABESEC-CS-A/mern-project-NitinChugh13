import jwt from "jsonwebtoken";

export const genrateToken = (userID) => {
  try {
    const token = jwt.sign(
      { id: userID },               // <-- CORRECT key/value
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return token;
  } catch (error) {
    console.log("token error: ", error.message);
    return null;
  }
};
//token for admin
export const genrateToken1 = (email) => {
  try {
    const token = jwt.sign(
      { email, role: "admin" },   // <- important
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return token;
  } catch (error) {
    console.log("token error: ", error.message);
    return null;
  }
};
