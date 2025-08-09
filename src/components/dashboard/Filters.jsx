import { useEffect, useState } from "react";

const Filters = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Format date to YYYY-MM-DD safely in local time
  const formatDate = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  };

  const updateFilters = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    onFilterChange({ startDate: start, endDate: end });
  };

  const setToday = () => {
    const today = formatDate(new Date());
    updateFilters(today, today);
  };

  const setLast7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    updateFilters(formatDate(start), formatDate(end));
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = now;
    updateFilters(formatDate(start), formatDate(end));
  };

  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    updateFilters(formatDate(start), formatDate(end));
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    onFilterChange({ startDate: "", endDate: "" });
  };

  // Apply "Today" by default on first mount
  useEffect(() => {
    setToday();
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => updateFilters(e.target.value, endDate)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => updateFilters(startDate, e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={setToday}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 text-sm"
        >
          Today
        </button>
        <button
          onClick={setLast7Days}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          Last 7 Days
        </button>
        <button
          onClick={setThisMonth}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
        >
          This Month
        </button>
        <button
          onClick={setLastMonth}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm"
        >
          Last Month
        </button>
        <button
          onClick={resetFilters}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Filters;
