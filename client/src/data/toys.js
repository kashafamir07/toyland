export const categories = [
  { id: 1, name: "Plush Toys", icon: "🧸", bg: "bg-blush", desc: "Soft cuddly companions" },
  { id: 2, name: "Cars & Vehicles", icon: "🚗", bg: "bg-sky", desc: "RC cars & racing sets" },
  { id: 3, name: "Building Blocks", icon: "🧱", bg: "bg-mint", desc: "LEGO & construction kits" },
  { id: 4, name: "STEM Toys", icon: "🚀", bg: "bg-butter", desc: "Science & robotics" },
  { id: 5, name: "Arts & Crafts", icon: "🎨", bg: "bg-blush", desc: "Painting & DIY kits" },
  { id: 6, name: "Puzzles & Board Games", icon: "🧩", bg: "bg-sky", desc: "Family strategy games" },
];

// Used by the Home page's decorative age pills
export const ageGroups = ["0-2 Years", "3-5 Years", "6-8 Years"];

// Used by the Shop filter sidebar — values must match product.ageGroup exactly
export const AGE_FILTERS = ["0-2 Years", "3-5 Years", "6-8 Years"];

export const PRICE_RANGES = [
  { id: "under-2000", label: "Under Rs. 2,000", min: 0, max: 2000 },
  { id: "2000-5000", label: "Rs. 2,000 – 5,000", min: 2000, max: 5000 },
  { id: "above-5000", label: "Above Rs. 5,000", min: 5000, max: Infinity },
];

export const allProducts = [
  // Plush Toys
  { id: 1, name: "Giant Fluffy Teddy Bear", category: "Plush Toys", ageGroup: "3-5 Years", price: 2500, rating: 4, reviews: 96, badge: "New", emoji: "🧸", bg: "bg-blush" },
  { id: 2, name: "Bunny Family Plush Set", category: "Plush Toys", ageGroup: "0-2 Years", price: 2100, rating: 5, reviews: 58, emoji: "🐰", bg: "bg-blush" },
  { id: 3, name: "Sleepy Owl Cushion Plush", category: "Plush Toys", ageGroup: "6-8 Years", price: 1600, rating: 4, reviews: 33, emoji: "🦉", bg: "bg-blush" },

  // Cars & Vehicles
  { id: 4, name: "Turbo RC Speed Car", category: "Cars & Vehicles", ageGroup: "6-8 Years", price: 3800, rating: 5, reviews: 74, emoji: "🏎️", bg: "bg-sky" },
  { id: 5, name: "Wooden Train Set", category: "Cars & Vehicles", ageGroup: "0-2 Years", price: 2200, rating: 5, reviews: 140, badge: "Best Seller", emoji: "🚂", bg: "bg-sky" },
  { id: 6, name: "Mini Fire Truck Playset", category: "Cars & Vehicles", ageGroup: "3-5 Years", price: 1450, rating: 4, reviews: 41, emoji: "🚒", bg: "bg-sky" },

  // Building Blocks
  { id: 7, name: "LEGO Space Explorer", category: "Building Blocks", ageGroup: "6-8 Years", price: 4499, oldPrice: 5500, rating: 5, reviews: 128, badge: "Best Seller", emoji: "🚀", bg: "bg-mint" },
  { id: 8, name: "Building Bricks Mega Box", category: "Building Blocks", ageGroup: "3-5 Years", price: 4899, rating: 5, reviews: 62, emoji: "🧱", bg: "bg-mint" },
  { id: 9, name: "Castle Blocks Starter Set", category: "Building Blocks", ageGroup: "0-2 Years", price: 1899, rating: 4, reviews: 29, emoji: "🏰", bg: "bg-mint" },

  // STEM Toys
  { id: 10, name: "Robotics Starter Lab", category: "STEM Toys", ageGroup: "6-8 Years", price: 5299, rating: 5, reviews: 40, badge: "Best Seller", emoji: "🤖", bg: "bg-butter" },
  { id: 11, name: "Junior Science Experiment Kit", category: "STEM Toys", ageGroup: "3-5 Years", price: 2399, rating: 4, reviews: 35, emoji: "🧪", bg: "bg-butter" },
  { id: 12, name: "Coding Adventure Board Game", category: "STEM Toys", ageGroup: "6-8 Years", price: 3199, rating: 5, reviews: 27, emoji: "💻", bg: "bg-butter" },

  // Arts & Crafts
  { id: 13, name: "Rainbow Art Studio Kit", category: "Arts & Crafts", ageGroup: "3-5 Years", price: 1899, rating: 4, reviews: 51, emoji: "🎨", bg: "bg-blush" },
  { id: 14, name: "Clay Modeling Fun Pack", category: "Arts & Crafts", ageGroup: "0-2 Years", price: 1299, rating: 4, reviews: 22, emoji: "🖌️", bg: "bg-blush" },
  { id: 15, name: "DIY Greeting Card Craft Box", category: "Arts & Crafts", ageGroup: "6-8 Years", price: 999, rating: 5, reviews: 18, emoji: "✂️", bg: "bg-blush" },

  // Puzzles & Board Games
  { id: 16, name: "Galaxy Puzzle 500pc", category: "Puzzles & Board Games", ageGroup: "6-8 Years", price: 1299, rating: 5, reviews: 63, emoji: "🧩", bg: "bg-sky" },
  { id: 17, name: "Memory Match Game", category: "Puzzles & Board Games", ageGroup: "0-2 Years", price: 899, rating: 4, reviews: 45, emoji: "🃏", bg: "bg-sky" },
  { id: 18, name: "Family Strategy Board Game", category: "Puzzles & Board Games", ageGroup: "6-8 Years", price: 2199, rating: 5, reviews: 31, badge: "New", emoji: "♟️", bg: "bg-sky" },
];

// Kept for Home page sections built in Phase 1
export const featuredToys = allProducts.filter((p) => [1, 7, 4, 13, 16, 10].includes(p.id));
export const bestSellers = allProducts
  .filter((p) => p.badge === "Best Seller" || [3, 6, 9, 12].includes(p.id))
  .map((p) => ({ ...p, sold: `${(p.reviews * 12).toLocaleString()}+ sold` }));

export const testimonials = [
  { id: 1, name: "Ayesha K.", location: "Lahore", avatar: "👩", rating: 5, text: "My daughter hasn't put down her teddy bear since it arrived. Packaging was adorable too!" },
  { id: 2, name: "Bilal R.", location: "Karachi", avatar: "👨", rating: 5, text: "Ordered the LEGO set with COD, arrived in 2 days. Great quality for the price." },
  { id: 3, name: "Sana M.", location: "Islamabad", avatar: "👩‍🦱", rating: 4, text: "Loved the birthday wishlist feature — my son's cousins used it to pick his gift." },
];

export const trustBadges = [
  { title: "100% Authentic", desc: "Verified original toys" },
  { title: "Fast Delivery", desc: "2–4 day nationwide shipping" },
  { title: "Easy Returns", desc: "7-day hassle-free returns" },
  { title: "COD Available", desc: "JazzCash, Easypaisa & cards" },
];