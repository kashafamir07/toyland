import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", icon: "🧸", description: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/categories").then((res) => setCategories(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/categories", form);
      setForm({ name: "", icon: "🧸", description: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-plum mb-6">Categories</h1>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-2xl border border-plum/5 divide-y divide-plum/5">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-display font-bold text-plum text-sm">{c.name}</p>
                  <p className="text-xs text-plum/40">{c.description}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(c._id)} className="text-plum/30 hover:text-coral" aria-label="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {categories.length === 0 && <p className="p-6 text-plum/50">No categories yet.</p>}
        </div>

        <div className="bg-white rounded-2xl border border-plum/5 p-6 h-fit">
          <h2 className="font-display font-extrabold text-plum mb-4">Add Category</h2>
          {error && <div className="bg-coral/10 text-coral text-sm rounded-xl px-4 py-2.5 mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
            <input
              placeholder="Icon (emoji)"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="input"
            />
            <textarea
              placeholder="Description"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
            />
            <Button type="submit" disabled={saving} className="w-full">
              <Plus size={16} /> {saving ? "Adding..." : "Add Category"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}