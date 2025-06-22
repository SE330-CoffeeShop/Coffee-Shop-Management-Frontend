export type CreateShiftDto = {
  shiftStartTime: string;
  shiftEndTime: string;
  dayOfWeek: string;
  month: number;
  year: number;
  shiftSalary: number;
  employeeId: string;
}