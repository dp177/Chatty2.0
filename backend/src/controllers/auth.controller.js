import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { cloudinary } from '../lib/cloudnary.js';

import express from "express";
import passport from "passport";
import isAuthenticated from "../middleware/isAuthenticated.js";

export const checkAuth = async(req, res) => {
  try {
    const token = req.cookies.token; // Get token from cookie
    console.log("Token:", token); // Debugging line
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

   
    res.status(200).json(user);
  } catch (err) {
    console.error("JWT Auth Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
import { useNavigate } from 'react-router-dom';
import { setCurrentId } from "./currentID.js";

export const logout = (req,res) => {
  // Remove the JWT token from the cookie by setting an expired date
  res.clearCookie('token', { path: '/' });
  res.clearCookie('connect.sid', { path: '/' });
  setCurrentId(null);

  // Respond with a success message or redirect
  res.status(200).json({ message: 'Logged out successfully' });

};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userID = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "profilePic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
