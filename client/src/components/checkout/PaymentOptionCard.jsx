export default function PaymentOptionCard({ icon, title, desc, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
        selected ? "border-coral bg-coral/5" : "border-plum/10 hover:border-plum/20 bg-white"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-display font-bold text-sm text-plum">{title}</p>
        <p className="text-xs text-plum/50">{desc}</p>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          selected ? "border-coral" : "border-plum/20"
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-coral" />}
      </div>
    </button>
  );
}