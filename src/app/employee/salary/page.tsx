"use client";

import {
  Input,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import React, { Key, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { mappingDayOfWeek, shiftDetailColumns } from "@/data/salary.data";
import { SalaryDetailResponse, ShiftDetail } from "@/types/salary.type";
import useSWR from "swr";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import axiosInstance from "@/lib/axiosInstance";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const Salary: React.FC = () => {
  const [month] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"));
  const [year] = useState<string>(new Date().getFullYear().toString());

  const { data, error, isLoading } = useSWR<SalaryDetailResponse>(
    `/salary/my/month/${month}/year/${year}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (error) {
    toast.error("Lỗi khi tải chi tiết lương.");
  }

  const calculateTotalSalary = useCallback(() => {
    if (!data?.data?.shiftDetails) return 0;
    return data.data.shiftDetails.reduce((total, shift) => {
      return total + (shift.totalShiftCheckins * shift.shiftSalary);
    }, 0);
  }, [data]);

  const renderCell = useCallback(
    (shift: ShiftDetail, columnKey: Key, index: number): React.ReactNode => {
      const cellValue = shift[columnKey as keyof ShiftDetail];

      switch (columnKey) {
        case "index":
          return (
            <span className="text-sm font-medium text-gray-700">
              {index + 1}
            </span>
          );
        case "shiftId":
          return <span className="text-sm text-gray-600">{shift.shiftId}</span>;
        case "daysOfWeek":
          return (
            <span className="text-sm text-gray-600">
              {mappingDayOfWeek[cellValue as keyof typeof mappingDayOfWeek] || "Không xác định"}
            </span>
          );
        case "startTime":
        case "endTime":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "shiftSalary":
        case "totalShiftSalary":
          return (
            <span className="text-sm text-gray-600">
              {(cellValue as number).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          );
        case "totalShiftCheckins":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        default:
          return cellValue?.toString();
      }
    },
    []
  );

  return (
    <main className="flex w-full min-h-screen bg-gray-50 p-6">
      <div className="flex h-full w-full">
        <div className="flex flex-col w-full gap-6 bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết lương</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Input
                type="number"
                value={month}
                isReadOnly
                placeholder="Tháng"
                className="bg-white w-full sm:w-32 rounded-lg border-secondary-400 shadow-sm"
                variant="bordered"
                size="md"
              />
              <Input
                type="number"
                value={year}
                isReadOnly
                placeholder="Năm"
                className="bg-white w-full sm:w-32 rounded-lg border-secondary-400 shadow-sm"
                variant="bordered"
                size="md"
              />
            </div>
          </div>
          {isLoading ? (
            <Spinner className="mx-auto my-4" />
          ) : error || !data?.data ? (
            <p className="text-center text-gray-500">Không có dữ liệu</p>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm-semibold text-secondary-900">
                    ID Nhân viên
                  </span>
                  <span className="basis-[70%] text-sm text-gray-600">
                    {data.data.employeeId}
                  </span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm-semibold text-secondary-900">
                    Tên nhân viên
                  </span>
                  <span className="basis-[70%] text-sm text-gray-600">
                    {data.data.employeeName}
                  </span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm-semibold text-secondary-900">
                    Vị trí
                  </span>
                  <span className="basis-[70%] text-sm text-gray-600">
                    {data.data.role}
                  </span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm-semibold text-secondary-900">
                    Tổng số check-in
                  </span>
                  <span className="basis-[70%] text-sm text-gray-600">
                    {data.data.totalCheckins}
                  </span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm-semibold text-secondary-900">
                    Tổng lương
                  </span>
                  <span className="basis-[70%] text-sm text-gray-600">
                    {calculateTotalSalary().toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-black">
                  Chi tiết ca làm
                </span>
                <div className="max-h-[300px] overflow-auto rounded-xl bg-white shadow-sm mt-2">
                  <Table
                    aria-label="Bảng chi tiết ca làm"
                    className="min-w-full"
                    shadow="none"
                    selectionMode="none"
                  >
                    <TableHeader>
                      {shiftDetailColumns.map((column) => (
                        <TableColumn
                          key={column.uid}
                          align={column.uid === "index" ? "center" : "start"}
                          allowsSorting={column.sortable}
                          className="text-sm font-semibold text-gray-600 bg-gray-100"
                        >
                          {column.name}
                        </TableColumn>
                      ))}
                    </TableHeader>
                    <TableBody
                      items={data.data.shiftDetails}
                      emptyContent={
                        <div className="text-gray-500 text-center py-4">
                          Không có ca làm nào.
                        </div>
                      }
                    >
                      {(item: ShiftDetail) => (
                        <TableRow
                          key={item.shiftId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {(columnKey: Key) => (
                            <TableCell className="py-3 text-base-regular">
                              {renderCell(
                                item,
                                columnKey,
                                data.data.shiftDetails.indexOf(item)
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Salary;