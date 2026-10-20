import { useState } from "react";
import { Star } from "lucide-react";
import api from "../../services/api";
import Button from "../common/Button";

export default function ReviewForm({ productId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post(`/reviews/${productId}`, { rating, comment });
      setComment("");
      setRating(5);
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-plum/5 p-5">
      <p className="font-display font-bold text-sm text-plum mb-3">Write a Review</p>

      {error && <div className="bg-coral/10 text-coral text-sm rounded-xl px-4 py-2.5 mb-3">{error}</div>}

      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)}>
            <Star size={22} className={(hoverRating || rating) >= n ? "fill-butter text-butter" : "fill-plum/10 text-plum/10"} />
          </button>
        ))}
      </div>

      <textarea
        required
        rows={3}
        placeholder="Share your experience with this toy..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="input mb-3"
      />

      <Button type="submit" disabled={submitting}>
        {submitting ? "Posting..." : "Post Review"}
      </Button>
    </form>
  );
}