import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import api from "../services/api";
import { mapProduct } from "../utils/mapProduct";
import { PRICE_RANGES } from "../utils/constants";
import FilterSidebar from "../components/shop/FilterSidebar";
import ProductCard from "../components/product/ProductCard";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialAge = searchParams.get("age");

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [selectedAges, setSelectedAges] = useState(initialAge ? [initialAge] : []);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/products"), api.get("/categories")])
      .then(([prodRes, catRes]) => {
        setAllProducts(prodRes.data.map(mapProduct));
        setCategories(catRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (name) =>
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  const toggleAge = (age) =>
    setSelectedAges((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedAges([]);
    setSelectedPrice(null);
  };

  const filteredProducts = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === selectedPrice);
    return allProducts.filter((p) => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchAge = selectedAges.length === 0 || selectedAges.includes(p.ageGroup);
      const matchPrice = !range || (p.price >= range.min && p.price < range.max);
      return matchCategory && matchAge && matchPrice;
    });
  }, [allProducts, selectedCategories, selectedAges, selectedPrice]);

  const activeFilterCount = selectedCategories.length + selectedAges.length + (selectedPrice ? 1 : 0);

  return (
    <section className="bg-cream py-10 sm:py-14 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-plum">Shop All Toys</h1>
          <p className="text-plum/60 mt-2 text-sm sm:text-base">
            {loading ? "Loading..." : `${filteredProducts.length} ${filteredProducts.length === 1 ? "toy" : "toys"} found`}
          </p>
        </div>

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden mb-6 w-full flex items-center justify-center gap-2 bg-white border border-plum/10 rounded-full py-3 font-display font-semibold text-sm text-plum shadow-card"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-coral text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="hidden lg:block sticky top-24 h-fit">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectedAges={selectedAges}
              toggleAge={toggleAge}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              onClear={clearFilters}
            />
          </aside>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-plum/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-cream overflow-y-auto p-4">
                <FilterSidebar
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  selectedAges={selectedAges}
                  toggleAge={toggleAge}
                  selectedPrice={selectedPrice}
                  setSelectedPrice={setSelectedPrice}
                  onClear={clearFilters}
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </div>
            </div>
          )}

          <div>
            {loading ? (
              <p className="text-plum/40 font-display">Loading toys...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-plum/5 p-12 text-center">
                <span className="text-5xl">🔍</span>
                <p className="font-display font-bold text-lg text-plum mt-4">No toys match your filters</p>
                <p className="text-plum/50 text-sm mt-1 mb-5">Try adjusting or clearing your filters.</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-coral font-display font-bold text-sm hover:underline"
                >
                  <X size={16} /> Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((toy) => (
                  <ProductCard key={toy.id} toy={toy} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}