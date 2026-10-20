import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  User,
  Package,
  LogOut,
} from "lucide-react";

import { categories } from "../../data/toys";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to Best Sellers
  const handleDealsClick = (e) => {
    e.preventDefault();

    setMenuOpen(false);

    if (location.pathname === "/") {
      const section = document.getElementById("best-sellers");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      navigate("/");

      setTimeout(() => {
        const section =
          document.getElementById("best-sellers");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-plum/5">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
          >
            <span className="text-2xl">🧸</span>

            <span className="font-display text-2xl font-extrabold text-plum">
              TOY<span className="text-coral">LAND</span>
            </span>
          </Link>


          {/* =================================================
              DESKTOP SEARCH
          ================================================= */}

          <div className="hidden md:flex flex-1 max-w-md relative">

            <input
              type="text"
              placeholder="Search for toys, categories..."
              className="w-full rounded-full border border-plum/10 bg-white px-5 py-2.5 pr-11 text-sm font-body focus:outline-none focus:ring-2 focus:ring-coral/40"
            />

            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-plum/40"
              size={18}
            />

          </div>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden lg:flex items-center gap-6 font-display font-semibold text-sm text-plum/80">

            <Link
              to="/shop"
              className="hover:text-coral transition-colors"
            >
              Shop
            </Link>

            <Link
              to="/toy-box"
              className="hover:text-coral transition-colors"
            >
              Toy Box
            </Link>

            {/* DEALS → BEST SELLERS */}

            <button
              type="button"
              onClick={handleDealsClick}
              className="bg-transparent border-0 p-0 cursor-pointer font-inherit text-inherit hover:text-coral transition-colors"
            >
              Deals
            </button>

            <Link
              to="/contact"
              className="hover:text-coral transition-colors"
            >
              Contact
            </Link>

          </nav>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-2 sm:gap-4">

            {/* ACCOUNT */}

            <div className="relative hidden sm:block">

              <button
                onClick={() =>
                  setAccountOpen((o) => !o)
                }
                aria-label="Account"
                className="p-2 rounded-full hover:bg-mint transition-colors"
              >
                <User
                  size={22}
                  className="text-plum"
                />
              </button>


              {accountOpen && (
                <>

                  <div
                    className="fixed inset-0 z-10"
                    onClick={() =>
                      setAccountOpen(false)
                    }
                  />

                  <div className="absolute right-0 top-12 z-20 bg-white rounded-2xl shadow-card border border-plum/5 w-48 py-2">

                    {user ? (
                      <>

                        <div className="px-4 py-2 border-b border-plum/5 mb-1">

                          <p className="text-sm font-display font-bold text-plum truncate">
                            {user.name}
                          </p>

                          <p className="text-xs text-plum/40 truncate">
                            {user.email}
                          </p>

                        </div>


                        <Link
                          to="/orders"
                          onClick={() =>
                            setAccountOpen(false)
                          }
                          className="flex items-center gap-2 px-4 py-2 text-sm text-plum/70 hover:bg-cream hover:text-plum"
                        >
                          <Package size={16} />
                          My Orders
                        </Link>


                        <button
                          onClick={() => {
                            logout();
                            setAccountOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-plum/70 hover:bg-cream hover:text-coral"
                        >
                          <LogOut size={16} />
                          Log Out
                        </button>

                      </>
                    ) : (
                      <>

                        <Link
                          to="/login"
                          onClick={() =>
                            setAccountOpen(false)
                          }
                          className="block px-4 py-2 text-sm text-plum/70 hover:bg-cream hover:text-plum"
                        >
                          Log In
                        </Link>

                        <Link
                          to="/register"
                          onClick={() =>
                            setAccountOpen(false)
                          }
                          className="block px-4 py-2 text-sm text-plum/70 hover:bg-cream hover:text-plum"
                        >
                          Sign Up
                        </Link>

                      </>
                    )}

                  </div>

                </>
              )}

            </div>


            {/* WISHLIST */}

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="p-2 rounded-full hover:bg-blush transition-colors"
            >
              <Heart
                size={22}
                className="text-plum"
              />
            </Link>


            {/* CART */}

            <Link
              to="/cart"
              aria-label="Cart"
              className="relative p-2 rounded-full hover:bg-sky transition-colors"
            >

              <ShoppingCart
                size={22}
                className="text-plum"
              />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-floatSlow">
                  {cartCount}
                </span>
              )}

            </Link>


            {/* MOBILE MENU */}

            <button
              className="lg:hidden p-2 rounded-full hover:bg-plum/5"
              onClick={() =>
                setMenuOpen((o) => !o)
              }
              aria-label="Menu"
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {menuOpen && (

        <div className="lg:hidden border-t border-plum/5 bg-cream px-4 pb-4">

          {/* MOBILE SEARCH */}

          <div className="relative my-3">

            <input
              type="text"
              placeholder="Search for toys..."
              className="w-full rounded-full border border-plum/10 bg-white px-5 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
            />

            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-plum/40"
              size={18}
            />

          </div>


          {/* MOBILE NAVIGATION */}

          <div className="flex flex-col gap-1 font-display font-semibold text-plum/80">

            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-2 rounded-lg hover:bg-white"
            >
              Shop
            </Link>


            <Link
              to="/toy-box"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-2 rounded-lg hover:bg-white"
            >
              🎁 Toy Box
            </Link>


            {/* MOBILE DEALS */}

            <button
              type="button"
              onClick={handleDealsClick}
              className="w-full text-left py-2 px-2 rounded-lg hover:bg-white bg-transparent border-0 font-inherit text-plum/80"
            >
              Deals
            </button>


            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-2 rounded-lg hover:bg-white flex items-center gap-2"
            >
              <Heart size={18} />
              Wishlist
            </Link>

          </div>


          {/* =================================================
              MOBILE CATEGORY LINKS
          ================================================= */}

          <div className="border-t border-plum/10 mt-3 pt-3">

            <p className="px-2 mb-2 text-xs uppercase tracking-wider text-plum/40 font-bold">
              Shop by Category
            </p>

            <div className="flex flex-col gap-1">

              {categories.map((c) => (

                <Link
                  key={c.id}
                  to={`/shop?category=${encodeURIComponent(c.name)}`}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="py-2 px-2 rounded-lg hover:bg-white flex items-center gap-2"
                >

                  <span>{c.icon}</span>

                  {c.name}

                </Link>

              ))}

            </div>

          </div>


          {/* =================================================
              MOBILE ACCOUNT
          ================================================= */}

          <div className="border-t border-plum/10 mt-3 pt-3 flex flex-col gap-1 font-display font-semibold text-plum/80">

            {user ? (
              <>

                <Link
                  to="/orders"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="py-2 px-2 rounded-lg hover:bg-white flex items-center gap-2"
                >
                  <Package size={18} />
                  My Orders
                </Link>


                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="py-2 px-2 rounded-lg hover:bg-white flex items-center gap-2 text-left"
                >
                  <LogOut size={18} />
                  Log Out
                </button>

              </>
            ) : (

              <Link
                to="/login"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="py-2 px-2 rounded-lg hover:bg-white flex items-center gap-2"
              >
                <User size={18} />
                Login / Register
              </Link>

            )}

          </div>

        </div>

      )}

    </header>
  );
}