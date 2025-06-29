"use client";

// Dữ liệu đầu vào:
// - branchData: Object chứa branchId, branchName, và mảng products chứa { productName, quantity }
// - topN: Số lượng sản phẩm hàng đầu cần hiển thị (ví dụ: 5, 7, 10)
// Ví dụ:
// {
//   branchId: 1,
//   branchName: "Chi nhánh A",
//   products: [{ productName: "Cà phê", quantity: 300 }, { productName: "Trà", quantity: 200 }]
// }
// topN: 5

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProductData {
  productName: string;
  quantity: number;
}

interface BranchData {
  branchId: number;
  branchName: string;
  products: ProductData[];
}

interface TopProductsBarChartProps {
  branchData: BranchData;
  topN: number;
}

const TopProductsBarChartChartjs: React.FC<TopProductsBarChartProps> = ({ branchData, topN }) => {
  const topProducts = branchData.products
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, topN);

  const chartData: ChartData<'bar'> = {
    labels: topProducts.map(p => p.productName),
    datasets: [{
      label: 'Số lượng',
      data: topProducts.map(p => p.quantity),
      backgroundColor: '#FBBF24',
      borderColor: '#FBBF24',
      borderWidth: 1,
    }],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: `Top ${topN} sản phẩm bán chạy tại ${branchData.branchName}` },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} sản phẩm`,
        },
      },
    },
    scales: {
      y: { 
        title: { display: true, text: 'Số lượng' },
        beginAtZero: true,
      },
      x: { 
        title: { display: true, text: 'Sản phẩm' },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default TopProductsBarChartChartjs;