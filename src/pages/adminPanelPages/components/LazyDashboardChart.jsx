import { useState } from "react";
import AccordionSection from "./AccordionSection";

const LazyDashboardChart = ({
  title,
  ChartComponent,
  defaultOpen = false,
  ...chartProps
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasLoaded, setHasLoaded] = useState(defaultOpen);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (newOpenState) => {
    setIsOpen(newOpenState);

    // Only load data when opening for the first time
    if (newOpenState && !hasLoaded) {
      setHasLoaded(true);
      setIsLoading(true);

      // Optional: Add a small delay to show loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <AccordionSection
      title={title}
      defaultOpen={defaultOpen}
      onToggle={handleToggle}
      isLoading={isLoading}
    >
      {hasLoaded ? (
        <ChartComponent {...chartProps} />
      ) : (
        <div className="p-6 text-center text-gray-500">
          Chart will load when expanded...
        </div>
      )}
    </AccordionSection>
  );
};

export default LazyDashboardChart;
