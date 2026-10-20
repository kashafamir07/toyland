export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-colors ${
                  isDone
                    ? "bg-mint text-plum"
                    : isActive
                    ? "bg-coral text-white"
                    : "bg-white border-2 border-plum/10 text-plum/40"
                }`}
              >
                {isDone ? "✓" : stepNum}
              </div>
              <span
                className={`text-xs mt-2 font-display font-semibold hidden sm:block ${
                  isActive ? "text-plum" : "text-plum/40"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNum < steps.length && (
              <div className={`w-10 sm:w-20 h-0.5 mx-2 ${isDone ? "bg-mint" : "bg-plum/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}