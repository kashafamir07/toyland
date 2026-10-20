import { testimonials } from "../../data/staticContent";
import SectionHeading from "../common/SectionHeading";
import Stars from "../common/Stars";

export default function Testimonials() {
  return (
    <section className="bg-blush/30 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Loved by Parents"
          title="Customer Reviews"
          align="center"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 shadow-card"
            >
              <Stars rating={t.rating} size={16} />

              <p className="mt-4 text-plum/70 text-sm leading-relaxed">
                “{t.text}”
              </p>

              <div className="mt-5 flex items-center gap-3">
                <span className="text-2xl">{t.avatar}</span>

                <div>
                  <p className="font-display font-bold text-sm text-plum">
                    {t.name}
                  </p>

                  <p className="text-xs text-plum/40">
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}