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
  Button,
} from "@heroui/react";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React, {
  Key,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import EmployeeServices from "@/services/manager.services/EmployeeServices";
import { columns } from "@/data/employee.data";
import { EmployeeDto } from "@/types/employee.type";
import EmployeeCardDisplay from "@/components/Card/EmployeeCardDisplay";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Employees = () => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [filterFullName, setFilterFullName] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const endpointEmployees = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: rowsPerPage.toString(),
    });
    return `/employee/branch?${params.toString()}`;
  }, [page]);

  const {
    data: employeesData,
    error: employeesError,
    isLoading: employeesLoading,
    mutate: mutateEmployees,
  } = useSWR(endpointEmployees, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const endpointEmployeeDetails = selectedEmployeeId
    ? `/employee/${selectedEmployeeId}`
    : null;

  const { data: employeeDetailsData, error: employeeDetailsError } = useSWR(
    endpointEmployeeDetails,
    fetcher,
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const employeeDetails: EmployeeDto = employeeDetailsData?.data || null;

  useEffect(() => {
    if (employeesError) {
      setEmployees([]);
      setTotalEmployees(0);
      toast.error("Lỗi khi tải danh sách nhân viên.");
    } else if (employeesData?.data) {
      let filteredEmployees = employeesData.data;
      if (filterFullName) {
        filteredEmployees = filteredEmployees.filter((employee: EmployeeDto) =>
          employee.userFullName
            .toLowerCase()
            .includes(filterFullName.toLowerCase())
        );
      }
      setEmployees(filteredEmployees);
      setTotalEmployees(employeesData.paging?.total || 0);
    }
  }, [employeesData, employeesError, filterFullName]);

  useEffect(() => {
    if (employeeDetailsError) {
      toast.error("Lỗi khi tải chi tiết nhân viên.");
    }
  }, [employeeDetailsError]);

  const pages = useMemo(() => {
    return totalEmployees ? Math.ceil(totalEmployees / rowsPerPage) : 0;
  }, [totalEmployees]);

  const loadingState =
    employeesLoading || employees.length === 0 ? "loading" : "idle";

  const handleSearchFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFullName(e.target.value);
    setPage(1);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const response = await EmployeeServices.deleteEmployeeById(employeeId);
      if (response) {
        toast.success("Nhân viên đã được xóa.");
        mutateEmployees();
      }
    } catch (error) {
      toast.error("Lỗi khi xóa nhân viên.");
    }
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
              <Tooltip
                content="Xóa"
                className="bg-red-600 text-white px-2 py-1 rounded-md text-xs"
              >
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  onClick={() => handleDeleteEmployee(employee.id)}
                >
                  <TrashIcon className="size-4" />
                </Button>
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
                  items={employees}
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
                          {renderCell(item, columnKey, employees.indexOf(item))}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
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
