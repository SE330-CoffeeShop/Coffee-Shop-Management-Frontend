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

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ProductRevenueData {
  branchId: number;
  branchName: string;
  products: { productName: string; revenue: number }[];
}

interface ProductRevenueStackedBarChartProps {
  data: ProductRevenueData[];
}

const ProductRevenueStackedBarChartApex: React.FC<ProductRevenueStackedBarChartProps> = ({ data }) => {
  const allProducts = [...new Set(data.flatMap(branch => branch.products.map(p => p.productName)))];
  const allBranches = data.map(branch => branch.branchName);

  const series = allProducts.map(product => ({
    name: product,
    data: allBranches.map(branch => {
      const branchData = data.find(b => b.branchName === branch);
      const productData = branchData?.products.find(p => p.productName === product);
      return productData ? productData.revenue : 0;
    }),
  }));

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    xaxis: {
      categories: allBranches,
      title: { text: 'Chi nhánh' },
    },
    yaxis: {
      title: { text: 'Doanh thu (VND)' },
    },
    tooltip: {
      y: {
        formatter: val => `${val.toLocaleString()} VND`,
      },
    },
    legend: {
      position: 'right',
    },
    colors: ['#FF6F61', '#6B7280', '#FBBF24', '#34D399', '#3B82F6'],
  };

  return <ApexChart options={options} series={series} type="bar" height={350} />;
};

export default ProductRevenueStackedBarChartApex;