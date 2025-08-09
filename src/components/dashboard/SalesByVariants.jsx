import { useEffect, useState } from "react";
import { fetchSalesByVariant } from "../../Api/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const getColor = (index) => {
  const palette = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#a4de6c",
    "#d0ed57",
    "#8dd1e1",
    "#ffbb28",
    "#ff8042",
    "#b084cc",
    "#7ec8e3",
    "#f67280",
    "#c06c84",
    "#6c5b7b",
    "#355c7d",
  ];
  return palette[index % palette.length];
};

const renderCustomTick = ({ x, y, payload }) => (
  <text x={x} y={y + 10} textAnchor="middle" fontSize={12}>
    {payload.value.length > 12
      ? `${payload.value.slice(0, 12)}...`
      : payload.value}
  </text>
);

const SalesByVariants = ({ filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSalesData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchSalesByVariant(
          filters.startDate,
          filters.endDate
        );
        console.log("Sales by variant data:", response);
        setData(response || []);
      } catch (error) {
        console.error("Failed to fetch sales by variant:", error);
        setError("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    loadSalesData();
  }, [filters]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Sales by Variant
        </h2>
        <div className="text-red-500 text-center py-10">{error}</div>
      </div>
    );
  }

  // Transform API response into chart data
  const groupedData = data.reduce((acc, item) => {
    const label = `${item.color} / ${item.size}`;
    const existing = acc.find((entry) => entry.product === item.productTitle);

    if (existing) {
      existing[label] = item.totalSold;
    } else {
      acc.push({
        product: item.productTitle,
        [label]: item.totalSold,
      });
    }

    return acc;
  }, []);

  const variantKeys = [
    ...new Set(data.map((item) => `${item.color} / ${item.size}`)),
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Sales by Variant
      </h2>
      {groupedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={groupedData}
            margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="product"
              interval={0}
              tick={renderCustomTick}
              height={60}
            />
            <YAxis
              tickFormatter={(value) => (Number.isInteger(value) ? value : "")}
              domain={[0, "dataMax + 1"]}
              allowDecimals={false}
              tickLine={false}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            {variantKeys.map((variant, i) => (
              <Bar
                key={variant}
                dataKey={variant}
                fill={getColor(i)}
                maxBarSize={50}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-10">
          No sales data available for the selected period.
        </p>
      )}
    </div>
  );
};

export default SalesByVariants;
