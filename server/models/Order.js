import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: null },
    emoji: { type: String, default: "🧸" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Present for logged-in orders, null for guest orders
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // Present only for guest orders — lets us show "who placed this" without an account
    guestInfo: {
      name: { type: String, default: null },
      email: { type: String, default: null },
      phone: { type: String, default: null },
    },

    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "jazzcash", "easypaisa", "card"],
      required: true,
    },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    discountCode: { type: String, default: null },
    buildYourBox: { type: Boolean, default: false },
    giftWrap: {
      enabled: { type: Boolean, default: false },
      ribbonColor: { type: String, default: null },
      message: { type: String, default: null },
    },
    giftWrapFee: { type: Number, default: 0 },
    deliveryCharge: { type: Number, required: true, default: 200 },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Order Confirmed", "Packed", "Handed to Courier", "Out for Delivery", "Delivered"],
      default: "Order Confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);