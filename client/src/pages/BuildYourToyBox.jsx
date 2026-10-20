import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import api from "../services/api";
import { mapProduct } from "../utils/mapProduct";
import { useCart } from "../context/CartContext";
import Button from "../components/common/Button";

export default function BuildYourToyBox() {
  const { addBundleToCart, BUNDLE_MIN_ITEMS } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.map(mapProduct)))
      .catch((err) => setError(err.response?.data?.message || "Couldn't load toys — check that the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (product) => {
    setSelected((prev) =>
      prev.find((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product]
    );
  };

  const subtotal = selected.reduce((sum, p) => sum + p.price, 0);
  const eligible = selected.length >= BUNDLE_MIN_ITEMS;
  const discount = eligible ? Math.round(subtotal * 0.15) : 0;

  const handleAddBundle = () => {
    addBundleToCart(selected);
    navigate("/cart");
  };

  return (
    <section className="bg-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 bg-mint text-plum text-xs font-display font-bold px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> Save 15% Automatically
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-plum">Build Your Toy Box</h1>
          <p className="text-plum/60 mt-3">
            Pick any {BUNDLE_MIN_ITEMS} or more toys and we'll bundle them into one gift box — 15% off unlocks automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            {loading ? (
              <p className="text-plum/40 font-display">Loading toys...</p>
            ) : error ? (
              <div className="bg-white rounded-2xl border border-plum/5 p-8 text-center">
                <p className="text-coral font-display font-bold">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-plum/5 p-8 text-center">
                <p className="text-plum/50 font-display">No toys available yet — check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((p) => {
                  const isSelected = selected.some((s) => s.id === p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggle(p)}
                      className={`relative bg-white rounded-2xl border-2 p-4 text-left transition-all ${
                        isSelected ? "border-coral shadow-card" : "border-plum/5 hover:border-plum/15"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-coral text-white flex items-center justify-center">
                          <Check size={14} />
                        </span>
                      )}
                      <div className={`${p.bg} rounded-xl h-20 flex items-center justify-center text-4xl mb-3 overflow-hidden`}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          p.emoji
                        )}
                      </div>
                      <p className="font-display font-bold text-sm text-plum leading-snug">{p.name}</p>
                      <p className="font-display font-extrabold text-plum text-sm mt-1">Rs. {p.price.toLocaleString()}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-plum/5 p-6 h-fit sticky top-24">
            <h2 className="font-display font-extrabold text-lg text-plum mb-1">Your Toy Box</h2>
            <p className="text-xs text-plum/40 mb-4">
              {selected.length} selected {!eligible && `· add ${BUNDLE_MIN_ITEMS - selected.length} more to unlock 15% off`}
            </p>

            {selected.length === 0 ? (
              <p className="text-sm text-plum/40">Tap toys on the left to add them here.</p>
            ) : (
              <div className="space-y-2 mb-4 max-h-56 overflow-y-auto no-scrollbar">
                {selected.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-plum/70 truncate pr-2">{p.name}</span>
                    <span className="text-plum/50 shrink-0">Rs. {p.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 pt-3 border-t border-plum/10 text-sm">
              <div className="flex justify-between text-plum/60">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {eligible && (
                <div className="flex justify-between text-plum font-semibold">
                  <span>🎁 Bundle Discount (15%)</span>
                  <span>− Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-display font-extrabold text-plum text-base pt-2 border-t border-plum/10">
                <span>Box Total</span>
                <span className="text-coral">Rs. {(subtotal - discount).toLocaleString()}</span>
              </div>
            </div>

            <Button onClick={handleAddBundle} disabled={!eligible} className="w-full mt-5 disabled:opacity-40 disabled:cursor-not-allowed">
              Add Box to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}