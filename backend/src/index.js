import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import session from "express-session"; // ✅ Import

import messageRoutes from "./routes/message.routes.js";
import passport from "passport";
import "./lib/passport.js"; // path to your passport config file
import cookieParser from 'cookie-parser';
import path from "path";


import { server,app } from "./lib/socket.js";
const __dirname = path.resolve();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser()); // <-- Add this line before your routes
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Add a SESSION_SECRET to .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
dotenv.config();

app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}));

// Middleware to parse JSON
app.use(express.json());

// Mount API routes
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);
// Root route for testing
if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/build")))
}
app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend","build","index.html"));
})
// Start server after connecting to MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
