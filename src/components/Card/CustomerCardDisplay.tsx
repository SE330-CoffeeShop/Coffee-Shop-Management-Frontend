"use client";

import { CustomerDto } from "@/types/customer.type";
import { EmployeeDto } from "@/types/employee.type";

const CustomerCardDisplay = (customer: CustomerDto) => {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 m-4 transition-transform hover:scale-105 hover:shadow-xl">
      <div className="flex flex-col items-center gap-6">
        {/* Avatar */}
        {customer.userAvatarUrl ? (
          <img
            src={customer.userAvatarUrl}
            alt={customer.userFullName}
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
            {customer.userFullName}
          </h2>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Ngày sinh:</span>
              <span className="text-secondary-400">
                {new Date(customer.userDoB).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Số điện thoại:</span>
              <span className="text-secondary-400">{customer.userPhone}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Giới tính:</span>
              <span className="text-secondary-400">{customer.userGender}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Email:</span>
              <span className="text-secondary-400">{customer.userEmail}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-secondary-500">Lần cuối mua:</span>
              <span className="text-secondary-400">
                {new Date(customer.lastBuyAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCardDisplay;