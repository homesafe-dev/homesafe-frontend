import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface ApproveUserModalProps {
  onClose: () => void;
  onApprove: () => void;
}

export default function ApproveUserModal({
  onClose,
  onApprove,
}: ApproveUserModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative z-10">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mt-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
            <div className="relative">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  stroke="#333333"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute bottom-0 right-0">
                <FaCheckCircle className="text-green-500 text-lg" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-6 text-center">
            Approve User
          </h2>

          <p className="text-gray-600 text-center mt-4">
            Approving this user will give them access to your platform.
          </p>

          <button
            onClick={onApprove}
            className="w-full mt-8 bg-[#C8EDDF80] hover:bg-[#C8EDDF] text-[#174B35] font-medium py-3 px-4 rounded-md transition-colors"
          >
            Approve User
          </button>
        </div>
      </div>
    </div>
  );
}
