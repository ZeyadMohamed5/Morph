import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../../Api/dashboard";

const SummaryCards = ({ filters = {} }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const startDate = filters.startDate;
  const endDate = filters.endDate;

  useEffect(() => {
    if (!startDate || !endDate) return;

    const loadSummary = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchDashboardSummary(startDate, endDate);
        setSummary(data);
      } catch (err) {
        setError(err.message || "Something went wrong while loading summary");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [startDate, endDate]);

  if (loading) return <div>Loading summary...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card title="Total Sales" value={`EGP ${summary.totalSales}`} />
      <Card title="Orders" value={summary.orderCount} />
      <Card
        title="Average Order Value"
        value={`EGP ${summary.averageOrderValue}`}
      />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
    <h4 className="text-gray-500 text-sm mb-1">{title}</h4>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default SummaryCards;
