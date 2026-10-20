import { useState } from "react";

import { Link } from "react-router-dom";

import {
  Heart,
  Check,
} from "lucide-react";

import Stars from "../common/Stars";
import Button from "../common/Button";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({
  toy,
  initialWishlisted = false,
}) {
  const { addToCart } = useCart();

  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();

  const [added, setAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  /*
   * Product wishlist state
   *
   * Context is the main source.
   * initialWishlisted is kept for compatibility
   * with your existing Wishlist.jsx.
   */
  const wishlisted =
    isWishlisted(toy.id) ||
    initialWishlisted;

  /*
   * Add to cart
   */
  const handleAddToCart = () => {
    addToCart(toy);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  /*
   * Wishlist
   */
  const handleWishlistToggle = async (e) => {
    /*
     * Don't open the product when clicking ❤️
     */
    e.preventDefault();
    e.stopPropagation();

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);

      await toggleWishlist(toy.id);
    } catch (error) {
      console.error(
        "Wishlist update failed:",
        error
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-plum/5 hover:shadow-card transition-all duration-200 overflow-hidden flex flex-col">

      {/* Product Image */}

      <div
        className={`relative ${
          toy.bg || "bg-gray-100"
        } h-40 sm:h-48 flex items-center justify-center`}
      >

        {/* Badge */}

        {toy.badge && (
          <span className="absolute top-3 left-3 z-10 bg-white text-coral text-xs font-display font-bold px-3 py-1 rounded-full shadow-card">
            {toy.badge}
          </span>
        )}

        {/* Wishlist Button */}

        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-card flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-60"
        >
          <Heart
            size={16}
            className={
              wishlisted
                ? "fill-coral text-coral"
                : "text-plum/40"
            }
          />
        </button>

        {/* Product Image */}

        <Link
          to={`/product/${toy.id}`}
          className="w-full h-full flex items-center justify-center overflow-hidden"
        >
          {toy.image ? (
<img
  src={toy.image}
  alt={toy.name}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
  onError={(e) => {
    console.error("Product image failed:", toy.name, toy.image);

    e.currentTarget.style.display = "none";

    const fallback = e.currentTarget.nextElementSibling;

    if (fallback) {
      fallback.style.display = "block";
    }
  }}
/>
          ) : null}

          <span
            className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-200"
            style={{
              display: toy.image
                ? "none"
                : "block",
            }}
          >
            {toy.emoji || "🧸"}
          </span>
        </Link>

      </div>


      {/* Product Information */}

      <div className="p-4 flex flex-col gap-2 flex-1">

        {/* Category */}

        <p className="text-xs text-plum/40 font-body">
          {toy.category}
        </p>


        {/* Product Name */}

        <Link to={`/product/${toy.id}`}>
          <h3 className="font-display font-bold text-plum text-sm sm:text-base leading-snug hover:text-coral transition-colors">
            {toy.name}
          </h3>
        </Link>


        {/* Rating */}

        <Stars
          rating={toy.rating || 0}
          size={14}
        />


        {/* Price */}

        <div className="flex items-center gap-2 mt-1">

          <span className="font-display font-extrabold text-plum">
            Rs.{" "}
            {(toy.price || 0).toLocaleString()}
          </span>

          {toy.oldPrice && (
            <span className="text-plum/40 text-sm line-through">
              Rs.{" "}
              {toy.oldPrice.toLocaleString()}
            </span>
          )}

        </div>


        {/* Add to Cart */}

        <Button
          onClick={handleAddToCart}
          className="mt-auto w-full !py-2 text-sm"
        >
          {added ? (
            <>
              <Check size={16} />
              Added
            </>
          ) : (
            "Add to Cart"
          )}
        </Button>

      </div>

    </div>
  );
}