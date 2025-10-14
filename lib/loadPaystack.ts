let loading: Promise<void> | null = null;

export function loadPaystack(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve(); // SSR guard
  if ((window as any).PaystackPop) return Promise.resolve(); // already loaded
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.head.appendChild(s);
  });

  return loading;
}
