import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { fetchMonthlySales } from "../../Api/dashboard";

const MonthlySalesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchMonthlySales();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch monthly sales:", err);
        setError("Failed to load monthly sales data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short" });
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-indigo-700">
        📊 Monthly Sales
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading chart...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 30, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={formatMonthLabel} />
            <YAxis />
            <Tooltip
              formatter={(value) => `EGP ${Number(value).toFixed(1)}`}
              labelFormatter={(label) => `Month: ${formatMonthLabel(label)}`}
            />
            <Legend />
            <Bar
              dataKey="totalSales"
              fill="#6366f1"
              name="Total Sales (EGP)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlySalesChart;
