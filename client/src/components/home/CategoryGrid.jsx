import { Link } from "react-router-dom";
import SectionHeading from "../common/SectionHeading";
import { getCategoryBg } from "../../utils/categoryStyles";

export default function CategoryGrid({ categories, loading }) {
  return (
     <section
  id="categories"
  className="bg-[#F9E0DD] py-16 sm:py-20"
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          eyebrow="Browse"
          title="Shop by Category"
          align="center"
        />

        {loading ? (
          <p className="text-center text-plum/40 font-display">
            Loading categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="text-center text-plum/40 font-display">
            No categories available.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">

            {categories.map((c) => {
              // Support different possible image field names
              const categoryBg =
  c.name === "Plush Toys"
    ? "bg-pink-50"
    : c.name === "Building Blocks"
    ? "bg-emerald-50"
    : c.name === "Cars & Vehicles"
    ? "bg-emerald-50"
    : c.name === "Dolls & Dollhouses"
    ? "bg-purple-50"
    : c.name === "Arts & Crafts"
    ? "bg-orange-50"
    : c.name === "Puzzles & Board Games"
    ? "bg-yellow-50"
    : "bg-cyan-50";
              const categoryImage =
                c.image ||
                c.imageUrl ||
                c.imageURL ||
                c.iconImage ||
                null;

              return (
                <Link
                  key={c._id || c.id}
                  to={`/shop?category=${encodeURIComponent(c.name)}`}
                  className={`group flex flex-col items-center text-center gap-3 p-5 rounded-2xl ${categoryBg} border border-plum/10 hover:shadow-card transition-all duration-200 hover:-translate-y-1`}
                >

                  {/* Category Image */}
                  <div
                    className={`
                      w-16 h-16
                      sm:w-20 sm:h-20
                      ${getCategoryBg(c.name)}
                      rounded-2xl
                      flex items-center justify-center
                      overflow-hidden
                      group-hover:scale-110
                      transition-transform
                      duration-200
                    `}
                  >
                    {categoryImage ? (
                      <img
                        src={categoryImage}
                        alt={c.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Category image failed:",
                            c.name,
                            categoryImage
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
                      className="text-3xl sm:text-4xl"
                      style={{
                        display: categoryImage ? "none" : "block",
                      }}
                    >
                      {c.icon || "🧸"}
                    </span>
                  </div>

                  {/* Category Name */}
<div
  className={`px-4 py-2.5 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200 ${
    c.name === "Plush Toys"
      ? "bg-pink-100"
      : c.name === "Building Blocks"
      ? "bg-emerald-100"
      : c.name === "Cars & Vehicles"
      ? "bg-blue-200"
      : c.name === "Dolls & Dollhouses"
      ? "bg-violet-100"
      : c.name === "Arts & Crafts"
      ? "bg-orange-100"
      : c.name === "Puzzles & Board Games"
      ? "bg-yellow-100"
      : "bg-cyan-200"
  }`}
>
  <p className="font-display font-bold text-sm sm:text-base text-plum">
    {c.name}
  </p>

  {c.description && (
    <p className="text-xs text-plum/60 hidden sm:block mt-1">
      {c.description}
    </p>
  )}
</div>

                </Link>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
}