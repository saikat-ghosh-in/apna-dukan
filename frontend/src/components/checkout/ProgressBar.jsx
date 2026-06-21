import { MdLocationOn, MdPayment, MdShoppingCart, MdCheckCircle } from "react-icons/md";

const steps = [
  { label: "Address", icon: MdLocationOn },
  { label: "Review", icon: MdShoppingCart },
  { label: "Payment", icon: MdPayment },
];

const ProgressBar = ({ step, setStep }) => (
  <div className="w-full mb-6">
    <div className="flex items-center gap-2 mb-4">
      {steps.map(({ label, icon: Icon }, index) => {
        const stepNum = index + 1;
        const active = stepNum === step;
        const done = stepNum < step;
        return (
          <button
            key={label}
            onClick={() => done && setStep(stepNum)}
            disabled={stepNum > step}
            className={`flex-1 flex items-center gap-2 p-3 rounded-xl text-left transition-all duration-200
                            ${active
                ? "bg-blue-500 text-white shadow-sm"
                : done
                  ? "bg-blue-50 text-blue-600 cursor-pointer hover:bg-blue-100"
                  : "bg-white border border-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            <div className="shrink-0">
              {done ? <MdCheckCircle size={16} /> : <Icon size={16} />}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-widest opacity-60">
                Step {stepNum}
              </div>
              <div className="text-xs font-bold truncate">{label}</div>
            </div>
          </button>
        );
      })}
    </div>
    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-1 bg-blue-500 rounded-full transition-all duration-500"
        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
      />
    </div>
  </div>
);

export default ProgressBar;