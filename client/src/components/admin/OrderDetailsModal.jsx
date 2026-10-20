import { X } from "lucide-react";

export default function OrderDetailsModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-plum/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-extrabold text-lg text-plum">Order Details</h2>
          <button onClick={onClose} className="text-plum/50 hover:text-coral">
            <X size={20} />
          </button>
        </div>

        <div className="mb-5">
          <p className="text-xs font-display font-bold text-plum/50 uppercase mb-1">Customer</p>
          <p className="text-sm text-plum">{order.user?.name}</p>
          <p className="text-sm text-plum/60">{order.user?.email}</p>
        </div>

        <div className="mb-5">
          <p className="text-xs font-display font-bold text-plum/50 uppercase mb-1">Shipping Address</p>
          <p className="text-sm text-plum">{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
          <p className="text-sm text-plum/60">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
        </div>

        <div className="mb-5">
          <p className="text-xs font-display font-bold text-plum/50 uppercase mb-1">Payment Method</p>
          <p className="text-sm text-plum capitalize">{order.paymentMethod}</p>
        </div>

        <div className="mb-5">
          <p className="text-xs font-display font-bold text-plum/50 uppercase mb-2">Items</p>
          <div className="divide-y divide-plum/5">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="text-plum/70">{item.name} × {item.quantity}</span>
                <span className="font-display font-bold text-plum">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-plum/10 pt-3 flex justify-between font-display font-extrabold text-plum">
          <span>Grand Total</span>
          <span className="text-coral">Rs. {order.grandTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}