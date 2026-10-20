import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import api from "../services/api";

const WishlistContext = createContext(null);

const STORAGE_KEY = "toyland_guest_wishlist";

export function WishlistProvider({ children }) {
  const { user } = useAuth();

  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  /*
   * Save guest wishlist to localStorage
   */
  useEffect(() => {
    if (!user) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(wishlistIds)
      );
    }
  }, [wishlistIds, user]);

  /*
   * Load logged-in user's wishlist
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    const loadWishlist = async () => {
      try {
        setLoading(true);

        const localIds = getLocalWishlist();

        const res = await api.get("/wishlist");

        const serverItems = Array.isArray(res.data?.items)
          ? res.data.items
          : [];

        const serverIds = serverItems
          .map((item) => item._id || item.id)
          .filter(Boolean)
          .map(String);

        /*
         * Sync guest wishlist into user's account
         */
        for (const productId of localIds) {
          if (!serverIds.includes(String(productId))) {
            try {
              await api.post("/wishlist/add", {
                productId,
              });
            } catch (error) {
              console.error(
                "Failed to sync wishlist item:",
                productId,
                error
              );
            }
          }
        }

        /*
         * Clear guest wishlist after syncing
         */
        if (localIds.length > 0) {
          localStorage.removeItem(STORAGE_KEY);
        }

        /*
         * Final wishlist = server wishlist
         */
        const finalIds = [
          ...new Set([
            ...serverIds,
            ...localIds.map(String),
          ]),
        ];

        setWishlistIds(finalIds);
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  /*
   * Get guest wishlist
   */
  const getLocalWishlist = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  /*
   * Check if product is wishlisted
   */
  const isWishlisted = (productId) => {
    return wishlistIds.includes(String(productId));
  };

  /*
   * Add product
   */
  const addToWishlist = async (productId) => {
    const id = String(productId);

    /*
     * Already exists
     */
    if (wishlistIds.includes(id)) {
      return;
    }

    /*
     * Update UI immediately
     */
    setWishlistIds((prev) => [...prev, id]);

    /*
     * Guest → localStorage only
     */
    if (!user) {
      return;
    }

    /*
     * Logged in → MongoDB
     */
    try {
      await api.post("/wishlist/add", {
        productId,
      });
    } catch (error) {
      console.error(
        "Failed to add wishlist item:",
        error
      );

      /*
       * Revert optimistic update
       */
      setWishlistIds((prev) =>
        prev.filter((item) => item !== id)
      );

      throw error;
    }
  };

  /*
   * Remove product
   */
  const removeFromWishlist = async (productId) => {
    const id = String(productId);

    /*
     * Update UI immediately
     */
    setWishlistIds((prev) =>
      prev.filter((item) => item !== id)
    );

    /*
     * Guest → localStorage
     */
    if (!user) {
      return;
    }

    /*
     * Logged in → MongoDB
     */
    try {
      await api.delete(`/wishlist/remove/${productId}`);
    } catch (error) {
      console.error(
        "Failed to remove wishlist item:",
        error
      );

      /*
       * Revert optimistic update
       */
      setWishlistIds((prev) => [
        ...prev,
        id,
      ]);

      throw error;
    }
  };

  /*
   * Toggle wishlist
   */
  const toggleWishlist = async (productId) => {
    if (isWishlisted(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  /*
   * Clear guest wishlist
   */
  const clearWishlist = () => {
    setWishlistIds([]);

    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}