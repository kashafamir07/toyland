export default function SectionHeading({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center mx-auto max-w-2xl" : ""}`}>
      {eyebrow && (
        <span className="inline-block font-display text-sm font-bold tracking-wide text-coral uppercase mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-plum">{title}</h2>
      {subtitle && <p className="mt-3 text-plum/60 font-body text-base sm:text-lg">{subtitle}</p>}
    </div>
  );
}