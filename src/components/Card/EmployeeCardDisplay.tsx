"use client";

import { EmployeeDto } from "@/types/employee.type";

const EmployeeCardDisplay = (employee: EmployeeDto) => {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 m-4 transition-transform hover:scale-105 hover:shadow-xl">
      <div className="flex flex-col items-center gap-6">
        {/* Avatar */}
        {employee.userAvatarUrl ? (
          <img
            src={employee.userAvatarUrl}
            alt={employee.userFullName}
            className="w-36 h-36 object-cover rounded-full border-4 border-primary-100"
          />
        ) : (
          <div className="w-36 h-36 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center border-4 border-primary-100">
            <span className="text-gray-500 text-lg font-medium">No Avatar</span>
          </div>
        )}

        {/* Employee Information */}
        <div className="w-full space-y-4">
          {/* Full Name */}
          <h2 className="text-xl-semibold text-primary-600 text-center">
            {employee.userFullName}
          </h2>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Ngày sinh:</span>
              <span className="text-secondary-400">
                {new Date(employee.userDoB).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Số điện thoại:</span>
              <span className="text-secondary-400">{employee.userPhone}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Giới tính:</span>
              <span className="text-secondary-400">{employee.userGender}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Email:</span>
              <span className="text-secondary-400">{employee.userEmail}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Vai trò:</span>
              <span className="text-secondary-400">{employee.userRole}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Ngày tuyển:</span>
              <span className="text-secondary-400">
                {new Date(employee.employeeHireDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Chi nhánh:</span>
              <span className="text-secondary-400">{employee.branchName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCardDisplay;