import React from "react";

const InstructionModal = ({
  isOpen,
  onClose,
  totalAmount,
  onAgree
}) => {
  if (!isOpen) return null;
console.log("instruction modal")
  const advance = (totalAmount * 0.08).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-lg w-full p-6 rounded shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Booking Instructions
        </h2>

        <div className="bg-gray-100 p-3 rounded mb-4">
          <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
          <p className="text-green-700 font-semibold">
            Advance Payment (8%): ₹{advance}
          </p>
        </div>

        <ul className="list-disc pl-5 text-sm space-y-2">
          <li>Advance payment of <strong>8%</strong> is mandatory.</li>
          <li><strong>Full Day:</strong> ₹1000</li>
          <li><strong>Half Day:</strong> ₹650</li>
          <li>Some categories may have different pricing.</li>
          <li>Booking confirmation depends on provider availability.</li>
          <li>Cancellation allowed only when booking is pending.</li>
          <li>Advance amount is non-refundable unless provider cancels.</li>
        </ul>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={onAgree}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Agree & Continue
          </button>
        </div>

      </div>
    </div>
  );
};

export default InstructionModal;
