import DiscountCode from "../models/DiscountCode.js";

export const getDiscounts = async (req, res, next) => {
  try {
    const discounts = await DiscountCode.find().sort({ createdAt: -1 });
    res.json(discounts);
  } catch (error) {
    next(error);
  }
};

export const createDiscount = async (req, res, next) => {
  try {
    const { code, type, value, minPurchase, expiryDate, description } = req.body;
    if (!code || !type || value === undefined || !expiryDate) {
      return res.status(400).json({ message: "Code, type, value and expiry date are required" });
    }
    const discount = await DiscountCode.create({ code, type, value, minPurchase, expiryDate, description });
    res.status(201).json(discount);
  } catch (error) {
    next(error);
  }
};

export const updateDiscount = async (req, res, next) => {
  try {
    const discount = await DiscountCode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!discount) return res.status(404).json({ message: "Discount code not found" });
    res.json(discount);
  } catch (error) {
    next(error);
  }
};

export const deleteDiscount = async (req, res, next) => {
  try {
    const discount = await DiscountCode.findById(req.params.id);
    if (!discount) return res.status(404).json({ message: "Discount code not found" });
    await discount.deleteOne();
    res.json({ message: "Discount code deleted" });
  } catch (error) {
    next(error);
  }
  
};
// @desc    Validate a discount code (customer-facing)
// @route   GET /api/discounts/validate/:code
// @access  Private
export const validateDiscount = async (req, res, next) => {
  try {
    const code = req.params.code.toUpperCase();
    const discount = await DiscountCode.findOne({ code, active: true });

    if (!discount) {
      return res.status(404).json({ message: "Invalid or inactive discount code" });
    }
    if (new Date(discount.expiryDate) < new Date()) {
      return res.status(400).json({ message: "This discount code has expired" });
    }

    res.json(discount);
  } catch (error) {
    next(error);
  }
};