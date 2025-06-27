export interface EmployeeDto {
  id: string;
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
  name: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
  employeePosition?: string;
  employeeDepartment?: string;
}

export interface ManagerDto {
  id: string;
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
  managedBranchId: string;
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

export type UpdateEmployeeDto = {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
};
