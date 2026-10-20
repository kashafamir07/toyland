import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

// Fix MongoDB Atlas DNS/SRV connection issue
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const categoriesData = [
  {
    name: "Plush Toys",
    icon: "🧸",
    slug: "plush-toys",
    description: "Soft cuddly companions",
  },
  {
    name: "Cars & Vehicles",
    icon: "🚗",
    slug: "cars-and-vehicles",
    description: "RC cars & racing sets",
  },
  {
    name: "Building Blocks",
    icon: "🧱",
    slug: "building-blocks",
    description: "LEGO & construction kits",
  },
  {
    name: "STEM Toys",
    icon: "🚀",
    slug: "stem-toys",
    description: "Science & robotics",
  },
  {
    name: "Arts & Crafts",
    icon: "🎨",
    slug: "arts-and-crafts",
    description: "Painting & DIY kits",
  },
  {
    name: "Puzzles & Board Games",
    icon: "🧩",
    slug: "puzzles-and-board-games",
    description: "Family strategy games",
  },
];

const buildProducts = (categoryMap) => [
  {
    name: "Giant Fluffy Teddy Bear",
    category: categoryMap["Plush Toys"],
    ageGroup: "3-5 Years",
    price: 2500,
    rating: 4,
    numReviews: 96,
    badge: "New",
    emoji: "🧸",
    stock: 40,
  },
  {
    name: "Bunny Family Plush Set",
    category: categoryMap["Plush Toys"],
    ageGroup: "0-2 Years",
    price: 2100,
    rating: 5,
    numReviews: 58,
    emoji: "🐰",
    stock: 25,
  },
  {
    name: "Sleepy Owl Cushion Plush",
    category: categoryMap["Plush Toys"],
    ageGroup: "6-8 Years",
    price: 1600,
    rating: 4,
    numReviews: 33,
    emoji: "🦉",
    stock: 18,
  },
  {
    name: "Turbo RC Speed Car",
    category: categoryMap["Cars & Vehicles"],
    ageGroup: "6-8 Years",
    price: 3800,
    rating: 5,
    numReviews: 74,
    emoji: "🏎️",
    stock: 15,
  },
  {
    name: "Wooden Train Set",
    category: categoryMap["Cars & Vehicles"],
    ageGroup: "0-2 Years",
    price: 2200,
    rating: 5,
    numReviews: 140,
    badge: "Best Seller",
    emoji: "🚂",
    stock: 30,
  },
  {
    name: "Mini Fire Truck Playset",
    category: categoryMap["Cars & Vehicles"],
    ageGroup: "3-5 Years",
    price: 1450,
    rating: 4,
    numReviews: 41,
    emoji: "🚒",
    stock: 22,
  },
  {
    name: "LEGO Space Explorer",
    category: categoryMap["Building Blocks"],
    ageGroup: "6-8 Years",
    price: 4499,
    oldPrice: 5500,
    rating: 5,
    numReviews: 128,
    badge: "Best Seller",
    emoji: "🚀",
    stock: 12,
  },
  {
    name: "Building Bricks Mega Box",
    category: categoryMap["Building Blocks"],
    ageGroup: "3-5 Years",
    price: 4899,
    rating: 5,
    numReviews: 62,
    emoji: "🧱",
    stock: 20,
  },
  {
    name: "Castle Blocks Starter Set",
    category: categoryMap["Building Blocks"],
    ageGroup: "0-2 Years",
    price: 1899,
    rating: 4,
    numReviews: 29,
    emoji: "🏰",
    stock: 3,
  },
  {
    name: "Robotics Starter Lab",
    category: categoryMap["STEM Toys"],
    ageGroup: "6-8 Years",
    price: 5299,
    rating: 5,
    numReviews: 40,
    badge: "Best Seller",
    emoji: "🤖",
    stock: 10,
  },
  {
    name: "Junior Science Experiment Kit",
    category: categoryMap["STEM Toys"],
    ageGroup: "3-5 Years",
    price: 2399,
    rating: 4,
    numReviews: 35,
    emoji: "🧪",
    stock: 27,
  },
  {
    name: "Coding Adventure Board Game",
    category: categoryMap["STEM Toys"],
    ageGroup: "6-8 Years",
    price: 3199,
    rating: 5,
    numReviews: 27,
    emoji: "💻",
    stock: 14,
  },
  {
    name: "Rainbow Art Studio Kit",
    category: categoryMap["Arts & Crafts"],
    ageGroup: "3-5 Years",
    price: 1899,
    rating: 4,
    numReviews: 51,
    emoji: "🎨",
    stock: 33,
  },
  {
    name: "Clay Modeling Fun Pack",
    category: categoryMap["Arts & Crafts"],
    ageGroup: "0-2 Years",
    price: 1299,
    rating: 4,
    numReviews: 22,
    emoji: "🖌️",
    stock: 4,
  },
  {
    name: "DIY Greeting Card Craft Box",
    category: categoryMap["Arts & Crafts"],
    ageGroup: "6-8 Years",
    price: 999,
    rating: 5,
    numReviews: 18,
    emoji: "✂️",
    stock: 45,
  },
  {
    name: "Galaxy Puzzle 500pc",
    category: categoryMap["Puzzles & Board Games"],
    ageGroup: "6-8 Years",
    price: 1299,
    rating: 5,
    numReviews: 63,
    emoji: "🧩",
    stock: 29,
  },
  {
    name: "Memory Match Game",
    category: categoryMap["Puzzles & Board Games"],
    ageGroup: "0-2 Years",
    price: 899,
    rating: 4,
    numReviews: 45,
    emoji: "🃏",
    stock: 38,
  },
  {
    name: "Family Strategy Board Game",
    category: categoryMap["Puzzles & Board Games"],
    ageGroup: "6-8 Years",
    price: 2199,
    rating: 5,
    numReviews: 31,
    badge: "New",
    emoji: "♟️",
    stock: 16,
  },
];

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB for seeding...");

    await Category.deleteMany({});
    console.log("Old categories removed.");

    await Product.deleteMany({});
    console.log("Old products removed.");

    const insertedCategories = await Category.insertMany(categoriesData);

    console.log(`Inserted ${insertedCategories.length} categories.`);

    const categoryMap = {};

    insertedCategories.forEach((category) => {
      categoryMap[category.name] = category._id;
    });

    const products = buildProducts(categoryMap);

    await Product.insertMany(products);

    console.log(
      `Seeded ${insertedCategories.length} categories and ${products.length} products.`
    );

    await mongoose.connection.close();

    console.log("Seeding completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);

    await mongoose.connection.close().catch(() => {});

    process.exit(1);
  }
};

seed();