import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-plum shrink-0">
        <AdminSidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-plum/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-plum">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-plum/5 flex items-center justify-between px-4 h-16">
          <span className="font-display font-extrabold text-plum">
            TOY<span className="text-coral">LAND</span> Admin
          </span>
          <button onClick={() => setMobileOpen(true)} className="p-2" aria-label="Open menu">
            <Menu size={22} className="text-plum" />
          </button>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}