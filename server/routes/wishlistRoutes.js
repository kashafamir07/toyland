import express from "express";
import crypto from "crypto";

import User from "../models/User.js";
import Product from "../models/Product.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/wishlist
// Get logged-in user's wishlist
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      items: user.wishlist || [],
      isPublic: Boolean(user.wishlistPublic),
      shareToken: user.wishlistShareToken || null,
    });
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// POST /api/wishlist/add
// Add product to wishlist
router.post("/add", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyExists = (user.wishlist || []).some(
      (id) => id.toString() === productId.toString()
    );

    if (!alreadyExists) {
      user.wishlist.push(product._id);
      await user.save();
    }

    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist"
    );

    res.json({
      message: alreadyExists
        ? "Product already in wishlist"
        : "Added to wishlist",
      items: updatedUser.wishlist || [],
    });
  } catch (error) {
    console.error("ADD WISHLIST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE /api/wishlist/remove/:productId
// Remove product from wishlist
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.wishlist = (user.wishlist || []).filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist"
    );

    res.json({
      message: "Removed from wishlist",
      items: updatedUser.wishlist || [],
    });
  } catch (error) {
    console.error("REMOVE WISHLIST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// PUT /api/wishlist/visibility
// Make wishlist public/private
router.put("/visibility", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.wishlistPublic = !Boolean(user.wishlistPublic);

    if (user.wishlistPublic && !user.wishlistShareToken) {
      user.wishlistShareToken = crypto
        .randomBytes(16)
        .toString("hex");
    }

    await user.save();

    res.json({
      isPublic: Boolean(user.wishlistPublic),
      shareToken: user.wishlistShareToken || null,
    });
  } catch (error) {
    console.error("WISHLIST VISIBILITY ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// GET /api/wishlist/public/:token
// Get public wishlist
router.get("/public/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      wishlistShareToken: req.params.token,
      wishlistPublic: true,
    }).populate("wishlist");

    if (!user) {
      return res.status(404).json({
        message: "Wishlist not found or is private",
      });
    }

    res.json({
      name: user.name,
      items: user.wishlist || [],
    });
  } catch (error) {
    console.error("PUBLIC WISHLIST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;