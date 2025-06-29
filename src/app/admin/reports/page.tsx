"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import useSWR from "swr";
import { TotalRevenueLineChartApex } from "@/components";
import {
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BranchRevenueData } from "@/data/Chart.data";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Reports: React.FC = () => {
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState<string>(currentYear);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [branchRevenueData, setBranchRevenueData] = useState<
    BranchRevenueData[] | null
  >(null);

  const {
    data: apiData,
    error,
    isLoading,
  } = useSWR(
    `/branch/all-with-revenue/year?year=${year}&page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    if (apiData && apiData.data) {
      const formattedData: BranchRevenueData[] = apiData.data.map(
        (branch: any, index: number) => ({
          branchId: branch.id ?? `fallback-${index}`, // Fallback ID if branch.id is undefined
          branchName: branch.branchName ?? "Unknown Branch",
          revenueByMonth: branch.revenueByMonth.map(
            (monthData: any, i: number) => ({
              month: `${String(i + 1).padStart(2, "0")}`,
              revenue: Number(Object.values(monthData)[0]) || 0,
            })
          ),
        })
      );
      setBranchRevenueData(formattedData);
    }
  }, [apiData, year]);

  useEffect(() => {
    if (error) {
      toast.error(`Lỗi khi tải dữ liệu: ${error.message}`);
    }
  }, [error]);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setYear(value);
    }
  };

  // Calculate allMonths and series for both chart and table
  const allMonths = useMemo(() => {
    if (!branchRevenueData) return [];
    return [
      ...new Set(
        branchRevenueData.flatMap((branch) =>
          branch.revenueByMonth.map((item) => item.month)
        )
      ),
    ].sort();
  }, [branchRevenueData]);

  const series = useMemo(() => {
    if (!branchRevenueData) return [];
    return branchRevenueData.map((branch) => ({
      name: branch.branchName,
      data: allMonths.map(
        (month) =>
          branch.revenueByMonth.find((item) => item.month === month)?.revenue ||
          0
      ),
    }));
  }, [branchRevenueData, allMonths]);

  // Define columns for the table
  const columns = useMemo(
    () => [
      { key: "branchName", label: "Chi nhánh" },
      ...allMonths.map((month) => ({ key: month, label: `Tháng ${month}` })),
    ],
    [allMonths]
  );

  console.log("Branch Revenue Data:", branchRevenueData);
  console.log("allMonths:", allMonths);
  console.log("columns:", columns);

  // Render cell content based on column key
  const renderCell = useCallback(
    (branch: BranchRevenueData, columnKey: string) => {
      if (columnKey === "branchName") {
        return (
          <TableCell className="py-3 text-sm text-gray-900">
            {branch.branchName}
          </TableCell>
        );
      }
      return (
        <TableCell className="py-3 text-sm text-gray-600">
          {(
            branch.revenueByMonth.find((item) => item.month === columnKey)
              ?.revenue || 0
          ).toLocaleString()}{" "}
          VND
        </TableCell>
      );
    },
    []
  );

  return (
    <main className="flex w-full min-h-screen gap-4 bg-gray-50 p-6">
      <div className="flex h-full w-full gap-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Báo cáo Doanh thu
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  className="bg-white w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
                  variant="bordered"
                  size="md"
                  placeholder="Nhập năm"
                  startContent={
                    <MagnifyingGlassIcon className="size-5 text-gray-400" />
                  }
                  value={year}
                  onChange={handleYearChange}
                />
              </div>
            </div>
            {isLoading && (
              <div className="flex justify-center items-center h-[500px]">
                <Spinner className="mx-auto my-4" />
              </div>
            )}
            {branchRevenueData && !isLoading && !error && (
              <>
                <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700 bg-gray-100 p-4">
                    Doanh thu từng chi nhánh
                  </h3>
                  <div className="w-full h-full">
                    <TotalRevenueLineChartApex data={branchRevenueData} />
                  </div>
                </div>
                <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 bg-gray-100 p-4">
                    Bảng doanh thu theo chi nhánh
                  </h3>
                  <Table
                    aria-label="Bảng doanh thu theo chi nhánh"
                    className="h-full w-full"
                    shadow="none"
                  >
                    <TableHeader>
                      {columns.map((column) => (
                        <TableColumn
                          key={column.key}
                          className="text-sm font-semibold text-gray-700 bg-gray-100"
                        >
                          {column.label}
                        </TableColumn>
                      ))}
                    </TableHeader>
                    <TableBody
                      items={branchRevenueData}
                      emptyContent={
                        <div className="text-gray-500 text-center py-4">
                          Không có dữ liệu doanh thu.
                        </div>
                      }
                    >
                      {branchRevenueData.map((branch, index) => (
                        <TableRow
                          key={branch.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {(columnKey) =>
                            renderCell(branch, columnKey as string)
                          }
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reports;
