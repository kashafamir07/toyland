export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full px-6 py-3 transition-all duration-200 active:scale-95";
  const variants = {
    primary: "bg-coral text-white shadow-soft hover:bg-coral-dark hover:-translate-y-0.5",
    outline: "border-2 border-plum/15 text-plum hover:border-coral hover:text-coral",
    ghost: "text-plum hover:text-coral",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}