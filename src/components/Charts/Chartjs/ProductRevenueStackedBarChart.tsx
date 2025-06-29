"use client";

// Dữ liệu đầu vào:
// - data: Array của các chi nhánh, mỗi chi nhánh có branchId, branchName, và mảng products chứa { productName, revenue }
// Ví dụ:
// [
//   {
//     branchId: 1,
//     branchName: "Chi nhánh A",
//     products: [{ productName: "Cà phê", revenue: 5000 }, { productName: "Trà", revenue: 3000 }]
//   }
// ]

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProductRevenueData {
  branchId: number;
  branchName: string;
  products: { productName: string; revenue: number }[];
}

interface ProductRevenueStackedBarChartProps {
  data: ProductRevenueData[];
}

const ProductRevenueStackedBarChartChartjs: React.FC<ProductRevenueStackedBarChartProps> = ({ data }) => {
  const allProducts = [...new Set(data.flatMap(branch => branch.products.map(p => p.productName)))];
  const allBranches = data.map(branch => branch.branchName);

  const chartData: ChartData<'bar'> = {
    labels: allBranches,
    datasets: allProducts.map((product, index) => ({
      label: product,
      data: allBranches.map(branch => {
        const branchData = data.find(b => b.branchName === branch);
        const productData = branchData?.products.find(p => p.productName === product);
        return productData ? productData.revenue : 0;
      }),
      backgroundColor: ['#FF6F61', '#6B7280', '#FBBF24', '#34D399', '#3B82F6'][index % 5],
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true, text: 'Doanh thu sản phẩm theo chi nhánh' },
    },
    scales: {
      x: { stacked: true, title: { display: true, text: 'Chi nhánh' } },
      y: { stacked: true, title: { display: true, text: 'Doanh thu (VND)' } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ProductRevenueStackedBarChartChartjs;