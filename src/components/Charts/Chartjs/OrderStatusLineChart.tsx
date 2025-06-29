"use client";

// Dữ liệu đầu vào:
// - data: Array chứa { month, completed, canceled }
// Ví dụ:
// [
//   { month: "2025-01", completed: 100, canceled: 10 },
//   { month: "2025-02", completed: 120, canceled: 15 }
// ]

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface OrderStatusData {
  month: string;
  completed: number;
  canceled: number;
}

interface OrderStatusLineChartProps {
  data: OrderStatusData[];
}

const OrderStatusLineChartChartjs: React.FC<OrderStatusLineChartProps> = ({ data }) => {
  const chartData: ChartData<'line'> = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Đơn hoàn thành',
        data: data.map(item => item.completed),
        borderColor: '#34D399',
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Đơn hủy',
        data: data.map(item => item.canceled),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Số lượng đơn hàng theo trạng thái' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} đơn`,
        },
      },
    },
    scales: {
      y: { 
        title: { display: true, text: 'Số lượng đơn hàng' },
        beginAtZero: true,
      },
      x: { 
        title: { display: true, text: 'Tháng' },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default OrderStatusLineChartChartjs;