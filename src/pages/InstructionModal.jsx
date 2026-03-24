import { createPortal } from "react-dom";

const InstructionModal = ({
  isOpen,
  onClose,
  totalAmount,
  onAgree
}) => {
  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const advance = (totalAmount * 0.08).toFixed(2);

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      {/* Modal Box */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 animate-fadeIn">
        
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Booking Instructions
        </h2>

        {/* Amount Section */}
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <p className="text-gray-700">
            <span className="font-medium">Total Amount:</span> ₹{totalAmount}
          </p>

          <p className="text-green-600 font-semibold mt-1">
            Advance Payment (8%): ₹{advance}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onAgree}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Agree & Continue
          </button>

        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default InstructionModal;