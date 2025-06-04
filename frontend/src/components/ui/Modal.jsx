import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 text-white rounded-lg shadow-2xl p-4 sm:p-6 lg:p-8 
                   w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
                   max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}