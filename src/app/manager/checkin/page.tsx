"use client";

import {
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
import { EyeIcon, MagnifyingGlassIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { columns } from "@/data/shift.data";
import { ShiftDto } from "@/types/shift.type";
import { ShiftEmployeeDisplayCard } from "@/components";
import CheckinManagerService from "@/services/manager.services/CheckinServices";
import ConfirmCheckin from "@/app/manager/checkin/ConfirmCheckin.modal";
import ConfirmCancelCheckin from "@/app/manager/checkin/ConfirmCancelCheckin.modal";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Checkin = () => {
  const [shifts, setShifts] = useState<ShiftDto[]>([]);
  const [totalShifts, setTotalShifts] = useState<number>(0);
  const [filterFullName, setFilterFullName] = useState<string>("");
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isCancelCheckinModalOpen, setIsCancelCheckinModalOpen] = useState(false);
  const [actionShiftId, setActionShiftId] = useState<string | null>(null);
  const rowsPerPage = 10;

  const today = new Date();
  const isToday = selectedDate.toDateString() === today.toDateString();

  const endpointShifts = useMemo(() => {
    const params = new URLSearchParams({
      year: selectedDate.getFullYear().toString(),
      month: (selectedDate.getMonth() + 1).toString(),
      day: selectedDate.getDate().toString(),
      page: page.toString(),
      limit: rowsPerPage.toString(),
    });
    return `/shift/branch/specific-date?${params.toString()}`;
  }, [page, selectedDate]);

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
    if (shiftsError) {
      setShifts([]);
      setTotalShifts(0);
      toast.error("Lỗi khi tải danh sách ca làm việc.");
    } else if (shiftsData?.data) {
      let filteredShifts = shiftsData.data;
      if (filterFullName) {
        filteredShifts = filteredShifts.filter((shift: ShiftDto) =>
          shift.employeeFullName
            .toLowerCase()
            .includes(filterFullName.toLowerCase())
        );
      }
      setShifts(filteredShifts);
      setTotalShifts(shiftsData.paging?.total || 0);
    }
  }, [shiftsData, shiftsError, filterFullName]);

  const shiftDetails = useMemo(() => {
    return shifts.find((shift) => shift.id === selectedShiftId) || null;
  }, [shifts, selectedShiftId]);

  const pages = useMemo(() => {
    return totalShifts ? Math.ceil(totalShifts / rowsPerPage) : 0;
  }, [totalShifts]);

  const loadingState = shiftsLoading || shifts.length === 0 ? "loading" : "idle";

  const handleSearchFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFullName(e.target.value);
    setPage(1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
      setPage(1);
    }
  };

  const isShiftTimeValid = (shift: ShiftDto): boolean => {
    const now = new Date(); // Thời gian hiện tại tại Asia/Ho_Chi_Minh
    const shiftDate = new Date(selectedDate); // Ngày được chọn, múi giờ local

    // Giả sử shiftStartTime và shiftEndTime là theo múi giờ local (Asia/Ho_Chi_Minh)
    const [startHours, startMinutes] = shift.shiftStartTime.split(":").map(Number);
    const [endHours, endMinutes] = shift.shiftEndTime.split(":").map(Number);

    const startTime = new Date(shiftDate);
    startTime.setHours(startHours, startMinutes, 0, 0);

    const endTime = new Date(shiftDate);
    endTime.setHours(endHours, endMinutes, 0, 0);

    // Thêm 30 phút buffer cho endTime
    const endTimeWithBuffer = new Date(endTime);
    endTimeWithBuffer.setMinutes(endTime.getMinutes() + 30);

    // Xử lý ca làm việc qua đêm
    if (endTime <= startTime) {
      endTimeWithBuffer.setDate(endTimeWithBuffer.getDate() + 1);
    }

    return now >= startTime && now <= endTimeWithBuffer;
  };

  const handleCheckIn = async () => {
    if (!actionShiftId) return;
    try {
      const checkinTime = new Date().toISOString(); // Gửi UTC time
      await CheckinManagerService.checkInDailyEmployee(actionShiftId, checkinTime);
      toast.success("Chấm công thành công.");
      mutateShifts();
      setIsCheckinModalOpen(false);
      setActionShiftId(null);
    } catch (error) {
      toast.error("Lỗi khi chấm công.");
      setIsCheckinModalOpen(false);
      setActionShiftId(null);
    }
  };

  const handleCancelCheckIn = async () => {
    if (!actionShiftId) return;
    try {
      const shift = shifts.find((s) => s.id === actionShiftId);
      if (!shift) throw new Error("Shift not found");
      const checkinData = await CheckinManagerService.getCheckinByShiftAndDateMonthYear({
        shiftId: actionShiftId,
        day: selectedDate.getDate(),
        month: shift.month,
        year: shift.year,
      });
      const checkinId = checkinData.data[0]?.id;
      if (!checkinId) throw new Error("Check-in ID not found");
      await CheckinManagerService.deleteCheckin(checkinId);
      toast.success("Hủy chấm công thành công.");
      mutateShifts();
      setIsCancelCheckinModalOpen(false);
      setActionShiftId(null);
    } catch (error) {
      toast.error("Lỗi khi hủy chấm công.");
      setIsCancelCheckinModalOpen(false);
      setActionShiftId(null);
    }
  };

  const openCheckinModal = (shiftId: string) => {
    setActionShiftId(shiftId);
    setIsCheckinModalOpen(true);
  };

  const openCancelCheckinModal = (shiftId: string) => {
    setActionShiftId(shiftId);
    setIsCancelCheckinModalOpen(true);
  };

  const renderCell = useCallback(
    (shift: ShiftDto, columnKey: Key, index: number): React.ReactNode => {
      const cellValue = shift[columnKey as keyof ShiftDto];

      switch (columnKey) {
        case "index":
          return (
            <span className="text-sm font-medium text-gray-700">
              {index + 1 + (page - 1) * rowsPerPage}
            </span>
          );
        case "employeeFullName":
          return <span className="text-sm text-gray-900">{cellValue}</span>;
        case "shiftStartTime":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "shiftEndTime":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "checkin":
          return (
            <span
              className={`text-sm ${
                shift.checkin ? "text-green-600" : "text-red-600"
              }`}
            >
              {shift.checkin ? "Đã chấm công" : "Chưa chấm công"}
            </span>
          );
        case "actions":
          const isValidTime = isToday && isShiftTimeValid(shift);
          return (
            <div className="flex items-center justify-center gap-2">
              <Tooltip
                content="Xem chi tiết"
                className="bg-primary-700 text-white px-2 py-1 rounded-md text-xs"
              >
                <span
                  className="cursor-pointer text-primary-700 hover:text-primary-500 transition-colors"
                  onClick={() => setSelectedShiftId(shift.id)}
                >
                  <EyeIcon className="size-5" />
                </span>
              </Tooltip>
              {isValidTime && !shift.checkin && (
                <Tooltip
                  content="Chấm công"
                  className="bg-green-600 text-white px-2 py-1 rounded-md text-xs"
                >
                  <Button
                    isIconOnly
                    size="sm"
                    color="success"
                    onClick={() => openCheckinModal(shift.id)}
                  >
                    <CheckIcon className="size-4" />
                  </Button>
                </Tooltip>
              )}
              {isValidTime && shift.checkin && (
                <Tooltip
                  content="Hủy chấm công"
                  className="bg-red-600 text-white px-2 py-1 rounded-md text-xs"
                >
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    onClick={() => openCancelCheckinModal(shift.id)}
                  >
                    <XMarkIcon className="size-4" />
                  </Button>
                </Tooltip>
              )}
            </div>
          );
        default:
          return cellValue?.toString();
      }
    },
    [page, isToday]
  );

  return (
    <main className="flex w-full min-h-screen gap-4 bg-gray-50 p-6">
      <div className="flex h-full w-full gap-4">
        {/* Shifts Table (70%) */}
        <div className="flex flex-col basis-[70%]">
          <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách ca làm việc
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  className="bg-white w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
                  variant="bordered"
                  size="md"
                  placeholder="Tìm theo tên nhân viên"
                  startContent={
                    <MagnifyingGlassIcon className="size-5 text-gray-400" />
                  }
                  value={filterFullName}
                  onChange={handleSearchFullName}
                />
                <Input
                  className="bg-white w-full sm:w-48 rounded-lg border-gray-200 shadow-sm"
                  variant="bordered"
                  size="md"
                  type="date"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            {/* Table Rendering */}
            <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm">
              <Table
                aria-label="Bảng danh sách ca làm việc"
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
                  items={shifts}
                  emptyContent={
                    <div className="text-gray-500 text-center py-4">
                      Không có ca làm việc nào.
                    </div>
                  }
                  loadingContent={<Spinner className="mx-auto my-4" />}
                  loadingState={loadingState}
                >
                  {(item: ShiftDto) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {(columnKey: Key) => (
                        <TableCell className="py-3">
                          {renderCell(item, columnKey, shifts.indexOf(item))}
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
          {selectedShiftId && shiftDetails ? (
            <ShiftEmployeeDisplayCard {...shiftDetails} />
          ) : (
            <p className="text-gray-500 text-sm flex-grow">
              Chọn một ca làm việc để xem chi tiết.
            </p>
          )}
        </div>
      </div>
      {/* Modals */}
      <ConfirmCheckin
        isOpen={isCheckinModalOpen}
        onClose={() => {
          setIsCheckinModalOpen(false);
          setActionShiftId(null);
        }}
        onConfirm={handleCheckIn}
      />
      <ConfirmCancelCheckin
        isOpen={isCancelCheckinModalOpen}
        onClose={() => {
          setIsCancelCheckinModalOpen(false);
          setActionShiftId(null);
        }}
        onConfirm={handleCancelCheckIn}
      />
    </main>
  );
};

export default Checkin;