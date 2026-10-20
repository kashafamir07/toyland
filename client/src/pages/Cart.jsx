import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Button from "../components/common/Button";

export default function Cart() {
  const {
    items, removeFromCart, updateQuantity,
    subtotal, discountAmount, giftWrapFee, deliveryCharge, grandTotal,
    bundleEligible, isBundleActive, buildYourBox, setBuildYourBox,
  } = useCart();

  if (items.length === 0) {
    return (
      <section className="bg-cream min-h-screen py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-6xl">🛒</span>
          <h1 className="font-display text-3xl font-extrabold text-plum mt-6">Your cart is empty</h1>
          <p className="text-plum/60 mt-2 mb-8">Looks like you haven't added any toys yet.</p>
          <Link to="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-plum mb-8 flex items-center gap-3">
          <ShoppingBag className="text-coral" /> Your Cart
        </h1>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="bg-white rounded-2xl border border-plum/5 overflow-hidden">
            {/* Desktop table */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="bg-cream/60 text-left text-xs font-display font-bold text-plum/60 uppercase">
                  <th className="p-4">Toy</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Subtotal</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-plum/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden`}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            item.emoji
                          )}
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm text-plum">{item.name}</p>
                          <p className="text-xs text-plum/40">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-plum/70">Rs. {item.price.toLocaleString()}</td>
                    <td className="p-4">
                      <QuantityStepper item={item} updateQuantity={updateQuantity} />
                    </td>
                    <td className="p-4 font-display font-bold text-sm text-plum">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove"
                        className="text-plum/30 hover:text-coral transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-plum/5">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex gap-3">
                  <div className={`w-16 h-16 ${item.bg} rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden`}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.emoji
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display font-bold text-sm text-plum">{item.name}</p>
                        <p className="text-xs text-plum/40">Rs. {item.price.toLocaleString()} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove"
                        className="text-plum/30 hover:text-coral shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <QuantityStepper item={item} updateQuantity={updateQuantity} />
                      <p className="font-display font-bold text-sm text-plum">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-plum/5 p-6 h-fit sticky top-24">
            <h2 className="font-display font-extrabold text-lg text-plum mb-5">Order Summary</h2>

            {bundleEligible && !buildYourBox && (
              <button
                onClick={() => setBuildYourBox(true)}
                className="w-full text-left bg-mint/20 border border-mint rounded-xl p-3 text-xs font-display font-semibold text-plum mb-4 hover:bg-mint/30 transition-colors"
              >
                🎁 You've got {items.length} different toys — activate Build Your Toy Box for 15% off!
              </button>
            )}
            {buildYourBox && (
              <div className="flex items-center justify-between bg-mint/20 border border-mint rounded-xl p-3 mb-4">
                <span className="text-xs font-display font-semibold text-plum">🎁 Toy Box Bundle Active</span>
                <button onClick={() => setBuildYourBox(false)} className="text-xs text-plum/50 hover:text-coral underline">
                  Remove
                </button>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-plum/70">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {isBundleActive && (
                <div className="flex justify-between text-plum font-semibold">
                  <span>🎁 Toy Box Discount</span>
                  <span>− Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              {giftWrapFee > 0 && (
                <div className="flex justify-between text-plum/70">
                  <span>Gift Wrapping</span>
                  <span>Rs. {giftWrapFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-plum/70">
                <span>Delivery Charges</span>
                <span>Rs. {deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="border-t border-plum/10 pt-3 flex justify-between font-display font-extrabold text-plum text-base">
                <span>Grand Total</span>
                <span className="text-coral">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full mt-6">Proceed to Checkout</Button>
            </Link>
            <Link to="/shop" className="block text-center text-sm text-plum/50 hover:text-coral mt-4">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuantityStepper({ item, updateQuantity }) {
  return (
    <div className="flex items-center gap-1 border border-plum/10 rounded-full w-fit">
      <button
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        className="w-7 h-7 flex items-center justify-center text-plum/60 hover:text-coral"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-sm font-display font-bold text-plum">{item.quantity}</span>
      <button
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
        className="w-7 h-7 flex items-center justify-center text-plum/60 hover:text-coral"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}