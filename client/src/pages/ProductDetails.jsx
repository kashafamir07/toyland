import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Check, ShieldCheck, Truck } from "lucide-react";
import api from "../services/api";
import { mapProduct } from "../utils/mapProduct";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Stars from "../components/common/Stars";
import Button from "../components/common/Button";
import ReviewForm from "../components/product/ReviewForm";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get(`/products/${id}`), api.get(`/reviews/${id}`)])
      .then(([prodRes, reviewsRes]) => {
        setProduct(mapProduct(prodRes.data));
        setReviews(reviewsRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <section className="bg-cream min-h-screen py-20 text-center">
        <p className="font-display text-plum/50">Loading toy...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="bg-cream min-h-screen py-20 text-center px-4">
        <span className="text-5xl">🔍</span>
        <h1 className="font-display text-2xl font-extrabold text-plum mt-4">Toy not found</h1>
        <Link to="/shop" className="text-coral font-display font-bold hover:underline mt-4 inline-block">← Back to Shop</Link>
      </section>
    );
  }

  const alreadyReviewed = user && reviews.some((r) => r.user?._id === user._id);

  return (
    <section className="bg-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-plum/40 mb-6 font-display font-semibold">
          <Link to="/shop" className="hover:text-coral">Shop</Link> / {product.category} / {product.name}
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <div className={`relative ${product.bg} rounded-3xl h-80 sm:h-[26rem] flex items-center justify-center overflow-hidden`}>
            {product.badge && (
              <span className="absolute top-5 left-5 z-10 bg-white text-coral text-xs font-display font-bold px-3 py-1.5 rounded-full shadow-card">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => setWishlisted((w) => !w)}
              aria-label="Toggle wishlist"
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart size={18} className={wishlisted ? "fill-coral text-coral" : "text-plum/40"} />
            </button>

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
            ) : null}
            <span
              className="text-[10rem] sm:text-[12rem]"
              style={{ display: product.image ? "none" : "block" }}
            >
              {product.emoji}
            </span>
          </div>

          <div>
            <p className="text-sm text-plum/40 font-display font-semibold mb-2">{product.category} · {product.ageGroup}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-plum mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <Stars rating={product.rating} size={18} />
              <span className="text-sm text-plum/50">{product.reviews} reviews</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-3xl font-extrabold text-plum">Rs. {product.price.toLocaleString()}</span>
              {product.oldPrice && <span className="text-plum/40 text-lg line-through">Rs. {product.oldPrice.toLocaleString()}</span>}
            </div>

            <p className="text-sm text-plum/50 mb-6">
              {product.stock > 5
                ? `In stock — ${product.stock} available`
                : product.stock > 0
                ? `Only ${product.stock} left — order soon!`
                : "Currently out of stock"}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 border border-plum/10 rounded-full">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-plum/60 hover:text-coral">−</button>
                <span className="w-8 text-center font-display font-bold text-plum">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} className="w-10 h-10 flex items-center justify-center text-plum/60 hover:text-coral">+</button>
              </div>

              <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 disabled:opacity-40">
                {added ? (<><Check size={18} /> Added to Cart</>) : "Add to Cart"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-plum/10">
              <div className="flex items-center gap-2 text-sm text-plum/60"><ShieldCheck size={18} className="text-mint" /> 100% Authentic</div>
              <div className="flex items-center gap-2 text-sm text-plum/60"><Truck size={18} className="text-mint" /> 2–4 Day Delivery</div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-extrabold text-plum mb-6">Customer Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-plum/50 text-sm mb-8">No reviews yet — be the first to share your thoughts!</p>
          ) : (
            <div className="space-y-4 mb-8">
              {reviews.map((r) => (
                <div key={r._id} className="bg-white rounded-2xl border border-plum/5 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-display font-bold text-sm text-plum">{r.user?.name || "Anonymous"}</p>
                    <Stars rating={r.rating} size={14} />
                  </div>
                  <p className="text-sm text-plum/60">{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {user ? (
            !alreadyReviewed && <ReviewForm productId={id} onSubmitted={loadData} />
          ) : (
            <p className="text-sm text-plum/50">
              <Link to={`/login?redirect=/product/${id}`} className="text-coral font-bold hover:underline">Log in</Link> to leave a review.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}