"use client";

// Dữ liệu đầu vào:
// - data: Array của các chi nhánh, mỗi chi nhánh có branchId, branchName, và mảng data chứa { month, revenue }
// - Component sẽ tự động tính tổng doanh thu theo tháng
// Ví dụ:
// [
//   {
//     branchId: 1,
//     branchName: "Chi nhánh A",
//     data: [{ month: "2025-01", revenue: 10000 }, { month: "2025-02", revenue: 12000 }]
//   }
// ]

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface BranchRevenueData {
  branchId: number;
  branchName: string;
  data: { month: string; revenue: number }[];
}

interface TotalRevenueLineChartProps {
  data: BranchRevenueData[];
}

const TotalRevenueLineChartChartjs: React.FC<TotalRevenueLineChartProps> = ({ data }) => {
  const allMonths = [...new Set(data.flatMap(branch => branch.data.map(item => item.month)))].sort();
  const totalRevenue = allMonths.map(month => ({
    month,
    revenue: data.reduce((total, branch) => total + (branch.data.find(item => item.month === month)?.revenue || 0), 0),
  }));

  const chartData: ChartData<'line'> = {
    labels: totalRevenue.map(item => item.month),
    datasets: [{
      label: 'Tổng doanh thu',
      data: totalRevenue.map(item => item.revenue),
      borderColor: '#4B0082',
      backgroundColor: 'rgba(75, 0, 130, 0.2)',
      tension: 0.1,
    }],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Tổng doanh thu tất cả chi nhánh' },
    },
    scales: {
      y: { title: { display: true, text: 'Doanh thu (VND)' } },
      x: { title: { display: true, text: 'Tháng' } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TotalRevenueLineChartChartjs;