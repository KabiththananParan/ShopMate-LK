'use client';

type CheckoutStage =
    | "none"
    | "confirm"
    | "city"
    | "recipient"
    | "phone"
    | "deliveryDate"
    | "address"
    | "sender"
    | "complete"
    | "gift"
    | "giftAge"
    | "giftBudget"
    | "giftDate";

type CheckoutProgressProps = {
    stage: CheckoutStage;
    visible: boolean;
};

const steps = [
    { id: "confirm", label: "Confirm", stages: ["confirm"] },
    { id: "city", label: "City", stages: ["city"] },
    { id: "recipient", label: "Recipient", stages: ["recipient"] },
    { id: "phone", label: "Phone", stages: ["phone"] },
    { id: "deliveryDate", label: "Date", stages: ["deliveryDate"] },
    { id: "address", label: "Address", stages: ["address", "sender"] },
    { id: "gift", label: "Gift", stages: ["gift", "giftAge", "giftBudget", "giftDate"] },
] as const;

const getActiveIndex = (stage: CheckoutStage) => {
    if (stage === "complete") {
        return steps.length;
    }

    const index = steps.findIndex((step) =>
        step.stages.includes(stage as never)
    );

    return index === -1 ? 0 : index;
};

export const CheckoutProgress = ({ stage, visible }: CheckoutProgressProps) => {
    if (!visible || stage === "none") {
        return null;
    }

    const activeIndex = getActiveIndex(stage);

    return (
        <div className="mb-3 overflow-x-auto rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 shadow-lg backdrop-blur-md">
            <div className="flex min-w-max items-center gap-2">
                {steps.map((step, index) => {
                    const isComplete = index < activeIndex;
                    const isActive = index === activeIndex;

                    return (
                        <div key={step.id} className="flex items-center gap-2">
                            <div
                                className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-all duration-300 ${
                                    isComplete
                                        ? "bg-emerald-500/10 text-emerald-300"
                                        : isActive
                                            ? "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30"
                                            : "bg-white/5 text-slate-500"
                                }`}
                                aria-current={isActive ? "step" : undefined}
                            >
                                <span
                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                                        isComplete
                                            ? "bg-emerald-400 text-slate-950"
                                            : isActive
                                                ? "bg-sky-400 text-slate-950"
                                                : "border border-slate-600 text-slate-500"
                                    }`}
                                >
                                    {isComplete ? "✓" : isActive ? "●" : "○"}
                                </span>
                                <span>{step.label}</span>
                            </div>

                            {index < steps.length - 1 && (
                                <span className="h-px w-4 bg-white/10" aria-hidden="true" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
