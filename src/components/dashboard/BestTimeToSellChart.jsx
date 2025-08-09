import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import { fetchBestTimeToSell } from "../../Api/dashboard";

const BestTimeToSellChart = ({ filters = {} }) => {
  const [dataByHour, setDataByHour] = useState([]);
  const [dataByDay, setDataByDay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { startDate, endDate } = filters;

  const { defaultStart, defaultEnd } = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");

    return {
      defaultStart:
        dayjs(startDate, "YYYY-MM-DD", true).isValid() && startDate
          ? dayjs(startDate).format("YYYY-MM-DD")
          : today,
      defaultEnd:
        dayjs(endDate, "YYYY-MM-DD", true).isValid() && endDate
          ? dayjs(endDate).format("YYYY-MM-DD")
          : today,
    };
  }, [startDate, endDate]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBestTimeToSell(defaultStart, defaultEnd);
        setDataByHour(data.byHour || []);
        setDataByDay(data.byDayOfWeek || []);
      } catch (err) {
        console.error("Failed to fetch best time to sell:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [defaultStart, defaultEnd]);

  const formatHourRange = (startHour) => {
    const to12Hour = (hour) => {
      const h = parseInt(hour);
      const suffix = h >= 12 ? "PM" : "AM";
      const formatted = h % 12 === 0 ? 12 : h % 12;
      return `${formatted} ${suffix}`;
    };

    const start = to12Hour(startHour);
    const end = to12Hour((parseInt(startHour) + 3) % 24);

    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-8 p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800">Best Time to Sell</h2>

      {loading ? (
        <p className="text-gray-500">Loading charts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Chart: Sales by 3-Hour Interval */}
          <div>
            <h3 className="text-md font-medium mb-2 text-indigo-700">
              Sales by Hour
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickFormatter={formatHourRange}
                  interval="preserveStartEnd"
                  minTickGap={5}
                  label={{
                    value: "Time Interval",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis domain={[0, "auto"]} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [
                    `EGP ${Number(value).toFixed(2)}`,
                    "Sales",
                  ]}
                  labelFormatter={(label) =>
                    `Interval: ${formatHourRange(label)}`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={true} // enable visible points
                  name="Sales by Hour"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart: Sales by Day of Week */}
          <div>
            <h3 className="text-md font-medium mb-2 text-green-700">
              Sales by Day
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `EGP ${Number(value).toFixed(2)}`,
                    "Sales",
                  ]}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Sales by Day"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default BestTimeToSellChart;
