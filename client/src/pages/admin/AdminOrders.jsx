import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import api from "../../services/api";
import OrderDetailsModal from "../../components/admin/OrderDetailsModal";

const STATUSES = ["Order Confirmed", "Packed", "Handed to Courier", "Out for Delivery", "Delivered"];

const statusColors = {
  "Order Confirmed": "bg-sky text-plum",
  Packed: "bg-butter text-plum",
  "Handed to Courier": "bg-peach text-plum",
  "Out for Delivery": "bg-coral/20 text-coral",
  Delivered: "bg-mint text-plum",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const load = () => api.get("/orders").then((res) => setOrders(res.data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-plum mb-6">Orders</h1>

      <div className="bg-white rounded-2xl border border-plum/5 overflow-hidden">
        {loading ? (
          <p className="p-6 text-plum/50 font-display">Loading orders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-cream/60 text-left text-xs font-display font-bold text-plum/50 uppercase">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum/5">
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="p-4">
                      <p className="font-display font-bold text-plum">{o.user?.name}</p>
                      <p className="text-xs text-plum/40">{o.user?.email}</p>
                    </td>
                    <td className="p-4 font-display font-bold text-plum">Rs. {o.grandTotal.toLocaleString()}</td>
                    <td className="p-4 text-plum/60 capitalize">{o.paymentMethod}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className={`text-xs font-display font-bold px-2.5 py-1.5 rounded-full border-0 cursor-pointer ${statusColors[o.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-plum/50">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 rounded-lg hover:bg-sky text-plum/60"
                        aria-label="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}