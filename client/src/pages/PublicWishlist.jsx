import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Gift } from "lucide-react";
import api from "../services/api";
import { mapProduct } from "../utils/mapProduct";
import ProductCard from "../components/product/ProductCard";

export default function PublicWishlist() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/wishlist/public/${token}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Wishlist not found"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <section className="bg-cream min-h-screen py-20 text-center">
        <p className="font-display text-plum/50">Loading wishlist...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-cream min-h-screen py-20 text-center px-4">
        <span className="text-5xl">🔍</span>
        <h1 className="font-display text-2xl font-extrabold text-plum mt-4">{error}</h1>
        <Link to="/shop" className="text-coral font-display font-bold hover:underline mt-4 inline-block">
          ← Browse TOYLAND
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-lg mx-auto mb-10">
          <Gift size={40} className="text-coral mx-auto mb-3" />
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-plum">{data.name}'s Wishlist</h1>
          <p className="text-plum/60 mt-2 text-sm">Here's what they'd love as a gift 🎁</p>
        </div>

        {data.items.length === 0 ? (
          <p className="text-center text-plum/50">This wishlist is empty right now.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {data.items.map((p) => (
              <ProductCard key={p._id} toy={mapProduct(p)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}