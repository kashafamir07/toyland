import { useNavigate } from "react-router-dom";
import { AGE_FILTERS } from "../../utils/constants";

export default function AgeFilter() {
  const navigate = useNavigate();

  return (
    <section className="bg-white pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-display font-bold text-plum mb-4 text-center sm:text-left">Shop by Age</p>
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {AGE_FILTERS.map((age) => (
            <button
              key={age}
              onClick={() => navigate(`/shop?age=${encodeURIComponent(age)}`)}
              className="px-5 py-2.5 rounded-full font-display font-semibold text-sm border-2 border-plum/10 text-plum/70 hover:border-coral hover:text-coral transition-colors"
            >
              {age}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}