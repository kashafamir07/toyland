import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";
import OrderTracker from "../components/orders/OrderTracker";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load this order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="bg-cream min-h-screen py-20 text-center">
        <p className="font-display text-plum/50">Loading order...</p>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="bg-cream min-h-screen py-20 text-center px-4">
        <span className="text-5xl">🔍</span>
        <h1 className="font-display text-2xl font-extrabold text-plum mt-4">{error || "Order not found"}</h1>
        <Link to="/orders" className="text-coral font-display font-bold hover:underline mt-4 inline-block">
          ← Back to My Orders
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-plum/50 hover:text-coral font-display font-semibold mb-6">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        <div className="bg-white rounded-2xl border border-plum/5 p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-plum">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-plum/40 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <span className="text-xs font-display font-bold px-3 py-1.5 rounded-full bg-mint text-plum">
              {order.status}
            </span>
          </div>

          <OrderTracker currentStatus={order.status} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-plum/5 p-5">
            <p className="text-xs font-display font-bold text-plum/50 uppercase mb-2">Shipping To</p>
            <p className="text-sm text-plum">{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
            <p className="text-sm text-plum/60">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
          </div>
          <div className="bg-white rounded-2xl border border-plum/5 p-5">
            <p className="text-xs font-display font-bold text-plum/50 uppercase mb-2">Payment Method</p>
            <p className="text-sm text-plum capitalize">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-plum/5 p-5 sm:p-6">
          <p className="text-xs font-display font-bold text-plum/50 uppercase mb-3">Items</p>
          <div className="divide-y divide-plum/5 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center shrink-0 overflow-hidden text-xl">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.emoji || "🧸"
                  )}
                </div>
                <span className="flex-1 text-sm text-plum/70">{item.name} × {item.quantity}</span>
                <span className="font-display font-bold text-plum text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-3 border-t border-plum/10 text-sm">
            <div className="flex justify-between text-plum/60">
              <span>Subtotal</span>
              <span>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-plum/60">
              <span>Delivery</span>
              <span>Rs. {order.deliveryCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-display font-extrabold text-plum text-base pt-2 border-t border-plum/10">
              <span>Grand Total</span>
              <span className="text-coral">Rs. {order.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}