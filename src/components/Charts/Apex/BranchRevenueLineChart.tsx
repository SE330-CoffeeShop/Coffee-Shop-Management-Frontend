"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { BranchRevenueData } from "@/data/Chart.data";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BranchRevenueLineChartProps {
  data: BranchRevenueData[];
}

const BranchRevenueLineChartApex: React.FC<BranchRevenueLineChartProps> = ({
  data,
}) => {
  const allMonths = [
    ...new Set(
      data.flatMap((branch) => branch.revenueByMonth.map((item) => item.month))
    ),
  ].sort();

  const series = data.map((branch) => ({
    name: branch.branchName,
    data: allMonths.map(
      (month) =>
        branch.revenueByMonth.find((item) => item.month === month)?.revenue || 0
    ),
  }));

  const options: ApexOptions = {
    chart: {
      type: "line",
      stacked: false,
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: "zoom",
      },
      fontFamily: "Inter, sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 5,
      curve: "smooth",
      lineCap: "round",
    },
    xaxis: {
      categories: allMonths.length > 0 ? allMonths : ["No Data"],
      title: {
        text: "Tháng",
        style: {
          fontSize: "14px",
          fontWeight: 600,
          color: "#374151",
          fontFamily: "Inter, sans-serif",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
          fontFamily: "Inter, sans-serif",
        },
        rotate: -45,
        rotateAlways: false,
      },
      tickPlacement: "on",
    },
    yaxis: {
      // title: {
      //   text: "Doanh thu (VND)",
      //   style: {
      //     fontSize: "14px",
      //     fontWeight: 600,
      //     color: "#374151",
      //     fontFamily: "Inter, sans-serif",
      //   },
      // },
      labels: {
        formatter: (val: number) => `${(val / 1000).toFixed(0)}K`,
        style: {
          fontSize: "12px",
          colors: "#6B7280",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      y: {
        formatter: (val: number) => `${val.toLocaleString()} VND`,
      },
      marker: {
        show: true,
      },
      intersect: false,
      shared: true,
    },
    colors: ["#4B0082", "#FF6F61", "#FBBF24", "#34D399", "#3B82F6"],
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      markers: {
        size: 5,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
    markers: {
      size: 5,
      hover: {
        size: 8,
      },
    },
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
      <ApexChart
        options={options}
        series={series}
        type="line"
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default BranchRevenueLineChartApex;
