import User from "../models/user.model.js";  // Ensure this import is here
import express from "express";
import passport from "passport";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { logout } from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";
import { updateProfile } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";
import { setCurrentId,getCurrentId } from "../controllers/currentID.js";
const router = express.Router();
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/base",
    failureRedirect: "/api/auth/failure",
  })
);
router.get("/base", (req, res) => {
 
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log(token);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Lax", // or "None" if using HTTPS
    secure: false,   // must be false on localhost
    maxAge: 3600000
  });
  

  res.redirect(`${process.env.FRONTEND_URL}/login?authSuccess=true`);
});
router.put("/update-profile",updateProfile);
router.get("/logout",logout);
router.get("/failure", (req, res) => {
  res.send("Google Login Failed");
});

router.get("/protected", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

router.get("/check",isAuthenticated, (req, res) => {
  res.json( {user: req.user});
});


export default router;
