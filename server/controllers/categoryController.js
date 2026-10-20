import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load categories",
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, icon, description, image } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const category = await Category.create({
      name: name.trim(),
      slug,
      icon: icon || "🧸",
      description: description || "",
      image: image || "",
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "A category with this name already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create category",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      message: "Failed to delete category",
    });
  }
};