import { categories } from "../../data/toys";

export default function Footer() {
  return (
    <footer className="bg-plum text-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🧸</span>

            <span className="font-display text-xl font-extrabold text-white">
              TOY<span className="text-coral">LAND</span>
            </span>
          </div>

          <p className="text-sm text-cream/60 max-w-xs">
            Toys made for little dreamers, builders & explorers — delivered
            across Pakistan.
          </p>

          {/* Social Media */}
          <div className="flex gap-3 mt-5">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-coral transition-colors text-xs font-bold"
            >
              IG
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-coral transition-colors text-xs font-bold"
            >
              X
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <p className="font-display font-bold text-white mb-4">
            Categories
          </p>

          <ul className="space-y-2 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <a
                  href="#"
                  className="hover:text-coral transition-colors"
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className="font-display font-bold text-white mb-4">
            Support
          </p>

          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-coral transition-colors">
                Track Order
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-coral transition-colors">
                Returns & Refunds
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-coral transition-colors">
                Contact Us
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-coral transition-colors">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Payment Options */}
        <div>
          <p className="font-display font-bold text-white mb-4">
            Payment Options
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {["COD", "JazzCash", "Easypaisa", "Visa", "Mastercard"].map(
              (p) => (
                <span
                  key={p}
                  className="bg-white/10 px-3 py-1.5 rounded-lg"
                >
                  {p}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} TOYLAND. All rights reserved.
      </div>
    </footer>
  );
}