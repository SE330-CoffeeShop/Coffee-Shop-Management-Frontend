export type EmployeeDto = {
  id: string;
  employeePosition?: string;
  employeeDepartment?: string;
  employeeHireDate: string;
  branchId?: string;
  branchName: string;
  userId: string;
  userFullName: string;
  userAvatarUrl?: string;
  userDoB: string;
  userPhone: string;
  userGender: string;
  userEmail: string;
  userRole: string;
}

export type EmployeeCreateDto = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
};