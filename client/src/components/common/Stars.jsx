import { Star } from "lucide-react";

export default function Stars({ rating = 5, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-butter text-butter" : "fill-plum/10 text-plum/10"}
        />
      ))}
    </div>
  );
}