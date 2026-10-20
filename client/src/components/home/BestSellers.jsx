import SectionHeading from "../common/SectionHeading";

export default function BestSellers({ products, loading }) {
  return (
    <section
      id="best-sellers"
      className="bg-white py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          eyebrow="Trending"
          title="Best Sellers"
          subtitle="Swipe to see what's flying off the shelves"
        />

        {loading ? (
          <p className="text-plum/40 font-display">
            Loading...
          </p>
        ) : (
          <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">

            {products.map((toy) => (
              <div
                key={toy.id}
                className="snap-start shrink-0 w-40 sm:w-52 bg-cream rounded-2xl border border-plum/5 p-4 hover:shadow-card transition-shadow"
              >

                {/* Product Image */}
                <div
                  className={`${toy.bg || "bg-gray-100"} rounded-xl h-24 sm:h-32 flex items-center justify-center overflow-hidden mb-3`}
                >
                  {toy.image ? (
                    <img
                      src={toy.image}
                      alt={toy.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(
                          "Best Seller image failed:",
                          toy.name,
                          toy.image
                        );

                        e.currentTarget.style.display = "none";

                        const fallback =
                          e.currentTarget.nextElementSibling;

                        if (fallback) {
                          fallback.style.display = "block";
                        }
                      }}
                    />
                  ) : null}

                  {/* Emoji fallback */}
                  <span
                    className="text-5xl sm:text-6xl"
                    style={{
                      display: toy.image ? "none" : "block",
                    }}
                  >
                    {toy.emoji || "🧸"}
                  </span>
                </div>

                {/* Product Name */}
                <p className="font-display font-bold text-sm text-plum leading-snug">
                  {toy.name}
                </p>

                {/* Reviews */}
                <p className="text-xs text-plum/40 mt-1">
                  {toy.reviews || 0}+ reviews
                </p>

                {/* Price */}
                <p className="font-display font-extrabold text-plum mt-1">
                  Rs. {(toy.price || 0).toLocaleString()}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}