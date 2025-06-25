"use client";

import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Spinner,
  Button,
} from "@heroui/react";
import { MagnifyingGlassIcon, EyeIcon } from "@heroicons/react/24/outline";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { salaryColumns } from "@/data/salary.data";
import { SalaryDto } from "@/types/salary.type";
import SalaryDetailModal from "@/app/manager/salaries/SalaryDetail.modal";
import axiosInstance from "@/lib/axiosInstance";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const Salaries = () => {
  const [salaries, setSalaries] = useState<SalaryDto[]>([]);
  const [totalSalaries, setTotalSalaries] = useState<number>(0);
  const [filterFullName, setFilterFullName] = useState<string>("");
  const [selectedSalaryId, setSelectedSalaryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Mặc định tháng hiện tại
  const [year, setYear] = useState(new Date().getFullYear()); // Mặc định năm hiện tại
  const [fetchTrigger, setFetchTrigger] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdatingSalaries, setIsUpdatingSalaries] = useState(false);
  const rowsPerPage = 15;

  const endpointSalaries = useMemo(() => {
    if (!fetchTrigger) return null;
    return `/salary/branch/month/${month}/year/${year}?page=${page}&limit=${rowsPerPage}`;
  }, [page, month, year, fetchTrigger]);

  const {
    data: salariesData,
    error: salariesError,
    isLoading: salariesLoading,
    mutate: mutateSalaries,
  } = useSWR(endpointSalaries, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (salariesError) {
      setSalaries([]);
      setTotalSalaries(0);
      toast.error("Lỗi khi tải danh sách lương.");
    } else if (salariesData?.data) {
      let filteredSalaries = salariesData.data;
      if (filterFullName) {
        filteredSalaries = filteredSalaries.filter((salary: SalaryDto) =>
          salary.employeeName.toLowerCase().includes(filterFullName.toLowerCase())
        );
      }
      setSalaries(filteredSalaries);
      setTotalSalaries(salariesData.paging?.total || 0);
    }
  }, [salariesData, salariesError, filterFullName]);

  const pages = useMemo(() => {
    return totalSalaries ? Math.ceil(totalSalaries / rowsPerPage) : 0;
  }, [totalSalaries]);

  const loadingState = salariesLoading || salaries.length === 0 ? "loading" : "idle";

  const handleSearchFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFullName(e.target.value);
    setPage(1);
  };

  const handleFilter = () => {
    setPage(1);
    setFetchTrigger(true);
  };

  const handleUpdateSalaries = async () => {
    try {
      setIsUpdatingSalaries(true);
      await axiosInstance.post(`/salary/update-all/month/${month}/year/${year}`);
      toast.success("Cập nhật lương thành công!");
      mutateSalaries(); // Tái tải danh sách lương
    } catch (error: any) {
      toast.error("Cập nhật lương thất bại. Vui lòng thử lại.");
      toast.error(error?.response?.data?.message || "Lỗi không xác định");
    } finally {
      setIsUpdatingSalaries(false);
    }
  };

  const renderCell = useCallback(
    (salary: SalaryDto, columnKey: Key, index: number): React.ReactNode => {
      const cellValue = salary[columnKey as keyof SalaryDto];

      switch (columnKey) {
        case "index":
          return (
            <span className="text-sm font-medium text-gray-700">
              {index + 1 + (page - 1) * rowsPerPage}
            </span>
          );
        case "employeeId":
          return (
            <span className="text-sm text-gray-600">
              {salary.employeeId.slice(0, 8)}...
            </span>
          );
        case "employeeName":
          return <span className="text-sm text-gray-900">{cellValue}</span>;
        case "role":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "monthSalary":
          return (
            <span className="text-sm text-gray-600">
              {(cellValue as number).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          );
        case "updatedAt":
          return (
            <span className="text-sm text-gray-600">
              {format(new Date(salary.updatedAt), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
            </span>
          );
        case "actions":
          return (
            <Button
              isIconOnly
              size="sm"
              onClick={() => {
                setSelectedSalaryId(salary.id);
                setIsDetailModalOpen(true);
              }}
            >
              <EyeIcon className="size-4" />
            </Button>
          );
        default:
          return cellValue?.toString();
      }
    },
    [page]
  );

  return (
    <main className="flex w-full min-h-screen flex-col gap-4 bg-gray-50 p-6">
      <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Danh sách lương nhân viên</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Input
              className="bg-white w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
              variant="bordered"
              size="md"
              placeholder="Tìm theo tên nhân viên"
              startContent={<MagnifyingGlassIcon className="size-5 text-gray-400" />}
              value={filterFullName}
              onChange={handleSearchFullName}
            />
            <div className="flex gap-2">
              <Input
                className="bg-white w-24 rounded-lg border-gray-200 shadow-sm"
                variant="bordered"
                size="md"
                type="number"
                placeholder="Tháng"
                value={month.toString()}
                onChange={(e) => setMonth(Number(e.target.value))}
                min={1}
                max={12}
              />
              <Input
                className="bg-white w-28 rounded-lg border-gray-200 shadow-sm"
                variant="bordered"
                size="md"
                type="number"
                placeholder="Năm"
                value={year.toString()}
                onChange={(e) => setYear(Number(e.target.value))}
                min={2000}
                max={9999}
              />
              <Button
                color="primary"
                onClick={handleFilter}
                className="bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Lọc
              </Button>
              <Button
                color="primary"
                onClick={handleUpdateSalaries}
                isDisabled={isUpdatingSalaries}
                className="bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {isUpdatingSalaries ? "Đang tính..." : "Tính lương"}
              </Button>
            </div>
          </div>
        </div>
        <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm">
          <Table
            aria-label="Bảng danh sách lương nhân viên"
            className="h-full w-full"
            shadow="none"
            selectionMode="none"
          >
            <TableHeader>
              {salaryColumns.map((column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                  className="text-sm font-semibold text-gray-700 bg-gray-100"
                >
                  {column.name}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody
              items={salaries}
              emptyContent={
                <div className="text-gray-500 text-center py-4">
                  Không có dữ liệu lương.
                </div>
              }
              loadingContent={<Spinner className="mx-auto my-4" />}
              loadingState={loadingState}
            >
              {(item: SalaryDto) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {(columnKey: Key) => (
                    <TableCell className="py-3">
                      {renderCell(item, columnKey, salaries.indexOf(item))}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {pages > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
              className="bg-white rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>
      <SalaryDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSalaryId(null);
        }}
        salaryId={selectedSalaryId}
      />
    </main>
  );
};

export default Salaries;