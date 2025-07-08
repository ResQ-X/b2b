import React, { useState } from "react";
import { Copy } from "lucide-react";

interface PaymentDetails {
  data: {
    authorization_url: string;
  };
}

interface DirectPaymentResult {
  amount: number;
  paymentDetails: PaymentDetails;
}

interface DirectPaymentModalProps {
  result: DirectPaymentResult;
  onClose: () => void;
}

export const DirectPaymentModal: React.FC<DirectPaymentModalProps> = ({
  result,
  onClose,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Could not copy text: ", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#3B3835]">
          Payment Details
        </h2>
        <div className="space-y-3">
          <p className="text-[#3B3835]">
            <span className="font-semibold">Amount:</span> ₦
            {result.amount?.toLocaleString()}
          </p>

          {result.paymentDetails?.data?.authorization_url && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 truncate flex-1">
                  {result.paymentDetails.data.authorization_url}
                </p>
                <button
                  onClick={() =>
                    copyToClipboard(
                      result.paymentDetails.data.authorization_url
                    )
                  }
                  className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Copy size={16} />
                  {copySuccess && (
                    <span className="ml-2 text-xs text-green-600">Copied!</span>
                  )}
                </button>
              </div>
              <a
                href={result.paymentDetails.data.authorization_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FF8500] text-white py-2 px-4 rounded-md hover:bg-[#FF8500]/90 transition-colors"
              >
                Proceed to Payment
              </a>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 text-sm text-gray-600 hover:text-gray-900"
        >
          Close
        </button>
      </div>
    </div>
  );
};
