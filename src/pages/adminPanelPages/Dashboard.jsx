import { useState } from "react";
import SummaryCards from "../../components/dashboard/SummaryCards";
import Filters from "../../components/dashboard/Filters";
import SalesByProduct from "../../components/dashboard/SalesByProducts";
import SalesByCategory from "../../components/dashboard/SalesByCategory";
import TopSellingProducts from "../../components/dashboard/TopSellingProducts";
import LowStockProducts from "../../components/dashboard/LowStockProducts";
import CouponUsage from "../../components/dashboard/CouponUsage";
import BestTimeToSellChart from "../../components/dashboard/BestTimeToSellChart";
import MonthlySalesChart from "../../components/dashboard/MonthlySales";
import SalesByVariants from "../../components/dashboard/SalesByVariants";
import dayjs from "dayjs";
import LazyDashboardChart from "./components/LazyDashboardChart";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    startDate: dayjs().startOf("day").toISOString(),
    endDate: dayjs().endOf("day").toISOString(),
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Always visible - critical info */}
      <LowStockProducts threshold={5} />
      <Filters onFilterChange={setFilters} />

      {/* Summary cards - keep visible as they're usually lightweight */}
      <SummaryCards filters={filters} />

      {/* Lazy-loaded chart sections */}
      <LazyDashboardChart
        title="Sales Performance Over Time"
        ChartComponent={BestTimeToSellChart}
        filters={filters}
        defaultOpen={true} // Keep this one open by default
      />

      <LazyDashboardChart
        title="Sales by Product Variants"
        ChartComponent={SalesByVariants}
        filters={filters}
      />

      <LazyDashboardChart
        title="Monthly Sales Overview"
        ChartComponent={MonthlySalesChart}
        defaultOpen={true} // Keep this one open by default
      />

      <LazyDashboardChart
        title="Sales by Product"
        ChartComponent={SalesByProduct}
        filters={filters}
      />

      <LazyDashboardChart
        title="Sales by Category"
        ChartComponent={SalesByCategory}
        filters={filters}
      />

      <LazyDashboardChart
        title="Top Selling Products"
        ChartComponent={TopSellingProducts}
        filters={filters}
        limit={5}
      />

      <LazyDashboardChart
        title="Coupon Usage Analytics"
        ChartComponent={CouponUsage}
        filters={filters}
      />
    </div>
  );
};

export default Dashboard;
