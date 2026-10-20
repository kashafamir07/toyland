import { useEffect, useState } from "react";
import api from "../services/api";
import { mapProduct } from "../utils/mapProduct";
import Hero from "../components/home/Hero";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedToys from "../components/home/FeaturedToys";
import BestSellers from "../components/home/BestSellers";
import Testimonials from "../components/home/Testimonials";
import TrustBadges from "../components/home/TrustBadges";
export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/categories"), api.get("/products")])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data);
        setProducts(prodRes.data.map(mapProduct));
      })
      .finally(() => setLoading(false));
  }, []);

  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const bestSellers = products.filter((p) => p.badge === "Best Seller");

  return (
    <>
      <Hero />
      <section id="categories">
       <CategoryGrid
       categories={categories}
       loading={loading}
       />
      </section>
      <FeaturedToys products={featured} loading={loading} />
      <section id="best-sellers">
     <BestSellers
      products={
       bestSellers.length
        ? bestSellers
        : products.slice(0, 6)
       }
      loading={loading}
     />
      </section>
      <Testimonials />
      <TrustBadges />
    </>
  );
}