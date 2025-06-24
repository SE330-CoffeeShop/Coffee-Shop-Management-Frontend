export type CreateShiftDto = {
  shiftStartTime: string;
  shiftEndTime: string;
  dayOfWeek: string;
  month: number;
  year: number;
  shiftSalary: number;
  employeeId: string;
}

export type ShiftDto = {
  id: string;
  shiftStartTime: string;
  shiftEndTime: string;
  dayOfWeek: string;
  month: number;
  year: number;
  shiftSalary: number;
  employeeId: string;
  employeeFullName: string;
  employeeAvatarUrl: string;
  checkin: boolean;
}