import React from "react";

interface PaymentDetails {
  data: {
    authorization_url: string;
  };
}

interface ServiceResult {
  distance: number;
  durationInMinutes: number;
  normal_price: number;
  flatbed_price: number;
  nighttime_price?: number;
  amount?: number;
  paymentDetails?: PaymentDetails;
}

interface PaymentModalProps {
  result: ServiceResult;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  result,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-[#3B3835]">
          Service Details
        </h2>
        <div className="space-y-3">
          <p className="text-[#3B3835]">
            <span className="font-semibold">Distance:</span> {result.distance}{" "}
            km
          </p>
          <p className="text-[#3B3835]">
            <span className="font-semibold">Estimated Time:</span>{" "}
            {result.durationInMinutes} minutes
          </p>
          <p className="text-[#3B3835]">
            <span className="font-semibold">Normal Price:</span> ₦
            {result.normal_price?.toLocaleString()}
          </p>
          <p className="text-[#3B3835]">
            <span className="font-semibold">Flatbed Price:</span> ₦
            {result.flatbed_price?.toLocaleString()}
          </p>
          {result.paymentDetails?.data?.authorization_url && (
            <a
              href={result.paymentDetails.data.authorization_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-[#FF8500] text-white py-2 px-4 rounded-md hover:bg-[#FF8500]/90 transition-colors"
            >
              Proceed to Payment
            </a>
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
