import Review from "../models/Review.js";
import Product from "../models/Product.js";

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review for a product
// @route   POST /api/reviews/:productId
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    // Recalculate product's average rating
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.rating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};