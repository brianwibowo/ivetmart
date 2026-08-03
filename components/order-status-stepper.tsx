/**
 * Order Status Stepper Component — Ivet Mart
 *
 * Visual progress stepper for order fulfillment status.
 * Used in Buyer Order History and Seller Order Management.
 */

import { CheckCircle2, Clock, PackageCheck, Truck } from "lucide-react";

export type OrderStatusType =
	| "pending"
	| "processing"
	| "paid"
	| "shipped"
	| "completed"
	| "delivered"
	| "cancelled";

const STEPS = [
	{ id: "pending", label: "Pesanan Dibuat", icon: Clock },
	{ id: "processing", label: "Dikonfirmasi", icon: PackageCheck },
	{ id: "shipped", label: "Dalam Pengiriman", icon: Truck },
	{ id: "completed", label: "Pesanan Selesai", icon: CheckCircle2 },
];

function getStepIndex(status: string): number {
	const norm = status.toLowerCase();
	if (norm === "cancelled") return -1;
	if (norm === "pending") return 0;
	if (norm === "processing" || norm === "paid") return 1;
	if (norm === "shipped") return 2;
	if (norm === "completed" || norm === "delivered") return 3;
	return 0;
}

export function OrderStatusStepper({ status }: { status: string }) {
	const currentIdx = getStepIndex(status);
	const isCancelled = status.toLowerCase() === "cancelled";

	if (isCancelled) {
		return (
			<div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive">
				<Clock className="h-4 w-4 shrink-0" />
				<span>Pesanan ini telah dibatalkan.</span>
			</div>
		);
	}

	return (
		<div className="w-full py-2">
			<div className="flex items-center justify-between relative">
				{/* Background Connecting Line */}
				<div className="absolute top-4 left-6 right-6 h-0.5 bg-border/60 -z-0" />

				{/* Step Items */}
				{STEPS.map((step, idx) => {
					const Icon = step.icon;
					const isDone = idx <= currentIdx;
					const isCurrent = idx === currentIdx;

					return (
						<div
							key={step.id}
							className="relative z-10 flex flex-col items-center gap-1.5 text-center flex-1"
						>
							<div
								className={`flex h-8 w-8 items-center justify-center rounded-full transition-all border ${
									isCurrent
										? "bg-[#80070A] text-white border-[#80070A] shadow-md ring-4 ring-[#80070A]/15 scale-110"
										: isDone
											? "bg-emerald-600 text-white border-emerald-600"
											: "bg-background text-muted-foreground border-border/80"
								}`}
							>
								<Icon className="h-4 w-4" />
							</div>
							<span
								className={`text-[11px] font-medium leading-tight max-w-[80px] ${
									isCurrent
										? "font-bold text-[#80070A]"
										: isDone
											? "text-foreground"
											: "text-muted-foreground"
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
