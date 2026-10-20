import Order from "../models/Order.js";
import Product from "../models/Product.js";
import DiscountCode from "../models/DiscountCode.js";

const DELIVERY_CHARGE = 200;
const GIFT_WRAP_FEE = 150;
const BUNDLE_MIN_ITEMS = 3;
const BUNDLE_DISCOUNT_RATE = 0.15;

// @desc    Create new order (logged-in user OR guest)
// @route   POST /api/orders
// @access  Public (optionalAuth attaches req.user if logged in)
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, buildYourBox, discountCode, giftWrap, guestInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Shipping address and payment method are required" });
    }
    if (!req.user && (!guestInfo?.name || !guestInfo?.email || !guestInfo?.phone)) {
      return res.status(400).json({ message: "Guest name, email and phone are required" });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      subtotal += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || null,
        emoji: product.emoji,
      });
    }

    let discountAmount = 0;
    let appliedCode = null;
    const bundleApplies = buildYourBox && orderItems.length >= BUNDLE_MIN_ITEMS;

    if (bundleApplies) {
      discountAmount = Math.round(subtotal * BUNDLE_DISCOUNT_RATE);
    } else if (discountCode) {
      const discount = await DiscountCode.findOne({ code: discountCode.toUpperCase(), active: true });
      if (discount && new Date(discount.expiryDate) >= new Date() && subtotal >= (discount.minPurchase || 0)) {
        discountAmount =
          discount.type === "percentage"
            ? Math.round(subtotal * (discount.value / 100))
            : Math.min(discount.value, subtotal);
        appliedCode = discount.code;
      }
    }

    const giftWrapFee = giftWrap?.enabled ? GIFT_WRAP_FEE : 0;
    const grandTotal = subtotal - discountAmount + DELIVERY_CHARGE + giftWrapFee;

    const order = await Order.create({
      user: req.user?._id || null,
      guestInfo: req.user
        ? undefined
        : { name: guestInfo.name, email: guestInfo.email, phone: guestInfo.phone },
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      discountAmount,
      discountCode: appliedCode,
      buildYourBox: bundleApplies,
      giftWrap: giftWrap?.enabled ? giftWrap : { enabled: false },
      giftWrapFee,
      deliveryCharge: DELIVERY_CHARGE,
      grandTotal,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order — owner, admin, OR anyone with the link for a guest order
// @route   GET /api/orders/:id
// @access  Public (optionalAuth attaches req.user if logged in)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Guest orders (no user attached) are viewable by anyone with the direct link —
    // same pattern as most guest-checkout confirmation/tracking pages.
    if (!order.user) {
      return res.json(order);
    }

    const isOwner = req.user && order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Order Confirmed", "Packed", "Handed to Courier", "Out for Delivery", "Delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};