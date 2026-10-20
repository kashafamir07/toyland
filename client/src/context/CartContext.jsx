import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const STORAGE_KEY = "toyland_cart";
const EXTRAS_KEY = "toyland_cart_extras";
const DELIVERY_CHARGE = 200;
const GIFT_WRAP_FEE = 150;
const BUNDLE_MIN_ITEMS = 3;
const BUNDLE_DISCOUNT_RATE = 0.15;

const defaultGiftWrap = { enabled: false, ribbonColor: "coral", message: "" };

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [buildYourBox, setBuildYourBox] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(EXTRAS_KEY) || "{}");
      return stored.buildYourBox || false;
    } catch {
      return false;
    }
  });

  const [giftWrap, setGiftWrap] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(EXTRAS_KEY) || "{}");
      return stored.giftWrap || defaultGiftWrap;
    } catch {
      return defaultGiftWrap;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(EXTRAS_KEY, JSON.stringify({ buildYourBox, giftWrap }));
  }, [buildYourBox, giftWrap]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          image: product.image || null,
          bg: product.bg,
          category: product.category,
          quantity: qty,
        },
      ];
    });
  };

  const addBundleToCart = (products) => {
    setItems((prev) => {
      let next = [...prev];
      products.forEach((product) => {
        const existing = next.find((i) => i.id === product.id);
        next = existing
          ? next.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [
              ...next,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                emoji: product.emoji,
                image: product.image || null,
                bg: product.bg,
                category: product.category,
                quantity: 1,
              },
            ];
      });
      return next;
    });
    setBuildYourBox(true);
  };

  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setItems([]);
    setBuildYourBox(false);
    setGiftWrap(defaultGiftWrap);
  };

  const bundleEligible = items.length >= BUNDLE_MIN_ITEMS;
  const isBundleActive = buildYourBox && bundleEligible;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = isBundleActive ? Math.round(subtotal * BUNDLE_DISCOUNT_RATE) : 0;
  const giftWrapFee = giftWrap.enabled && items.length > 0 ? GIFT_WRAP_FEE : 0;
  const deliveryCharge = items.length > 0 ? DELIVERY_CHARGE : 0;
  const grandTotal = subtotal - discountAmount + deliveryCharge + giftWrapFee;
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addBundleToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        buildYourBox,
        setBuildYourBox,
        bundleEligible,
        isBundleActive,
        giftWrap,
        setGiftWrap,
        subtotal,
        discountAmount,
        giftWrapFee,
        deliveryCharge,
        grandTotal,
        cartCount,
        BUNDLE_MIN_ITEMS,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);