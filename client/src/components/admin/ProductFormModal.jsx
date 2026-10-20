import { useEffect, useState } from "react";
import { X, Upload, ImageOff } from "lucide-react";
import api from "../../services/api";
import Button from "../common/Button";

const AGE_GROUPS = ["0-2 Years", "3-5 Years", "6-8 Years"];

const emptyForm = {
  name: "",
  description: "",
  category: "",
  ageGroup: AGE_GROUPS[0],
  price: "",
  oldPrice: "",
  stock: "",
  badge: "",
  image: "",
};

export default function ProductFormModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || "",
        category: product.category?._id || "",
        ageGroup: product.ageGroup,
        price: product.price,
        oldPrice: product.oldPrice || "",
        stock: product.stock,
        badge: product.badge || "",
        image: product.images?.[0] || "",
      });
    }
  }, [product]);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleChange("image", res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.image) {
      setError("Please upload a product image");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        ageGroup: form.ageGroup,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        badge: form.badge || null,
        images: [form.image],
      };

      if (product) {
        await api.put(`/products/${product._id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-plum/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-extrabold text-lg text-plum">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-plum/50 hover:text-coral">
            <X size={20} />
          </button>
        </div>

        {error && <div className="bg-coral/10 text-coral text-sm rounded-xl px-4 py-2.5 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload */}
          <FormField label="Product Image">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-plum/15 bg-cream flex items-center justify-center overflow-hidden shrink-0">
                {uploading ? (
                  <span className="text-xs text-plum/40 font-display font-semibold text-center px-1">Uploading...</span>
                ) : form.image ? (
                  <img src={form.image} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <ImageOff size={24} className="text-plum/20" />
                )}
              </div>
              <label className="flex-1">
                <span className="inline-flex items-center gap-2 cursor-pointer bg-white border-2 border-plum/10 hover:border-coral hover:text-coral rounded-xl px-4 py-2.5 text-sm font-display font-semibold text-plum transition-colors">
                  <Upload size={16} />
                  {form.image ? "Change Image" : "Upload Image"}
                </span>
                <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileSelect} className="hidden" disabled={uploading} />
                <p className="text-[11px] text-plum/40 mt-1.5">JPG, PNG or WebP. Max 5MB.</p>
              </label>
            </div>
          </FormField>

          <FormField label="Name">
            <input required value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="input" />
          </FormField>

          <FormField label="Description">
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="input"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category">
              <select required value={form.category} onChange={(e) => handleChange("category", e.target.value)} className="input">
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Age Group">
              <select value={form.ageGroup} onChange={(e) => handleChange("ageGroup", e.target.value)} className="input">
                {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </FormField>

            <FormField label="Price (Rs.)">
              <input required type="number" min="0" value={form.price} onChange={(e) => handleChange("price", e.target.value)} className="input" />
            </FormField>

            <FormField label="Old Price (optional)">
              <input type="number" min="0" value={form.oldPrice} onChange={(e) => handleChange("oldPrice", e.target.value)} className="input" />
            </FormField>

            <FormField label="Stock">
              <input required type="number" min="0" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} className="input" />
            </FormField>

            <FormField label="Badge (optional)">
              <input placeholder="e.g. Best Seller" value={form.badge} onChange={(e) => handleChange("badge", e.target.value)} className="input" />
            </FormField>
          </div>

          <Button type="submit" disabled={saving || uploading} className="w-full">
            {saving ? "Saving..." : product ? "Update Product" : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-display font-bold text-plum/60 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}