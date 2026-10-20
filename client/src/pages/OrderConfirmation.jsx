import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const order = location.state?.order;

  const isGuestOrder = order && !order.user;

  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setCreating(true);
    try {
      await register(order.guestInfo.name, order.guestInfo.email, password, order.guestInfo.phone);
      setAccountCreated(true);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create account — that email may already be registered.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="bg-cream min-h-screen py-20 flex items-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        <CheckCircle2 size={64} className="text-mint mx-auto" strokeWidth={1.5} />
        <h1 className="font-display text-3xl font-extrabold text-plum mt-6">Order Placed!</h1>
        <p className="text-plum/60 mt-2 mb-6">
          Thanks for shopping with TOYLAND — your toys are being packed with care. 🎁
        </p>

        {order && (
          <div className="bg-white rounded-2xl border border-plum/5 p-6 text-left mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-plum/50">Order ID</span>
              <span className="font-display font-bold text-plum">#{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-plum/50">Status</span>
              <span className="font-display font-bold text-plum bg-mint/40 px-2 py-0.5 rounded-full text-xs">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-plum/50">Total Paid</span>
              <span className="font-display font-extrabold text-coral">Rs. {order.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {isGuestOrder && !accountCreated && (
          <div className="bg-white rounded-2xl border-2 border-mint p-6 text-left mb-8">
            <p className="font-display font-extrabold text-plum flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-coral" /> Save this order to an account
            </p>
            <p className="text-sm text-plum/60 mb-4">
              Just set a password — we'll use <span className="font-semibold text-plum">{order.guestInfo.email}</span> so you can track this order and check out faster next time.
            </p>

            {error && <div className="bg-coral/10 text-coral text-sm rounded-xl px-4 py-2.5 mb-3">{error}</div>}

            <form onSubmit={handleCreateAccount} className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input flex-1"
              />
              <Button type="submit" disabled={creating} className="shrink-0">
                {creating ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </div>
        )}

        {accountCreated && (
          <div className="bg-mint/20 border border-mint rounded-2xl p-5 mb-8 text-sm text-plum">
            🎉 Account created! You're now logged in.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {order && (
            <Link to={`/orders/${order._id}`}>
              <Button variant="outline">Track Order</Button>
            </Link>
          )}
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}