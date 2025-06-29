"use client";

// Dữ liệu đầu vào:
// - data: Array chứa { month, completed, canceled }
// Ví dụ:
// [
//   { month: "2025-01", completed: 100, canceled: 10 },
//   { month: "2025-02", completed: 120, canceled: 15 }
// ]

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface OrderStatusData {
  month: string;
  completed: number;
  canceled: number;
}

interface OrderStatusLineChartProps {
  data: OrderStatusData[];
}

const OrderStatusLineChartApex: React.FC<OrderStatusLineChartProps> = ({ data }) => {
  const series = [
    {
      name: 'Đơn hoàn thành',
      data: data.map(item => item.completed),
    },
    {
      name: 'Đơn hủy',
      data: data.map(item => item.canceled),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'line',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 4,
    },
    xaxis: {
      categories: data.map(item => item.month),
      title: { text: 'Tháng' },
    },
    yaxis: {
      title: { text: 'Số lượng đơn hàng' },
    },
    colors: ['#34D399', '#EF4444'],
  };

  return <ApexChart options={options} series={series} type="line" height={350} />;
};

export default OrderStatusLineChartApex;