import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  Heart,
  Copy,
  Check,
} from "lucide-react";

import api from "../services/api";

import { mapProduct } from "../utils/mapProduct";

import ProductCard from "../components/product/ProductCard";

import Button from "../components/common/Button";

import { useAuth } from "../context/AuthContext";

import { useWishlist } from "../context/WishlistContext";

const STORAGE_KEY = "toyland_guest_wishlist";

export default function Wishlist() {
  const { user } = useAuth();

  const {
    wishlistIds,
    loading: wishlistLoading,
  } = useWishlist();

  const [items, setItems] = useState([]);

  const [isPublic, setIsPublic] =
    useState(false);

  const [shareToken, setShareToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const [updatingVisibility, setUpdatingVisibility] =
    useState(false);


  /*
   * Load wishlist products
   */
  const load = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * ==========================================
       * GUEST WISHLIST
       * ==========================================
       */

      if (!user) {
        const saved =
          localStorage.getItem(STORAGE_KEY);

        const ids = saved
          ? JSON.parse(saved)
          : [];

        if (!ids.length) {
          setItems([]);
          setIsPublic(false);
          setShareToken(null);
          return;
        }

        /*
         * Get products
         */
        const res =
          await api.get("/products");

        const products = Array.isArray(res.data)
          ? res.data
          : [];

        /*
         * Match local wishlist IDs
         */
        const guestItems = products
          .filter((product) =>
            ids.includes(
              String(
                product._id ||
                product.id
              )
            )
          )
          .map(mapProduct);

        setItems(guestItems);

        setIsPublic(false);
        setShareToken(null);

        return;
      }


      /*
       * ==========================================
       * LOGGED-IN WISHLIST
       * ==========================================
       */

      const res =
        await api.get("/wishlist");

      const wishlistItems =
        Array.isArray(res.data?.items)
          ? res.data.items
          : [];

      setItems(
        wishlistItems.map(mapProduct)
      );

      setIsPublic(
        Boolean(res.data?.isPublic)
      );

      setShareToken(
        res.data?.shareToken || null
      );

    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );

      setItems([]);

      setError(
        error.response?.data?.message ||
          "Unable to load your wishlist."
      );

    } finally {
      setLoading(false);
    }
  };


  /*
   * Reload when auth/wishlist changes
   */
  useEffect(() => {
    load();
  }, [user, wishlistIds]);


  /*
   * Public wishlist visibility
   *
   * Only logged-in users can share
   * their MongoDB wishlist.
   */
  const toggleVisibility = async () => {
    if (!user) {
      return;
    }

    try {
      setUpdatingVisibility(true);

      const res =
        await api.put(
          "/wishlist/visibility"
        );

      setIsPublic(
        Boolean(res.data?.isPublic)
      );

      setShareToken(
        res.data?.shareToken || null
      );

    } catch (error) {
      console.error(
        "Failed to update wishlist visibility:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update wishlist visibility."
      );

    } finally {
      setUpdatingVisibility(false);
    }
  };


  /*
   * Share URL
   */
  const shareUrl = shareToken
    ? `${window.location.origin}/wishlist/${shareToken}`
    : "";


  /*
   * Copy share URL
   */
  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(
        shareUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error(
        "Failed to copy wishlist link:",
        error
      );
    }
  };


  const isLoading =
    loading || wishlistLoading;


  return (
    <section className="bg-cream min-h-screen py-10 sm:py-14">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

          <div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-plum flex items-center gap-2">

              <Heart className="text-coral" />

              {user
                ? "My Wishlist"
                : "My Wishlist"}

            </h1>

            <p className="text-plum/60 mt-1 text-sm">
              {user
                ? "Perfect for sharing before a birthday 🎂"
                : "Save your favorite toys for later ❤️"}
            </p>

          </div>


          {/* PUBLIC WISHLIST */}

          {user && (
            <div className="bg-white rounded-2xl border border-plum/5 p-4 w-full sm:w-80">

              <label className="flex items-center gap-3 cursor-pointer">

                <span className="text-sm font-display font-bold text-plum">
                  Make wishlist public
                </span>

                <input
                  type="checkbox"
                  checked={isPublic}
                  disabled={updatingVisibility}
                  onChange={toggleVisibility}
                  className="w-5 h-5 rounded accent-coral cursor-pointer ml-auto"
                />

              </label>


              {isPublic &&
                shareToken && (
                  <div className="flex items-center gap-2 mt-3">

                    <input
                      readOnly
                      value={shareUrl}
                      className="input text-xs flex-1"
                      onFocus={(e) =>
                        e.target.select()
                      }
                    />

                    <button
                      onClick={handleCopy}
                      className="p-2.5 rounded-xl bg-coral text-white hover:bg-coral-dark shrink-0"
                      aria-label="Copy link"
                    >
                      {copied ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>

                  </div>
                )}

            </div>
          )}

        </div>


        {/* ERROR */}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 text-red-600 text-sm">
            {error}
          </div>
        )}


        {/* CONTENT */}

        {isLoading ? (

          <p className="text-plum/40 font-display">
            Loading wishlist...
          </p>

        ) : items.length === 0 ? (

          <div className="bg-white rounded-2xl border border-plum/5 p-12 text-center">

            <Heart
              size={48}
              className="text-plum/20 mx-auto"
            />

            <p className="font-display font-bold text-lg text-plum mt-4">
              Your wishlist is empty
            </p>

            <p className="text-plum/50 text-sm mt-1 mb-5">
              Tap the heart on any toy to save it here.
            </p>

            <Link to="/shop">
              <Button>
                Browse Toys
              </Button>
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

            {items.map((toy) => (

              <ProductCard
                key={toy.id}
                toy={toy}
                initialWishlisted={true}
              />

            ))}

          </div>

        )}

      </div>

    </section>
  );
}