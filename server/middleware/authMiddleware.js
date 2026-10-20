import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Requires a valid token — blocks the request if missing/invalid
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token provided" });
};

// Attaches req.user if a valid token is present, but never blocks the request —
// used for routes that support both guest and logged-in access (e.g. checkout)
export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch {
      // Invalid/expired token on an optional route — just proceed as a guest
      req.user = null;
    }
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied, admin only" });
};