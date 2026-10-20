import { useEffect, useState } from "react";
import { DollarSign, ClipboardList, Package, Users } from "lucide-react";
import api from "../../services/api";
import StatsCard from "../../components/admin/StatsCard";

const statusColors = {
  "Order Confirmed": "bg-sky text-plum",
  Packed: "bg-butter text-plum",
  "Handed to Courier": "bg-peach text-plum",
  "Out for Delivery": "bg-coral/20 text-coral",
  Delivered: "bg-mint text-plum",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-plum/50 font-display">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-plum mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={DollarSign} label="Total Sales" value={`Rs. ${stats.totalSales.toLocaleString()}`} bg="bg-mint" />
        <StatsCard icon={ClipboardList} label="Total Orders" value={stats.totalOrders} bg="bg-sky" />
        <StatsCard icon={Package} label="Total Products" value={stats.totalProducts} bg="bg-butter" />
        <StatsCard icon={Users} label="Total Customers" value={stats.totalCustomers} bg="bg-blush" />
      </div>

      <div className="bg-white rounded-2xl border border-plum/5 p-5 sm:p-6">
        <h2 className="font-display font-extrabold text-lg text-plum mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-xs font-display font-bold text-plum/50 uppercase">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plum/5">
              {stats.recentOrders.map((o) => (
                <tr key={o._id}>
                  <td className="py-3">{o.user?.name}</td>
                  <td className="py-3 font-display font-bold text-plum">Rs. {o.grandTotal.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-plum/50">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}