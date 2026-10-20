export default function StatsCard({ icon: Icon, label, value, bg }) {
  return (
    <div className="bg-white rounded-2xl border border-plum/5 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon size={22} className="text-plum" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-plum/50 font-body">{label}</p>
        <p className="font-display font-extrabold text-xl text-plum truncate">{value}</p>
      </div>
    </div>
  );
}