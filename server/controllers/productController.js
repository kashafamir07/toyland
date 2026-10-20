import Product from "../models/Product.js";

// @desc    Get all products (with filters)
// @route   GET /api/products?category=&ageGroup=&minPrice=&maxPrice=&search=
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, ageGroup, minPrice, maxPrice, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (ageGroup) filter.ageGroup = ageGroup;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate("category", "name icon slug")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name icon slug");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (archive) product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Soft delete — keeps history for past orders intact
    product.isActive = false;
    await product.save();
    res.json({ message: "Product archived" });
  } catch (error) {
    next(error);
  }
};
// @desc    Get ALL products including archived (admin view)
// @route   GET /api/products/admin/all
// @access  Private/Admin
export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category", "name icon slug")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};