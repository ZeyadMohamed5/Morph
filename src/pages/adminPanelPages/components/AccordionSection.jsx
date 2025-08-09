import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const AccordionSection = ({
  title,
  children,
  defaultOpen = false,
  onToggle = null,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors duration-200"
      >
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          )}
          {isOpen ? (
            <FaChevronDown className="h-5 w-5 text-gray-600" />
          ) : (
            <FaChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white">{children}</div>
      )}
    </div>
  );
};

export default AccordionSection;
