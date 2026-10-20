import { X } from "lucide-react";
import { AGE_FILTERS, PRICE_RANGES } from "../../utils/constants";

export default function FilterSidebar({
  categories,
  selectedCategories,
  toggleCategory,
  selectedAges,
  toggleAge,
  selectedPrice,
  setSelectedPrice,
  onClear,
  onClose,
}) {
  const hasActiveFilters =
    selectedCategories.length > 0 || selectedAges.length > 0 || selectedPrice;

  return (
    <div className="bg-white rounded-2xl border border-plum/5 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-extrabold text-lg text-plum">Filters</h3>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-xs font-display font-bold text-coral hover:underline"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 text-plum/60" aria-label="Close filters">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <p className="font-display font-bold text-sm text-plum mb-3">Category</p>
        <div className="space-y-2">
           {categories.map((c) => (
              <label key={c._id} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedCategories.includes(c.name)}
              onChange={() => toggleCategory(c.name)}
              className="w-4 h-4 rounded accent-coral cursor-pointer"
             />
            <span className="text-sm text-plum/70 group-hover:text-plum">
              {c.icon} {c.name}
            </span>
              </label>
         ))}
        </div>
      </div>

      {/* Age Group */}
      <div className="mb-6">
        <p className="font-display font-bold text-sm text-plum mb-3">Age Group</p>
        <div className="space-y-2">
          {AGE_FILTERS.map((age) => (
            <label key={age} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedAges.includes(age)}
                onChange={() => toggleAge(age)}
                className="w-4 h-4 rounded accent-coral cursor-pointer"
              />
              <span className="text-sm text-plum/70 group-hover:text-plum">{age}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="font-display font-bold text-sm text-plum mb-3">Price Range</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="price"
              checked={!selectedPrice}
              onChange={() => setSelectedPrice(null)}
              className="w-4 h-4 accent-coral cursor-pointer"
            />
            <span className="text-sm text-plum/70 group-hover:text-plum">All Prices</span>
          </label>
          {PRICE_RANGES.map((range) => (
            <label key={range.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={selectedPrice === range.id}
                onChange={() => setSelectedPrice(range.id)}
                className="w-4 h-4 accent-coral cursor-pointer"
              />
              <span className="text-sm text-plum/70 group-hover:text-plum">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}