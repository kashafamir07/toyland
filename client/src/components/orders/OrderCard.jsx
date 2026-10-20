import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const statusColors = {
  "Order Confirmed": "bg-sky text-plum",
  Packed: "bg-butter text-plum",
  "Handed to Courier": "bg-peach text-plum",
  "Out for Delivery": "bg-coral/20 text-coral",
  Delivered: "bg-mint text-plum",
};

export default function OrderCard({ order }) {
  return (
    <Link
      to={`/orders/${order._id}`}
      className="block bg-white rounded-2xl border border-plum/5 p-5 hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-display font-extrabold text-plum text-sm">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-plum/40 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full shrink-0 ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-hidden">
        {order.items.slice(0, 5).map((item, i) => (
          <div key={i} className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center shrink-0 overflow-hidden text-lg">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              item.emoji || "🧸"
            )}
          </div>
        ))}
        {order.items.length > 5 && (
          <span className="text-xs text-plum/40 font-display font-bold">+{order.items.length - 5} more</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-plum/5">
        <p className="text-sm text-plum/50">
          {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
        </p>
        <div className="flex items-center gap-1">
          <span className="font-display font-extrabold text-plum">Rs. {order.grandTotal.toLocaleString()}</span>
          <ChevronRight size={16} className="text-plum/30" />
        </div>
      </div>
    </Link>
  );
}