import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Stepper from "../components/checkout/Stepper";
import PaymentOptionCard from "../components/checkout/PaymentOptionCard";
import GiftWrapOption from "../components/checkout/GiftWrapOption";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";

const STEPS = ["Address", "Payment", "Review"];

const PAYMENT_METHODS = [
  { id: "cod", icon: "💵", title: "Cash on Delivery", desc: "Pay in cash directly to the courier rider" },
  { id: "jazzcash", icon: "📱", title: "JazzCash", desc: "Instant mobile wallet payment via OTP" },
  { id: "easypaisa", icon: "📲", title: "Easypaisa", desc: "Quick transfer via registered mobile number" },
  { id: "card", icon: "💳", title: "Credit / Debit Card", desc: "Secure Visa & Mastercard processing" },
];

const GIFT_WRAP_FEE = 150;

export default function Checkout() {
  const {
    items, subtotal, discountAmount, giftWrapFee, deliveryCharge, grandTotal,
    isBundleActive, buildYourBox, giftWrap, setGiftWrap, clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ fullName: "", phone: "", city: "", street: "" });
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  const addressValid = address.fullName && address.phone && address.city && address.street;
  const guestValid = user || (guestInfo.name && guestInfo.email && guestInfo.phone);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError("");
    setApplyingPromo(true);
    try {
      const res = await api.get(`/discounts/validate/${promoCode.trim()}`);
      setAppliedPromo(res.data);
    } catch (err) {
      setAppliedPromo(null);
      setPromoError(err.response?.data?.message || "Invalid code");
    } finally {
      setApplyingPromo(false);
    }
  };

  const promoDiscount = appliedPromo && !isBundleActive
    ? appliedPromo.type === "percentage"
      ? Math.round(subtotal * (appliedPromo.value / 100))
      : Math.min(appliedPromo.value, subtotal)
    : 0;

  const finalDiscount = isBundleActive ? discountAmount : promoDiscount;
  const finalGrandTotal = subtotal - finalDiscount + deliveryCharge + giftWrapFee;

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handlePlaceOrder = async () => {
    setError("");
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod,
        buildYourBox: isBundleActive,
        discountCode: !isBundleActive && appliedPromo ? appliedPromo.code : undefined,
        giftWrap,
        ...(user ? {} : { guestInfo }),
      };
      const res = await api.post("/orders", payload);
      clearCart();
      navigate("/order-confirmation", { state: { order: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="bg-cream min-h-screen py-20 text-center px-4">
        <span className="text-6xl">🧾</span>
        <h1 className="font-display text-2xl font-extrabold text-plum mt-6">Nothing to checkout</h1>
        <p className="text-plum/60 mt-2">Your cart is empty — add some toys first.</p>
      </section>
    );
  }

  return (
    <section className="bg-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-plum text-center mb-8">Checkout</h1>

        <Stepper steps={STEPS} currentStep={step} />

        {error && <div className="bg-coral/10 text-coral text-sm rounded-xl px-4 py-2.5 mb-4">{error}</div>}

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div className="bg-white rounded-2xl border border-plum/5 p-6 sm:p-8">
            {step === 1 && (
              <div className="space-y-6">
                {!user && (
                  <div className="bg-sky/20 border border-sky rounded-xl p-4 flex items-center justify-between flex-wrap gap-2">
                    <p className="text-sm text-plum/70">
                      Checking out as a guest. Have an account?
                    </p>
                    <Link to="/login?redirect=/checkout" className="text-sm font-display font-bold text-coral hover:underline">
                      Log In
                    </Link>
                  </div>
                )}

                {!user && (
                  <div>
                    <h2 className="font-display font-extrabold text-lg text-plum mb-5">Your Details</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormInput label="Full Name" value={guestInfo.name} onChange={(v) => setGuestInfo({ ...guestInfo, name: v })} />
                      <FormInput label="Email" type="email" value={guestInfo.email} onChange={(v) => setGuestInfo({ ...guestInfo, email: v })} />
                      <FormInput label="Phone Number" value={guestInfo.phone} onChange={(v) => setGuestInfo({ ...guestInfo, phone: v })} />
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="font-display font-extrabold text-lg text-plum mb-5">Shipping Address</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormInput label="Full Name" value={address.fullName} onChange={(v) => setAddress({ ...address, fullName: v })} />
                    <FormInput label="Phone Number" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
                    <FormInput label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                    <FormInput label="Street Address" value={address.street} onChange={(v) => setAddress({ ...address, street: v })} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-plum mb-5">Payment Method</h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((m) => (
                      <PaymentOptionCard
                        key={m.id}
                        icon={m.icon}
                        title={m.title}
                        desc={m.desc}
                        selected={paymentMethod === m.id}
                        onSelect={() => setPaymentMethod(m.id)}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-plum/40 mt-4">
                    * Payment gateways are UI-only for now — no real transactions will be processed.
                  </p>
                </div>

                <GiftWrapOption giftWrap={giftWrap} setGiftWrap={setGiftWrap} fee={GIFT_WRAP_FEE} />

                {!isBundleActive && (
                  <div>
                    <p className="text-xs font-display font-bold text-plum/60 mb-2">Promo Code</p>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-mint/20 border border-mint rounded-xl px-4 py-2.5">
                        <span className="text-sm font-display font-bold text-plum">{appliedPromo.code} applied 🎉</span>
                        <button
                          onClick={() => { setAppliedPromo(null); setPromoCode(""); }}
                          className="text-xs text-plum/50 hover:text-coral underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className="input flex-1"
                        />
                        <Button type="button" variant="outline" onClick={handleApplyPromo} disabled={applyingPromo}>
                          {applyingPromo ? "Checking..." : "Apply"}
                        </Button>
                      </div>
                    )}
                    {promoError && <p className="text-xs text-coral mt-1.5">{promoError}</p>}
                  </div>
                )}
                {isBundleActive && (
                  <p className="text-xs text-plum/40">
                    Your Toy Box bundle discount is already active — promo codes can't be combined with it.
                  </p>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display font-extrabold text-lg text-plum mb-5">Review Your Order</h2>

                {!user && (
                  <div className="mb-5">
                    <p className="text-xs font-display font-bold text-plum/50 uppercase mb-2">Contact</p>
                    <p className="text-sm text-plum">{guestInfo.name} · {guestInfo.email}</p>
                    <p className="text-sm text-plum/70">{guestInfo.phone}</p>
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-xs font-display font-bold text-plum/50 uppercase mb-2">Shipping To</p>
                  <p className="text-sm text-plum">{address.fullName} · {address.phone}</p>
                  <p className="text-sm text-plum/70">{address.street}, {address.city}</p>
                </div>

                <div className="mb-5">
                  <p className="text-xs font-display font-bold text-plum/50 uppercase mb-2">Payment Method</p>
                  <p className="text-sm text-plum">
                    {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.icon}{" "}
                    {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.title}
                  </p>
                </div>

                {giftWrap.enabled && (
                  <div className="mb-5">
                    <p className="text-xs font-display font-bold text-plum/50 uppercase mb-2">Gift Wrapping</p>
                    <p className="text-sm text-plum capitalize">🎁 {giftWrap.ribbonColor} ribbon{giftWrap.message && ` — "${giftWrap.message}"`}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-display font-bold text-plum/50 uppercase mb-2">Items</p>
                  <div className="divide-y divide-plum/5">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-plum/70">{item.name} × {item.quantity}</span>
                        <span className="font-display font-bold text-plum">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-plum/5">
              {step > 1 ? <Button variant="outline" onClick={handleBack}>Back</Button> : <span />}
              {step < 3 && (
                <Button
                  onClick={handleNext}
                  disabled={(step === 1 && (!addressValid || !guestValid)) || (step === 2 && !paymentMethod)}
                  className="disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              )}
              {step === 3 && (
                <Button onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? "Placing Order..." : "Place Order"}
                </Button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-plum/5 p-6 h-fit sticky top-24">
            <h2 className="font-display font-extrabold text-lg text-plum mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-plum/70"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              {finalDiscount > 0 && (
                <div className="flex justify-between text-plum font-semibold">
                  <span>{isBundleActive ? "🎁 Toy Box Discount" : "Promo Discount"}</span>
                  <span>− Rs. {finalDiscount.toLocaleString()}</span>
                </div>
              )}
              {giftWrapFee > 0 && (
                <div className="flex justify-between text-plum/70"><span>Gift Wrapping</span><span>Rs. {giftWrapFee.toLocaleString()}</span></div>
              )}
              <div className="flex justify-between text-plum/70"><span>Delivery</span><span>Rs. {deliveryCharge.toLocaleString()}</span></div>
              <div className="border-t border-plum/10 pt-3 flex justify-between font-display font-extrabold text-plum text-base">
                <span>Grand Total</span>
                <span className="text-coral">Rs. {finalGrandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs font-display font-bold text-plum/60 mb-1.5 block">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input" />
    </label>
  );
}