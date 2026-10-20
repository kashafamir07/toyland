import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minPurchase: "", expiryDate: "", description: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/discounts").then((res) => setDiscounts(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/discounts", { ...form, value: Number(form.value), minPurchase: Number(form.minPurchase) || 0 });
      setForm({ code: "", type: "percentage", value: "", minPurchase: "", expiryDate: "", description: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add discount code");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/discounts/${id}`);
    load();
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-plum mb-6">Discount Codes</h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="bg-white rounded-2xl border border-plum/5 divide-y divide-plum/5">
          {discounts.map((d) => (
            <div key={d._id} className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display font-extrabold text-plum">{d.code}</p>
                  <span
                    className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${
                      isExpired(d.expiryDate) ? "bg-plum/10 text-plum/50" : "bg-mint text-plum"
                    }`}
                  >
                    {isExpired(d.expiryDate) ? "Expired" : "Active"}
                  </span>
                </div>
                <p className="text-xs text-plum/50 mt-1">
                  {d.type === "percentage" ? `${d.value}% off` : `Rs. ${d.value} off`}
                  {d.minPurchase > 0 && ` · min. Rs. ${d.minPurchase.toLocaleString()}`} · expires{" "}
                  {new Date(d.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => handleDelete(d._id)} className="text-plum/30 hover:text-coral" aria-label="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {discounts.length === 0 && <p className="p-6 text-plum/50">No discount codes yet.</p>}
        </div>

        <div className="bg-white rounded-2xl border border-plum/5 p-6 h-fit">
          <h2 className="font-display font-extrabold text-plum mb-4">New Discount Code</h2>
          {error && <div className="bg-coral/10 text-coral text-sm rounded-xl px-4 py-2.5 mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              placeholder="CODE (e.g. TOYLAND15)"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="input"
            />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
              <option value="percentage">Percentage off</option>
              <option value="flat">Flat amount off</option>
            </select>
            <input
              required
              type="number"
              min="0"
              placeholder={form.type === "percentage" ? "Value (e.g. 15)" : "Value in Rs."}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="input"
            />
            <input
              type="number"
              min="0"
              placeholder="Min. purchase (optional)"
              value={form.minPurchase}
              onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
              className="input"
            />
            <label className="block">
              <span className="text-xs font-display font-bold text-plum/60 mb-1.5 block">Expiry Date</span>
              <input
                required
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="input"
              />
            </label>
            <Button type="submit" disabled={saving} className="w-full">
              <Plus size={16} /> {saving ? "Adding..." : "Add Discount Code"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}