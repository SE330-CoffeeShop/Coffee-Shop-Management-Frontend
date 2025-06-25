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
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { Key, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import viLocale from "@fullcalendar/core/locales/vi";
import { EmployeeDto } from "@/types/employee.type";
import { format, parse, isValid, eachDayOfInterval, endOfMonth } from "date-fns";
import { AppContext } from "@/contexts";
import { AuthType } from "@/types/auth.type";
import AddShiftModal from "@/app/manager/shifts/AddShift.modal";
import { ButtonSolid } from "@/components";

interface Shift {
  id: string;
  shiftStartTime: string;
  shiftEndTime: string;
  dayOfWeek: string;
  month: number;
  year: number;
  employeeId: string;
}

const columns = [
  { uid: "index", name: "STT", sortable: false },
  { uid: "userFullName", name: "Họ và tên", sortable: true },
  { uid: "userRole", name: "Vai trò", sortable: true },
];

const daysOfWeek = [
  { key: "MONDAY", label: "Thứ Hai", apiValue: "THỨ HAI" },
  { key: "TUESDAY", label: "Thứ Ba", apiValue: "THỨ BA" },
  { key: "WEDNESDAY", label: "Thứ Tư", apiValue: "THỨ TƯ" },
  { key: "THURSDAY", label: "Thứ Năm", apiValue: "THỨ NĂM" },
  { key: "FRIDAY", label: "Thứ Sáu", apiValue: "THỨ SÁU" },
  { key: "SATURDAY", label: "Thứ Bảy", apiValue: "THỨ BẢY" },
  { key: "SUNDAY", label: "Chủ Nhật", apiValue: "CHỦ NHẬT" },
];

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const getEmployeeColor = (employeeId: string) => {
  const colors = [
    "#EF4444",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
  ];
  const index = employeeId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const Shifts = () => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [filterFullName, setFilterFullName] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
  const rowsPerPage = 10;
  const [shifts, setShifts] = useState<Shift[]>([]);

  const { auth } = useContext(AppContext) as AuthType;
  const { id: currentEmployeeId, branchId } = auth || {};

  useEffect(() => {
    if (currentEmployeeId && !selectedEmployeeId) {
      setSelectedEmployeeId(currentEmployeeId);
    }
  }, [currentEmployeeId, selectedEmployeeId]);

  const endpointEmployees = useMemo(() => {
    if (!branchId) return null;
    const params = new URLSearchParams({
      page: page.toString(),
      limit: rowsPerPage.toString(),
    });
    return `/employee/branch?${params.toString()}`;
  }, [page, branchId]);

  const endpointShifts = useMemo(() => {
    if (!selectedEmployeeId) return null;
    const params = new URLSearchParams({
      page: "1",
      limit: "200",
    });
    return `/shift/employee/${selectedEmployeeId}?${params.toString()}`;
  }, [selectedEmployeeId]);

  const {
    data: employeesData,
    error: employeesError,
    isLoading: employeesLoading,
    mutate: mutateEmployees,
  } = useSWR(endpointEmployees, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const {
    data: shiftsData,
    error: shiftsError,
    isLoading: shiftsLoading,
    mutate: mutateShifts,
  } = useSWR(endpointShifts, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (employeesError) {
      setEmployees([]);
      setTotalEmployees(0);
      toast.error("Lỗi khi tải danh sách nhân viên.");
    } else if (employeesData?.data) {
      let filteredEmployees = employeesData.data;
      if (filterFullName) {
        filteredEmployees = filteredEmployees.filter((employee: EmployeeDto) =>
          employee.userFullName.toLowerCase().includes(filterFullName.toLowerCase())
        );
      }
      setEmployees(filteredEmployees);
      setTotalEmployees(employeesData.paging?.total || 0);
    }
  }, [employeesData, employeesError, filterFullName]);

  useEffect(() => {
    if (shiftsError) {
      setShifts([]);
      toast.error("Lỗi khi tải danh sách ca làm việc.");
    } else if (shiftsData?.data) {
      setShifts(shiftsData.data);
    }
  }, [shiftsData, shiftsError]);

  const pages = useMemo(() => {
    return totalEmployees ? Math.ceil(totalEmployees / rowsPerPage) : 0;
  }, [totalEmployees]);

  const loadingState = employeesLoading || employees.length === 0 ? "loading" : "idle";

  const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId);

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
          return (
            <div className="flex items-center gap-2">
              {employee.userAvatarUrl ? (
                <img
                  src={employee.userAvatarUrl}
                  alt={employee.userFullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">N/A</span>
                </div>
              )}
              <span
                className={`text-sm text-gray-900 cursor-pointer hover:text-blue-700 ${
                  selectedEmployeeId === employee.id ? "font-semibold" : ""
                }`}
              >
                {cellValue}
              </span>
            </div>
          );
        case "userRole":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        default:
          return cellValue?.toString();
      }
    },
    [page, selectedEmployeeId]
  );

  const handleSearchFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFullName(e.target.value);
    setPage(1);
  };

  const events = shifts.flatMap((shift) => {
    const dayOfWeekMap = daysOfWeek.reduce((map, day) => {
      map[day.apiValue] = day.key;
      return map;
    }, {} as { [key: string]: string });

    const dayMap: { [key: string]: number } = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    const enumDayOfWeek = dayOfWeekMap[shift.dayOfWeek];
    if (!enumDayOfWeek) {
      console.error(`Invalid dayOfWeek: ${shift.dayOfWeek} for shift: ${shift.id}`);
      return [];
    }

    const targetDayIndex = dayMap[enumDayOfWeek];
    const startOfMonth = new Date(shift.year, shift.month - 1, 1);
    const endOfMonthDate = endOfMonth(startOfMonth);

    if (!isValid(startOfMonth) || !isValid(endOfMonthDate)) {
      console.error(`Invalid date for shift: ${shift.id}`);
      return [];
    }

    // Lấy tất cả các ngày trong tháng
    const allDays = eachDayOfInterval({ start: startOfMonth, end: endOfMonthDate });

    // Lọc các ngày thuộc dayOfWeek
    const targetDays = allDays.filter((date) => date.getDay() === targetDayIndex);

    return targetDays.map((date, index) => {
      const startDateTime = parse(
        `${format(date, "yyyy-MM-dd")} ${shift.shiftStartTime}`,
        "yyyy-MM-dd HH:mm:ss",
        new Date()
      );
      let endDateTime = parse(
        `${format(date, "yyyy-MM-dd")} ${shift.shiftEndTime}`,
        "yyyy-MM-dd HH:mm:ss",
        new Date()
      );

      if (!isValid(startDateTime) || !isValid(endDateTime)) {
        console.error(`Invalid time for shift: ${shift.id} on ${format(date, "yyyy-MM-dd")}`);
        return null;
      }

      if (shift.shiftEndTime < shift.shiftStartTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }

      return {
        id: `${shift.id}-${index}`, // Thêm index để đảm bảo ID duy nhất
        title: `${shift.shiftStartTime} - ${shift.shiftEndTime}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: getEmployeeColor(shift.employeeId),
        borderColor: getEmployeeColor(shift.employeeId),
        extendedProps: { employeeId: shift.employeeId },
      };
    }).filter((event) => event !== null);
  });

  return (
    <main className="flex w-full min-h-screen flex-col lg:flex-row gap-4 bg-gray-50 p-6">
      <div className="flex flex-col w-full lg:basis-[30%]">
        <div className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Danh sách nhân viên</h2>
            <Input
              className="w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
              variant="bordered"
              placeholder="Tìm kiếm theo họ và tên"
              startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
              value={filterFullName}
              onChange={handleSearchFullName}
            />
          </div>
          <div className="h-[500px] overflow-x-auto rounded-xl bg-white shadow-sm">
            <Table
              aria-label="Bảng danh sách nhân viên"
              className="min-w-full"
              shadow="none"
              selectionMode="single"
              selectedKeys={selectedEmployeeId ? [selectedEmployeeId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedEmployeeId(selected || currentEmployeeId);
              }}
            >
              <TableHeader>
                {columns.map((column) => (
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
                items={employees}
                emptyContent={<div className="text-gray-500 text-center py-4">Không có nhân viên nào.</div>}
                loadingContent={<Spinner className="mx-auto my-4" />}
                loadingState={loadingState}
              >
                {(item: EmployeeDto) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedEmployeeId === item.id ? "bg-blue-100" : ""
                    }`}
                  >
                    {(columnKey: Key) => (
                      <TableCell className="py-3">{renderCell(item, columnKey, employees.indexOf(item))}</TableCell>
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
      </div>

      <div className="flex flex-col w-full lg:basis-[70%]">
        <div className="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-800">
                {selectedEmployee?.userFullName || "Chưa chọn nhân viên"}
              </span>
              <span className="text-lg text-gray-600">
                - {selectedEmployee?.userRole || ""}
              </span>
            </div>
            <ButtonSolid
              content="Thêm ca làm việc"
              onClick={() => setIsAddShiftModalOpen(true)}
              className="bg-primary-600 text-base-semibold text-white rounded-lg hover:bg-primary-700"
            />
          </div>
          <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm">
            {shiftsLoading ? (
              <Spinner className="mx-auto my-4" />
            ) : (
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                locale={viLocale}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
                events={events}
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                allDaySlot={false}
                height="auto"
                slotDuration="00:30:00"
                slotLabelInterval="01:00:00"
                eventContent={(eventInfo) => (
                  <div className="p-2 text-base">
                    <p>{eventInfo.event.title}</p>
                  </div>
                )}
              />
            )}
          </div>
        </div>
      </div>

      <AddShiftModal
        isOpen={isAddShiftModalOpen}
        onOpenChange={() => setIsAddShiftModalOpen(!isAddShiftModalOpen)}
        onClose={() => setIsAddShiftModalOpen(false)}
        employees={employees}
        onCreated={mutateShifts}
      />
    </main>
  );
};

export default Shifts;