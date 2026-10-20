const CATEGORY_COLORS = {
  "Plush Toys": "bg-blush",
  "Cars & Vehicles": "bg-sky",
  "Building Blocks": "bg-mint",
  "STEM Toys": "bg-butter",
  "Arts & Crafts": "bg-blush",
  "Puzzles & Board Games": "bg-sky",
};

export const getCategoryBg = (categoryName) => CATEGORY_COLORS[categoryName] || "bg-mint";