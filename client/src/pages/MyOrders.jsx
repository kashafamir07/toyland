import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import api from "../services/api";
import OrderCard from "../components/orders/OrderCard";
import Button from "../components/common/Button";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-plum mb-8">My Orders</h1>

        {loading ? (
          <p className="text-plum/40 font-display">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-plum/5 p-12 text-center">
            <PackageSearch size={48} className="text-plum/20 mx-auto" />
            <p className="font-display font-bold text-lg text-plum mt-4">No orders yet</p>
            <p className="text-plum/50 text-sm mt-1 mb-5">Your order history will show up here.</p>
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}