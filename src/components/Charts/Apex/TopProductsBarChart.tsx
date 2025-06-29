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

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { TopProductsBarChartProps } from '@/data/Chart.data';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });



const TopProductsBarChartApex: React.FC<TopProductsBarChartProps> = ({ branchData, topN }) => {
  const topProducts = branchData.products
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, topN);

  const series = [{
    name: 'Số lượng',
    data: topProducts.map(p => p.quantity),
  }];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: topProducts.map(p => p.productName),
      title: { text: 'Sản phẩm' },
    },
    yaxis: {
      title: { text: 'Số lượng' },
    },
    colors: ['#FBBF24'],
  };

  return (
    <div>
      <h2>Top {topN} sản phẩm bán chạy tại {branchData.branchName}</h2>
      <ApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default TopProductsBarChartApex;