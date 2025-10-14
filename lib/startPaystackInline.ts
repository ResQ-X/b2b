import { loadPaystack } from "./loadPaystack";

type StartInlineArgs = {
  amountNaira: number; // e.g. 5000 means ₦5,000
  email: string; // customer email (required by Paystack)
  reference?: string; // optional: your generated ref from backend
  publicKey?: string; // defaults to env
  metadata?: Record<string, any>;
  onSuccess: (ref: string) => void;
  onClose?: () => void;
};

export async function startPaystackInline({
  amountNaira,
  email,
  reference,
  publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
  metadata,
  onSuccess,
  onClose,
}: StartInlineArgs) {
  if (!publicKey) throw new Error("Missing NEXT_PUBLIC_PAYSTACK_KEY");
  if (!email) throw new Error("Paystack requires a customer email");
  if (!amountNaira || amountNaira <= 0) throw new Error("Invalid amount");

  await loadPaystack();

  const PaystackPop = (window as any).PaystackPop;
  const handler = PaystackPop.setup({
    key: publicKey,
    email,
    amount: Math.round(amountNaira * 100), // convert to KOBO
    ref: reference, // optional (Paystack can auto-generate)
    metadata,
    callback: (response: { reference: string }) => {
      onSuccess(response.reference);
    },
    onClose: () => {
      onClose?.();
    },
    // optional: channels: ["card","bank","ussd"]
    // optional: label: "ResQ-X"
  });

  handler.openIframe();
}
