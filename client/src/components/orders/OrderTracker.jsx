import {
  CheckCircle2,
  Package,
  Truck,
  Home,
} from "lucide-react";

const steps = [
  {
    key: "pending",
    label: "Order Placed",
    icon: CheckCircle2,
  },
  {
    key: "processing",
    label: "Processing",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: Home,
  },
];

const statusOrder = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

export default function OrderTracker({ status = "pending" }) {
  const normalizedStatus = String(status).toLowerCase();

  // Handle cancelled orders separately
  if (normalizedStatus === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Package className="text-red-500" size={20} />
          </div>

          <div>
            <p className="font-display font-bold text-plum">
              Order Cancelled
            </p>

            <p className="text-sm text-plum/50">
              This order is no longer being processed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentStep =
    statusOrder[normalizedStatus] !== undefined
      ? statusOrder[normalizedStatus]
      : 0;

  return (
    <div className="w-full py-4">
      <div className="flex items-start justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-plum/10 z-0" />

        <div
          className="absolute top-5 left-0 h-1 bg-coral z-0 transition-all duration-500"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const completed = index <= currentStep;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-colors ${
                  completed
                    ? "bg-coral text-white"
                    : "bg-plum/10 text-plum/30"
                }`}
              >
                <Icon size={18} />
              </div>

              <span
                className={`text-xs sm:text-sm font-display font-bold text-center ${
                  completed ? "text-plum" : "text-plum/30"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}