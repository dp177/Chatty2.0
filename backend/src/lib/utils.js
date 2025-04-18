import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JS access
    secure: process.env.NODE_ENV === "production", // Uses Secure in production
    sameSite: "None", // Required for cross-origin in frontend apps
    path: "/", // Ensure cookie is accessible site-wide
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
  });
  return token;
};


 

