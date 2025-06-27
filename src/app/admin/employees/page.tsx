"use client";

import {
  Chip,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { columns, statusAdminOptions } from "@/data/employee.data";
import { EmployeeDto } from "@/types/employee.type";
import EmployeeCardDisplay from "@/components/Card/EmployeeCardDisplay";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Employees = () => {
  const [allEmployees, setAllEmployees] = useState<EmployeeDto[]>([]);
  const [filterFullName, setFilterFullName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("QUẢN LÝ");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        let page = 1;
        let allData: EmployeeDto[] = [];
        let totalPages = 1;

        while (page <= totalPages) {
          const params = new URLSearchParams({
            page: page.toString(),
            limit: "100",
          });
          const response = await fetcher(`/employee/all?${params.toString()}`);
          allData = [...allData, ...response.data];
          totalPages = response.paging?.totalPages || 1;
          page++;
        }

        setAllEmployees(allData);
      } catch (error) {
        setAllEmployees([]);
        toast.error("Lỗi khi tải danh sách nhân viên.");
      }
    };

    fetchAllEmployees();
  }, []);

  const endpointEmployeeDetails = selectedEmployeeId
    ? `/employee/${selectedEmployeeId}`
    : null;

  const { data: employeeDetailsData, error: employeeDetailsError } = useSWR(
    endpointEmployeeDetails,
    fetcher,
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const employeeDetails: EmployeeDto = employeeDetailsData?.data || null;

  const filteredEmployees = useMemo(() => {
    let result = allEmployees;

    // Lọc theo vai trò
    result = result.filter(
      (employee: EmployeeDto) => employee.userRole === selectedStatus
    );

    // Lọc theo họ và tên
    if (filterFullName) {
      result = result.filter((employee: EmployeeDto) =>
        employee.userFullName
          ?.toLowerCase()
          .includes(filterFullName.toLowerCase())
      );
    }

    return result;
  }, [allEmployees, selectedStatus, filterFullName]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredEmployees, page]);

  const totalPages = useMemo(() => {
    return filteredEmployees.length ? Math.ceil(filteredEmployees.length / rowsPerPage) : 0;
  }, [filteredEmployees]);

  const loadingState = allEmployees.length === 0 ? "loading" : "idle";

  const handleSearchFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFullName(e.target.value);
    setPage(1);
  };

  const handleFilterStatus = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const renderCell = useCallback(
    (employee: EmployeeDto, columnKey: Key, index: number): React.ReactNode => {
      const cellValue = employee[columnKey as keyof EmployeeDto];

      switch (columnKey) {
        case "index":
          return (
            <span className="text-sm font-medium text-gray-700">
              {index + 1 + (page - 1) * rowsPerPage}
            </span>
          );
        case "userFullName":
          return <span className="text-sm text-gray-900">{cellValue}</span>;
        case "userGender":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "userEmail":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "userDoB":
          return (
            <span className="text-sm text-gray-600">
              {new Date(cellValue as string).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          );
        case "userRole":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "employeeHireDate":
          return (
            <span className="text-sm text-gray-600">
              {new Date(cellValue as string).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          );
        case "actions":
          return (
            <div className="flex items-center justify-center gap-2">
              <Tooltip
                content="Xem chi tiết"
                className="bg-primary-700 text-white px-2 py-1 rounded-md text-xs"
              >
                <span
                  className="cursor-pointer text-primary-700 hover:text-primary-500 transition-colors"
                  onClick={() => setSelectedEmployeeId(employee.id)}
                >
                  <EyeIcon className="size-5" />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue?.toString();
      }
    },
    [page]
  );

  return (
    <main className="flex w-full min-h-screen gap-4 bg-gray-50 p-6">
      <div className="flex h-full w-full gap-4">
        {/* Employees Table (70%) */}
        <div className="flex flex-col basis-[70%]">
          <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách nhân viên
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  className="bg-white w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
                  variant="bordered"
                  size="md"
                  placeholder="Tìm theo họ và tên"
                  startContent={
                    <MagnifyingGlassIcon className="size-5 text-gray-400" />
                  }
                  value={filterFullName}
                  onChange={handleSearchFullName}
                />
              </div>
            </div>
            {/* Status Chips */}
            <div className="flex flex-wrap gap-2">
              {statusAdminOptions.map((status) => (
                <Chip
                  key={status.uid}
                  className={`capitalize cursor-pointer font-medium px-3 py-1 transition-all duration-200 ${
                    selectedStatus === status.uid
                      ? "text-primary-700 border-b-2 border-primary-700 border-t-transparent border-l-transparent border-r-transparent"
                      : "text-gray-700 hover:text-primary-400"
                  }`}
                  size="md"
                  radius="sm"
                  onClick={() => handleFilterStatus(status.uid)}
                >
                  {status.name}
                </Chip>
              ))}
            </div>
            {/* Table Rendering */}
            <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm">
              <Table
                aria-label="Bảng danh sách nhân viên"
                className="h-full w-full"
                shadow="none"
                selectionMode="none"
              >
                <TableHeader>
                  {columns.map((column) => (
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
                  items={paginatedEmployees}
                  emptyContent={
                    <div className="text-gray-500 text-center py-4">
                      Không có nhân viên nào.
                    </div>
                  }
                  loadingContent={<Spinner className="mx-auto my-4" />}
                  loadingState={loadingState}
                >
                  {(item: EmployeeDto) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {(columnKey: Key) => (
                        <TableCell className="py-3">
                          {renderCell(item, columnKey, paginatedEmployees.indexOf(item))}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                  className="bg-white rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
        {/* Employee Details (30%) */}
        <div className="flex flex-col basis-[30%] bg-white p-6 rounded-2xl shadow-lg h-full">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Chi tiết nhân viên
          </h3>
          {selectedEmployeeId && employeeDetails ? (
            <EmployeeCardDisplay {...employeeDetails} />
          ) : (
            <p className="text-gray-500 text-sm flex-grow">
              Chọn một nhân viên để xem chi tiết.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Employees;