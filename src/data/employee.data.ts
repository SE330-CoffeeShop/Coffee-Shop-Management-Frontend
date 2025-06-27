export const columns = [
  { name: "STT", uid: "index", sortable: false },
  { name: "Họ và tên", uid: "userFullName", sortable: true },
  { name: "Giới tính", uid: "userGender", sortable: true },
  { name: "Email", uid: "userEmail", sortable: true },
  { name: "Ngày sinh", uid: "userDoB", sortable: true },
  { name: "Vai trò", uid: "userRole", sortable: true },
  { name: "Ngày tuyển", uid: "employeeHireDate", sortable: true },
  { name: "Hành động", uid: "actions", sortable: false },
];

export const statusAdminOptions = [
  { name: "Quản lý", uid: "QUẢN LÝ" },
  { name: "Nhân viên", uid: "NHÂN VIÊN" },
];