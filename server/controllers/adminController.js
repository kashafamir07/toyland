import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res, next) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalOrders = orders.length;
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ role: "user" });

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ totalSales, totalOrders, totalProducts, totalCustomers, recentOrders });
  } catch (error) {
    next(error);
  }
};