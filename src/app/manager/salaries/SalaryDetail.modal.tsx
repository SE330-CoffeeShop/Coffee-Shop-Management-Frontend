"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { shiftDetailColumns } from "@/data/salary.data";
import { mappingDayOfWeek } from "@/data/salary.data";
import { SalaryDetailResponse, ShiftDetail } from "@/types/salary.type";
import useSWR from "swr";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import axiosInstance from "@/lib/axiosInstance";
import React, { Key, useCallback } from "react";

interface SalaryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  salaryId: string | null;
}

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const SalaryDetailModal: React.FC<SalaryDetailModalProps> = ({
  isOpen,
  onClose,
  salaryId,
}) => {
  const { data, error, isLoading } = useSWR<SalaryDetailResponse>(
    salaryId ? `/salary/detail/${salaryId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (error) {
    toast.error("Lỗi khi tải chi tiết lương.");
  }

  const calculateTotalSalary = useCallback(() => {
    if (!data?.data?.shiftDetails) return 0;
    return data.data.shiftDetails.reduce((total, shift) => {
      return total + shift.totalShiftCheckins * shift.shiftSalary;
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
              {mappingDayOfWeek[cellValue as keyof typeof mappingDayOfWeek] ||
                "Không xác định"}
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
    <Modal
      size="5xl"
      isOpen={isOpen}
      onOpenChange={onClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      scrollBehavior="outside"
      classNames={{
        body: "py-5 px-6 bg-white border-outline-var",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-outline-var bg-outline-var",
        header: "border-b-[1px] border-border bg-white",
        footer: "border-t-[1px] border-border bg-white",
      }}
    >
      <ModalContent>
        <ModalHeader className="w-full rounded-t-xl border">
          <div className="border-b--b-primary h-11 w-11 content-center rounded-lg border-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx-auto size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-5">
            <div className="text-lg font-semibold">Chi tiết lương</div>
            <div className="text-wrap text-sm font-normal">
              Thông tin lương nhân viên
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <Spinner className="mx-auto my-4" />
          ) : error || !data?.data ? (
            <p className="text-center text-gray-500">Không có dữ liệu</p>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm font-semibold text-black">
                    ID Nhân viên
                  </span>
                  <span className="basis-[70%] text-sm text-gray-600">
                    {data.data.employeeId}
                  </span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm font-semibold text-black">
                    Tên nhân viên
                  </span>
                  <span className="basis-[70%] text-sm text-gray-600">
                    {data.data.employeeName}
                  </span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm font-semibold text-black">
                    Vị trí
                  </span>
                  <span className="basis-[70%] text-sm text-gray-600">
                    {data.data.role}
                  </span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm font-semibold text-black">
                    Tổng số check-in
                  </span>
                  <span className="basis-[70%] text-sm text-gray-600">
                    {data.data.totalCheckins}
                  </span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="basis-[30%] text-sm font-semibold text-black">
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
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={onClose}
            className="w-full rounded-lg border border-outline bg-white py-2 text-[16px] font-medium text-black hover:bg-gray-100"
          >
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SalaryDetailModal;
