"use client";

import { useState, useEffect, useMemo, useCallback, useContext } from "react";
import useSWR from "swr";
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
import { BranchRevenueLineChartApex } from "@/components";
import { AppContext } from "@/contexts";
import { AuthType } from "@/types/auth.type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Reports = () => {
  const { auth } = useContext(AppContext) as AuthType;
  const { branchId } = auth;

  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState<string>(currentYear);
  const [branchRevenueData, setBranchRevenueData] =
    useState<BranchRevenueData | null>(null);

  const {
    data: apiData,
    error,
    isLoading,
  } = useSWR(
    branchId ? `/branch/revenue/year?branchId=${branchId}&year=${year}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    if (apiData && apiData.data) {
      const branch = apiData.data;
      const formattedData: BranchRevenueData = {
        id: branch.id ?? "unknown",
        branchName: branch.branchName ?? "Unknown Branch",
        branchRevenue: branch.branchRevenue ?? 0,
        revenueByMonth: branch.revenueByMonth.map(
          (monthData: any, index: number) => ({
            month: `${String(index + 1).padStart(2, "0")}`,
            revenue: Number(Object.values(monthData)[0]) || 0,
          })
        ),
      };
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

  // Calculate allMonths for chart and table
  const allMonths = useMemo(() => {
    if (!branchRevenueData) return [];
    return branchRevenueData.revenueByMonth.map((item) => item.month).sort();
  }, [branchRevenueData]);

  // Define columns for the table
  const columns = useMemo(
    () => [
      { key: "branchName", label: "Chi nhánh" },
      ...allMonths.map((month) => ({ key: month, label: `Tháng ${month}` })),
      { key: "totalRevenue", label: "Tổng doanh thu" },
    ],
    [allMonths]
  );

  // Render cell content based on column key
  const renderCell = useCallback(
    (branch: BranchRevenueData, columnKey: string) => {
      if (columnKey === "branchName") {
        return (
          <TableCell className="py-3 text-sm font-medium text-gray-900">
            {branch.branchName}
          </TableCell>
        );
      }
      if (columnKey === "totalRevenue") {
        return (
          <TableCell className="py-3 text-sm font-medium text-gray-900">
            {branch.branchRevenue.toLocaleString()} VND
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
    <main className="flex min-h-screen w-full flex-col gap-6 bg-gray-50 p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-lg">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Báo cáo Doanh thu -{" "}
                {branchRevenueData?.branchName || "Chi nhánh"}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Doanh thu chi nhánh trong năm {year}
              </p>
            </div>
            <div className="w-full sm:w-72">
              <Input
                className="w-full rounded-lg border-gray-200 shadow-sm"
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
            <div className="flex h-[500px] items-center justify-center">
              <Spinner className="mx-auto my-4" />
            </div>
          )}
          {!branchId && (
            <div className="flex h-[500px] items-center justify-center">
              <div className="text-sm text-gray-500">
                Không tìm thấy thông tin chi nhánh.
              </div>
            </div>
          )}
          {branchRevenueData && !isLoading && !error && (
            <>
              <div className="h-[600px] overflow-hidden rounded-xl bg-white shadow-sm">
                <h3 className="bg-gray-100 p-4 text-sm font-semibold text-gray-700">
                  Doanh thu theo tháng
                </h3>
                <div className="h-full w-full p-4">
                  <BranchRevenueLineChartApex data={[branchRevenueData]} />
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                <h3 className="bg-gray-100 p-4 text-sm font-semibold text-gray-700">
                  Bảng doanh thu chi nhánh
                </h3>
                <Table
                  aria-label="Bảng doanh thu chi nhánh"
                  className="w-full min-w-[600px]"
                  shadow="none"
                >
                  <TableHeader>
                    {columns.map((column) => (
                      <TableColumn
                        key={column.key}
                        className="bg-gray-100 text-sm font-semibold text-gray-700"
                      >
                        {column.label}
                      </TableColumn>
                    ))}
                  </TableHeader>
                  <TableBody
                    items={[branchRevenueData]}
                    emptyContent={
                      <div className="py-4 text-center text-gray-500">
                        Không có dữ liệu doanh thu.
                      </div>
                    }
                  >
                    {(branch) => (
                      <TableRow
                        key={branch.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {(columnKey) => renderCell(branch, columnKey as string)}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Reports;
