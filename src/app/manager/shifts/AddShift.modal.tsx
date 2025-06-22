"use client";

import {
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Select,
  SelectItem,
  Image,
} from "@heroui/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ShiftServices from "@/services/manager.services/ShiftServices";
import { CreateShiftDto } from "@/types/shift.type";
import { EmployeeDto } from "@/types/employee.type";

const AddShiftModal = ({
  isOpen,
  onOpenChange,
  onClose,
  employees,
  onCreated,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  employees: EmployeeDto[];
  onCreated?: () => void;
}) => {
  const [shiftStartTime, setShiftStartTime] = useState<string>("");
  const [shiftEndTime, setShiftEndTime] = useState<string>("");
  const [daysOfWeek, setDaysOfWeek] = useState<Set<string>>(new Set());
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [shiftSalary, setShiftSalary] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    shiftStartTime: string;
    shiftEndTime: string;
    daysOfWeek: string;
    month: string;
    year: string;
    shiftSalary: string;
    employeeId: string;
  }>({
    shiftStartTime: "",
    shiftEndTime: "",
    daysOfWeek: "",
    month: "",
    year: "",
    shiftSalary: "",
    employeeId: "",
  });

  const dayOptions = [
    { key: "MONDAY", label: "Thứ Hai" },
    { key: "TUESDAY", label: "Thứ Ba" },
    { key: "WEDNESDAY", label: "Thứ Tư" },
    { key: "THURSDAY", label: "Thứ Năm" },
    { key: "FRIDAY", label: "Thứ Sáu" },
    { key: "SATURDAY", label: "Thứ Bảy" },
    { key: "SUNDAY", label: "Chủ Nhật" },
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    key: (i + 1).toString(),
    label: `Tháng ${i + 1}`,
  }));

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { key: year.toString(), label: year.toString() };
  });

  const validateInputs = () => {
    const newErrors = { ...errors };

    // Validate shiftStartTime (HH:mm format)
    newErrors.shiftStartTime = shiftStartTime && /^([0-1]\d|2[0-3]):[0-5]\d$/.test(shiftStartTime)
      ? ""
      : "Giờ bắt đầu không hợp lệ (HH:mm)";

    // Validate shiftEndTime (HH:mm format)
    newErrors.shiftEndTime = shiftEndTime && /^([0-1]\d|2[0-3]):[0-5]\d$/.test(shiftEndTime)
      ? ""
      : "Giờ kết thúc không hợp lệ (HH:mm)";

    // Validate end time is after start time
    if (shiftStartTime && shiftEndTime && !newErrors.shiftStartTime && !newErrors.shiftEndTime) {
      const start = new Date(`2000-01-01T${shiftStartTime}:00`);
      const end = new Date(`2000-01-01T${shiftEndTime}:00`);
      newErrors.shiftEndTime = end > start ? "" : "Giờ kết thúc phải sau giờ bắt đầu";
    }

    newErrors.daysOfWeek = daysOfWeek.size > 0 ? "" : "Chọn ít nhất một ngày";
    newErrors.month = month && parseInt(month) >= 1 && parseInt(month) <= 12 ? "" : "Tháng không hợp lệ";
    newErrors.year = year && parseInt(year) >= new Date().getFullYear() ? "" : "Năm không hợp lệ";
    newErrors.shiftSalary = shiftSalary && parseFloat(shiftSalary) > 0 ? "" : "Lương ca phải lớn hơn 0";
    newErrors.employeeId = employeeId ? "" : "Chọn một nhân viên";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        setIsSubmitting(true);

        // Gửi request cho từng ngày được chọn
        for (const day of Array.from(daysOfWeek)) {
          const payload: CreateShiftDto = {
            shiftStartTime: `${shiftStartTime}:00`, // Thêm giây
            shiftEndTime: `${shiftEndTime}:00`, // Thêm giây
            dayOfWeek: day,
            month: parseInt(month),
            year: parseInt(year),
            shiftSalary: parseFloat(shiftSalary),
            employeeId,
          };
          await ShiftServices.createShift(payload);
        }

        toast.success("Tạo ca làm việc thành công!");
        handleClose();
        if (onCreated) {
          onCreated();
        }
      } catch (error: any) {
        toast.error("Tạo ca làm việc thất bại. Vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setShiftStartTime("");
    setShiftEndTime("");
    setDaysOfWeek(new Set());
    setMonth("");
    setYear("");
    setShiftSalary("");
    setEmployeeId("");
    setErrors({
      shiftStartTime: "",
      shiftEndTime: "",
      daysOfWeek: "",
      month: "",
      year: "",
      shiftSalary: "",
      employeeId: "",
    });
    onClose();
  };

  const renderError = (field: keyof typeof errors) =>
    errors[field] && (
      <span className="absolute bottom-[-20px] left-2 h-4 min-w-max text-sm text-error-600">
        {errors[field]}
      </span>
    );

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      radius="lg"
      onOpenChange={onOpenChange}
      onClose={handleClose}
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
            <div className="text-lg font-semibold">Thêm ca làm việc</div>
            <div className="text-wrap text-sm font-normal">
              Nhập thông tin để tạo ca làm việc cho nhân viên
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6">
            {/* Employee Selection */}
            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span id="employee-label" className="text-sm font-medium text-black">
                  Nhân viên<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Select
                  className="w-full rounded-lg border-2"
                  placeholder="Chọn nhân viên"
                  selectedKeys={employeeId ? [employeeId] : []}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  aria-labelledby="employee-label"
                  popoverProps={{
                    className: "bg-bg-white border-2 border-outline-var rounded-lg shadow-lg",
                  }}
                >
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} textValue={employee.userFullName}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={employee.userAvatarUrl || "/default-avatar.png"}
                          alt={employee.userFullName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <span>{employee.userFullName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
                {renderError("employeeId")}
              </div>
            </div>

            {/* Start Time */}
            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span id="startTime-label" className="text-sm font-medium text-black">
                  Giờ bắt đầu<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="time"
                  className="w-full rounded-lg border-2"
                  value={shiftStartTime}
                  onChange={(e) => setShiftStartTime(e.target.value)}
                  aria-labelledby="startTime-label"
                />
                {renderError("shiftStartTime")}
              </div>
            </div>

            {/* End Time */}
            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span id="endTime-label" className="text-sm font-medium text-black">
                  Giờ kết thúc<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="time"
                  className="w-full rounded-lg border-2"
                  value={shiftEndTime}
                  onChange={(e) => setShiftEndTime(e.target.value)}
                  aria-labelledby="endTime-label"
                />
                {renderError("shiftEndTime")}
              </div>
            </div>

            {/* Days of Week */}
            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span id="daysOfWeek-label" className="text-sm font-medium text-black">
                  Ngày trong tuần<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Select
                  selectionMode="multiple"
                  className="w-full rounded-lg border-2"
                  placeholder="Chọn ngày"
                  selectedKeys={daysOfWeek}
                  onSelectionChange={(keys) => setDaysOfWeek(new Set(keys as Iterable<string>))}
                  aria-labelledby="daysOfWeek-label"
                  popoverProps={{
                    className: "bg-bg-white border-2 border-outline-var rounded-lg shadow-lg",
                  }}
                >
                  {dayOptions.map((day) => (
                    <SelectItem key={day.key} textValue={day.label}>
                      {day.label}
                    </SelectItem>
                  ))}
                </Select>
                {renderError("daysOfWeek")}
              </div>
            </div>

            {/* Month */}
            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span id="month-label" className="text-sm font-medium text-black">
                  Tháng<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Select
                  className="w-full rounded-lg border-2"
                  placeholder="Chọn tháng"
                  selectedKeys={month ? [month] : []}
                  onChange={(e) => setMonth(e.target.value)}
                  aria-labelledby="month-label"
                  popoverProps={{
                    className: "bg-bg-white border-2 border-outline-var rounded-lg shadow-lg",
                  }}
                >
                  {monthOptions.map((m) => (
                    <SelectItem key={m.key} textValue={m.label}>
                      {m.label}
                    </SelectItem>
                  ))}
                </Select>
                {renderError("month")}
              </div>
            </div>

            {/* Year */}
            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span id="year-label" className="text-sm font-medium text-black">
                  Năm<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Select
                  className="w-full rounded-lg border-2"
                  placeholder="Chọn năm"
                  selectedKeys={year ? [year] : []}
                  onChange={(e) => setYear(e.target.value)}
                  aria-labelledby="year-label"
                  popoverProps={{
                    className: "bg-bg-white border-2 border-outline-var rounded-lg shadow-lg",
                  }}
                >
                  {yearOptions.map((y) => (
                    <SelectItem key={y.key} textValue={y.label}>
                      {y.label}
                    </SelectItem>
                  ))}
                </Select>
                {renderError("year")}
              </div>
            </div>

            {/* Shift Salary */}
            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span id="shiftSalary-label" className="text-sm font-medium text-black">
                  Lương ca<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="number"
                  className="w-full rounded-lg border-2"
                  placeholder="Nhập lương ca"
                  value={shiftSalary}
                  onChange={(e) => setShiftSalary(e.target.value)}
                  endContent={<span className="text-sm text-gray-500">VNĐ</span>}
                  aria-labelledby="shiftSalary-label"
                />
                {renderError("shiftSalary")}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full flex-row justify-between space-x-6">
            <Button
              onPress={handleClose}
              className="w-1/2 rounded-lg border border-outline bg-white py-2 text-[16px] font-medium text-black hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              className="w-1/2 rounded-lg border border-outline bg-primary-600 text-base-semibold text-secondary-100 hover:bg-primary-700"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo ca làm việc"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddShiftModal;