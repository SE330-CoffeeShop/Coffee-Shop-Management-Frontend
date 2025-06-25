export const salaryColumns = [
  { uid: "index", name: "STT", sortable: false },
  { uid: "employeeId", name: "ID Nhân viên", sortable: true },
  { uid: "employeeName", name: "Tên nhân viên", sortable: true },
  { uid: "role", name: "Vị trí", sortable: true },
  { uid: "monthSalary", name: "Tổng lương", sortable: true },
  { uid: "updatedAt", name: "Thời gian tính lương", sortable: true },
  { uid: "actions", name: "Thao tác", sortable: false },
];

export const shiftDetailColumns = [
  { uid: "index", name: "STT", sortable: false },
  { uid: "shiftId", name: "ID Ca", sortable: true },
  { uid: "daysOfWeek", name: "Ngày trong tuần", sortable: true },
  { uid: "startTime", name: "Thời gian bắt đầu", sortable: true },
  { uid: "endTime", name: "Thời gian kết thúc", sortable: true },
  { uid: "shiftSalary", name: "Lương ca", sortable: true },
  { uid: "totalShiftCheckins", name: "Số lần chấm công", sortable: true },
  { uid: "totalShiftSalary", name: "Tổng lương ca", sortable: true },
];

export const mappingDayOfWeek = { 
  SUNDAY: "Chủ nhật",
  MONDAY: "Thứ hai",
  TUESDAY: "Thứ ba",
  WEDNESDAY: "Thứ tư",
  THURSDAY: "Thứ năm",
  FRIDAY: "Thứ sáu",
  SATURDAY: "Thứ bảy",
};
