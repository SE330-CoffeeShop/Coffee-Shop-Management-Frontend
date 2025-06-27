"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { BranchType } from "@/types/branch.type";
import EmployeeAdminServices from "@/services/admin.services/EmployeeServices";
import { EmployeeDto } from "@/types/employee.type";

interface BranchDetailModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  branch: BranchType;
}

const BranchDetailModal = ({
  isOpen,
  onOpenChange,
  onClose,
  branch,
}: BranchDetailModalProps) => {
  const [isViewingManager, setIsViewingManager] = useState(false);

  const hasManager = branch.managerId;
  console.log("branch", branch);

  const { data: managerResponse, error: managerError } = useSWR(
    isViewingManager && hasManager ? `/employee/${branch.managerId}` : null,
    () => EmployeeAdminServices.getDetailEmployee(branch.managerId)
  );

  useEffect(() => {
    if (managerError) toast.error("Lỗi khi tải thông tin quản lý.");
  }, [managerError]);

  const managerData: EmployeeDto | undefined = managerResponse?.data;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      size="2xl"
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
        <ModalHeader>
          {isViewingManager ? "THÔNG TIN QUẢN LÝ" : "THÔNG TIN CHI NHÁNH"}
        </ModalHeader>
        <ModalBody>
          {isViewingManager ? (
            hasManager ? (
              managerData ? (
                <div className="space-y-4">
                  <div className="flex flex-row gap-4">
                    <span className="basis-[30%] text-sm-semibold text-black">
                      TÊN
                    </span>
                    <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {managerData.userFullName}
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <span className="basis-[30%] text-sm-semibold text-black">
                      AVATAR
                    </span>
                    <div className="basis-[70%] rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      <img
                        src={managerData.userAvatarUrl}
                        alt="Avatar"
                        className="w-20 h-20 rounded-md object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <span className="basis-[30%] text-sm-semibold text-black">
                      NGÀY SINH
                    </span>
                    <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {new Date(managerData.userDoB).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <span className="basis-[30%] text-sm-semibold text-black">
                      SỐ ĐIỆN THOẠI
                    </span>
                    <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {managerData.userPhone}
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <span className="basis-[30%] text-sm-semibold text-black">
                      GIỚI TÍNH
                    </span>
                    <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {managerData.userGender}
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <span className="basis-[30%] text-sm-semibold text-black">
                      EMAIL
                    </span>
                    <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {managerData.userEmail}
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <span className="basis-[30%] text-sm-semibold text-black">
                      VAI TRÒ
                    </span>
                    <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {managerData.userRole}
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <span className="basis-[30%] text-sm-semibold text-black">
                      NGÀY TUYỂN DỤNG
                    </span>
                    <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {new Date(
                        managerData.employeeHireDate
                      ).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              ) : managerError ? (
                <p className="text-red-500">Lỗi khi tải thông tin quản lý.</p>
              ) : (
                <p>Loading manager details...</p>
              )
            ) : (
              <p className="text-gray-500">Chưa có quản lý tiếp nhận.</p>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-black">
                  ID
                </span>
                <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                  {branch.id}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-black">
                  TÊN CHI NHÁNH
                </span>
                <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                  {branch.branchName}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-black">
                  ĐỊA CHỈ
                </span>
                <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                  {branch.branchAddress}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-black">
                  SỐ ĐIỆN THOẠI
                </span>
                <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                  {branch.branchPhone}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-black">
                  EMAIL
                </span>
                <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                  {branch.branchEmail}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-black">
                  QUẢN LÝ
                </span>
                <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                  {branch.managerId ? branch.managerName : "Chưa có quản lý"}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-black">
                  NGÀY THÀNH LẬP
                </span>
                <div className="basis-[70%] border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                  {new Date(branch.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            className="w-1/2 rounded-lg border-2 border-gray-400 bg-white py-2 text-[16px] text-base-regular text-secondary-900 hover:bg-gray-100"
          >
            Đóng
          </Button>

          <Button
            onClick={() => setIsViewingManager(!isViewingManager)}
            className="w-1/2 rounded-lg border-2 border-gray-400 bg-primary-500 text-base-regular text-secondary-100 hover:bg-primary-600"
          >
            {isViewingManager ? "Xem Chi nhánh" : "Xem Quản lý"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BranchDetailModal;
