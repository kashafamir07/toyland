import { ShieldCheck, Truck, RotateCcw, Wallet } from "lucide-react";
import { trustBadges } from "../../data/staticContent";

const icons = [ShieldCheck, Truck, RotateCcw, Wallet];

export default function TrustBadges() {
  return (
    <section className="bg-white py-12 sm:py-16 border-t border-plum/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {trustBadges.map((b, i) => {
            const Icon = icons[i];

            return (
              <div
                key={b.title}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
              >
                <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-plum" />
                </div>

                <div>
                  <p className="font-display font-bold text-sm text-plum">
                    {b.title}
                  </p>

                  <p className="text-xs text-plum/50">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}