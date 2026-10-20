import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import dns from "dns";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

// Fix MongoDB Atlas DNS/SRV connection issue
dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("TOYLAND API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/upload", uploadRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});