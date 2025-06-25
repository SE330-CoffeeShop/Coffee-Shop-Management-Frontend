export interface SalaryDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  employeeId: string;
  employeeName: string;
  role: string;
  month: number;
  year: number;
  monthSalary: number;
}

export interface SalaryResponse {
  statusCode: number;
  message: string;
  data: SalaryDto[];
  paging: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ShiftDetail {
  shiftId: string;
  startTime: string;
  endTime: string;
  shiftSalary: number;
  daysOfWeek: string;
  totalShiftCheckins: number;
  totalShiftSalary: number;
}

export interface SalaryDetailResponse {
  statusCode: number;
  message: string;
  data: {
    salaryId: string;
    employeeId: string;
    employeeName: string;
    monthAndYear: string;
    role: string;
    totalCheckins: number;
    totalSubCheckins: number;
    totalSalary: number;
    shiftDetails: ShiftDetail[];
    subShiftDetails: ShiftDetail[];
  };
}