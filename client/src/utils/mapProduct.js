import { getCategoryBg } from "./categoryStyles";

export function mapProduct(p) {
  // Get the first product image safely.
  // Supports both:
  // images: ["https://..."]
  // and:
  // images: [{ url: "https://..." }]
  const firstImage = Array.isArray(p.images)
    ? p.images[0]
    : null;

  let image = null;

  if (typeof firstImage === "string") {
    image = firstImage;
  } else if (firstImage && typeof firstImage === "object") {
    image =
      firstImage.url ||
      firstImage.secure_url ||
      firstImage.src ||
      firstImage.path ||
      null;
  }

  // Also support products that may use image/imageUrl directly
  if (!image) {
    image =
      p.image ||
      p.imageUrl ||
      p.secure_url ||
      null;
  }

  return {
    id: p._id || p.id,
    name: p.name,
    category: p.category?.name || "Uncategorized",
    categoryId: p.category?._id,
    ageGroup: p.ageGroup,
    price: p.price,
    oldPrice: p.oldPrice || undefined,
    rating: Math.round(p.rating) || 5,
    reviews: p.numReviews,
    badge: p.badge || undefined,
    emoji: p.emoji,

    // Actual product image
    image,

    bg: getCategoryBg(p.category?.name),

    stock: p.stock,
  };
}