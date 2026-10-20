import crypto from "crypto";
import User from "../models/User.js";

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ items: user.wishlist, isPublic: user.wishlistPublic, shareToken: user.wishlistShareToken });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ message: "Added to wishlist" });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
    await user.save();
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist public visibility (generates a share link)
// @route   PUT /api/wishlist/visibility
// @access  Private
export const toggleVisibility = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlistPublic = !user.wishlistPublic;
    if (user.wishlistPublic && !user.wishlistShareToken) {
      user.wishlistShareToken = crypto.randomBytes(8).toString("hex");
    }
    await user.save();
    res.json({ isPublic: user.wishlistPublic, shareToken: user.wishlistShareToken });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a public wishlist by share token
// @route   GET /api/wishlist/public/:token
// @access  Public
export const getPublicWishlist = async (req, res, next) => {
  try {
    const user = await User.findOne({
      wishlistShareToken: req.params.token,
      wishlistPublic: true,
    }).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "This wishlist is unavailable or private" });
    }

    res.json({ name: user.name, items: user.wishlist });
  } catch (error) {
    next(error);
  }
};