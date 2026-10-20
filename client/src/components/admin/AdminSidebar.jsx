import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Package, Tag, ClipboardList, Percent, Store, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/discounts", label: "Discounts", icon: Percent },
];

export default function AdminSidebar({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🧸</span>
          <span className="font-display text-xl font-extrabold text-white">
            TOY<span className="text-coral">LAND</span>
          </span>
        </Link>
        <p className="text-xs text-cream/40 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-semibold text-sm transition-colors ${
                isActive ? "bg-coral text-white" : "text-cream/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-cream/40 px-2 mb-2 truncate">{user?.name} · {user?.email}</p>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-semibold text-sm text-cream/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} /> Log Out
        </button>
        <Link
          to="/"
          className="mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-semibold text-sm text-cream/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Store size={18} /> Back to Store
        </Link>
      </div>
    </div>
  );
}