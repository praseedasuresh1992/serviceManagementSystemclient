import ReactDOM from "react-dom";

const InstructionModal = ({
  isOpen,
  onClose,
  totalAmount,
  onAgree
}) => {
  if (!isOpen) return null;

  const advance = (totalAmount * 0.08).toFixed(2);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
      <div className="bg-white max-w-lg w-full p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Booking Instructions</h2>

        <div className="bg-gray-100 p-3 rounded mb-4">
          <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
          <p className="text-green-700 font-semibold">
            Advance Payment (8%): ₹{advance}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onAgree}>Agree & Continue</button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default InstructionModal;
