import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("DiscountCode", discountCodeSchema);