import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { setCurrentId } from "../controllers/currentID.js";
export default async function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies.token; // Get token from cookie

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request
     const currentId = req.user._id;
      setCurrentId(currentId);
      console.log(currentId);
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
