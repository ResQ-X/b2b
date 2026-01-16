import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface TransactionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: any;
}

export function TransactionDetailsModal({
    isOpen,
    onClose,
    transaction,
}: TransactionDetailsModalProps) {
    if (!transaction) return null;

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
        } catch (e) {
            return dateString || "—";
        }
    };

    const formatCurrency = (amount: string | number) => {
        const val = Number(amount);
        return isNaN(val) ? "—" : `₦${val.toLocaleString()}`;
    };

    const details = [
        { label: "Date", value: formatDate(transaction.fulfilled_at || transaction.created_at) },
        { label: "Status", value: transaction.status, isStatus: true },
        { label: "Service Type", value: transaction.service_type },
        { label: "Amount", value: formatCurrency(transaction.amount) },
        { label: "Location", value: transaction.location_name },
        { label: "Payment Method", value: transaction.payment_method },
        { label: "Reference ID", value: transaction.id },
        { label: "Order ID", value: transaction.order_id },
        { label: "Asset ID", value: transaction.asset_id },
        { label: "Fuel Type", value: transaction.fuel_type },
        { label: "Litres", value: transaction.litres ? `${transaction.litres}L` : null },
        { label: "Odometer", value: transaction.odometer_reading },
        { label: "Notes", value: transaction.notes },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#2B2A28] border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Transaction Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {details.map((detail, index) => (
                        detail.value ? (
                            <div key={index} className="grid grid-cols-3 gap-4 border-b border-white/5 pb-2 last:border-0">
                                <span className="text-sm font-medium text-white/50">{detail.label}</span>
                                <span className={`col-span-2 text-sm font-medium ${detail.isStatus
                                        ? detail.value === "COMPLETED" || detail.value === "SUCCESS"
                                            ? "text-green-400"
                                            : "text-white"
                                        : "text-white"
                                    }`}>
                                    {detail.value}
                                </span>
                            </div>
                        ) : null
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
