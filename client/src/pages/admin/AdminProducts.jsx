import { useEffect, useState } from "react";
import { Plus, Pencil, Archive, RotateCcw, ImageOff } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";
import ProductFormModal from "../../components/admin/ProductFormModal";

const TABS = ["All", "Active", "Archived"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      api.get("/products/admin/all"),
      api.get("/categories"),
    ]);
    setProducts(productsRes.data);
    setCategories(categoriesRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = products.filter((p) => {
    if (tab === "Active") return p.isActive;
    if (tab === "Archived") return !p.isActive;
    return true;
  });

  const toggleArchive = async (product) => {
    await api.put(`/products/${product._id}`, { isActive: !product.isActive });
    loadData();
  };

  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-plum">Products</h1>
        <Button onClick={openAdd}>
          <Plus size={18} /> Add Product
        </Button>
      </div>

      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-display font-semibold transition-colors ${
              tab === t ? "bg-coral text-white" : "bg-white text-plum/60 border border-plum/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-plum/5 overflow-hidden">
        {loading ? (
          <p className="p-6 text-plum/50 font-display">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-cream/60 text-left text-xs font-display font-bold text-plum/50 uppercase">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum/5">
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-cream flex items-center justify-center shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff size={18} className="text-plum/20" />
                          )}
                        </div>
                        <span className="font-display font-bold text-plum">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-plum/60">{p.category?.name}</td>
                    <td className="p-4 font-display font-bold text-plum">Rs. {p.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={p.stock < 5 ? "text-coral font-bold" : "text-plum/70"}>
                        {p.stock} {p.stock < 5 && "⚠️"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${
                          p.isActive ? "bg-mint text-plum" : "bg-plum/10 text-plum/50"
                        }`}
                      >
                        {p.isActive ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-sky text-plum/60" aria-label="Edit">
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => toggleArchive(p)}
                          className="p-2 rounded-lg hover:bg-blush text-plum/60"
                          aria-label={p.isActive ? "Archive" : "Restore"}
                        >
                          {p.isActive ? <Archive size={16} /> : <RotateCcw size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}