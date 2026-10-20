import SectionHeading from "../common/SectionHeading";
import ProductCard from "../product/ProductCard";

export default function FeaturedToys({ products, loading }) {
  return (
    <section className="bg-cream py-16 sm:py-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          eyebrow="Handpicked"
          title="Featured Toys"
          subtitle="Popular picks parents & kids love right now"
        />

        {loading ? (
          <p className="text-plum/40 font-display">
            Loading toys...
          </p>
        ) : products.length === 0 ? (
          <p className="text-plum/40 font-display">
            No toys available right now.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

            {products.map((toy) => (
              <ProductCard
                key={toy.id}
                toy={toy}
              />
            ))}

          </div>
        )}

      </div>

    </section>
  );
}