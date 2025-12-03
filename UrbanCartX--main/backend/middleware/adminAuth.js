import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

       if(!token){
        return res.status(401).json({ message: "No token found" });
       }
       let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
       if(!verifyToken){
        return res.status(400).json({message:"Invalid token"});
       }
       req.adminEmail = process.env.ADMIN_EMAIL;
       next();
    } catch (error) {
        console.log("Auth Error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};

export default adminAuth;