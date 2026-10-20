import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    description: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    ageGroup: {
      type: String,
      enum: ["0-2 Years", "3-5 Years", "6-8 Years"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    emoji: { type: String, default: "🧸" },
    badge: { type: String, default: null }, // e.g. "Best Seller", "New"
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }, // for soft-archiving
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);