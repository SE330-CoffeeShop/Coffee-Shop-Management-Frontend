"use client";

// Dữ liệu đầu vào:
// - data: Array của các chi nhánh, mỗi chi nhánh có branchId, branchName, và mảng data chứa { month, revenue }
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

interface BranchRevenueLineChartProps {
  data: BranchRevenueData[];
}

const BranchRevenueLineChartChartjs: React.FC<BranchRevenueLineChartProps> = ({ data }) => {
  const chartData: ChartData<'line'> = {
    labels: data[0]?.data.map(item => item.month) || [],
    datasets: data.map((branch, index) => ({
      label: branch.branchName,
      data: branch.data.map(item => item.revenue),
      borderColor: ['#4B0082', '#FF6F61', '#FBBF24', '#34D399', '#3B82F6'][index % 5],
      backgroundColor: ['rgba(75, 0, 130, 0.2)', 'rgba(255, 111, 97, 0.2)', 'rgba(251, 191, 36, 0.2)', 'rgba(52, 211, 153, 0.2)', 'rgba(59, 130, 246, 0.2)'][index % 5],
      tension: 0.1,
    })),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Doanh thu từng chi nhánh theo tháng' },
    },
    scales: {
      y: { title: { display: true, text: 'Doanh thu (VND)' } },
      x: { title: { display: true, text: 'Tháng' } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default BranchRevenueLineChartChartjs;