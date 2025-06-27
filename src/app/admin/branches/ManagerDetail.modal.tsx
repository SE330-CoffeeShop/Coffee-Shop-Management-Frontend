"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { EmployeeDto } from "@/types/employee.type";
import EmployeeAdminServices from "@/services/admin.services/EmployeeServices";
import BranchAdminServices from "@/services/admin.services/BranchServices";
import { ButtonSolid } from "@/components";

interface ManagerDetailModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  managerId: string;
  branchId: string;
  onDeleted: () => void;
}

const ManagerDetailModal = ({
  isOpen,
  onOpenChange,
  onClose,
  managerId,
  branchId,
  onDeleted,
}: ManagerDetailModalProps) => {
  const [updatedManager, setUpdatedManager] = useState<
    (EmployeeDto & { name?: string; lastName?: string }) | null
  >(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { data: managerResponse, error: managerError } = useSWR(
    isOpen ? `/employee/${managerId}` : null,
    () => EmployeeAdminServices.getDetailEmployee(managerId)
  );

  useEffect(() => {
    if (managerError) toast.error("Lỗi khi tải thông tin quản lý.");
    if (managerResponse?.data) {
      const fullNameParts = managerResponse.data.userFullName.split(" ");
      const lastName = fullNameParts.pop() || "";
      const name = fullNameParts.join(" ");
      setUpdatedManager({
        ...managerResponse.data,
        name,
        lastName,
      });
    }
  }, [managerResponse, managerError]);

  const handleDelete = async () => {
    try {
      await EmployeeAdminServices.deleteManagerBranchById(managerId);
      await BranchAdminServices.updateBranch({
        branchId,
        managerId: undefined,
      });
      toast.success("Xóa quản lý thành công!");
      onDeleted();
      onClose();
    } catch (error) {
      toast.error("Xóa quản lý thất bại. Vui lòng thử lại.");
    }
  };

  if (!updatedManager) return null;

  return (
    <>
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
          <ModalHeader>CHI TIẾT QUẢN LÝ</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm font-medium text-black">
                  EMAIL
                </span>
                <div className="basis-[70%]">
                  <div className="border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                    {updatedManager.userEmail}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm font-medium text-black">
                  TÊN
                </span>
                <div className="basis-[70%]">
                  <div className="border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                    {updatedManager.name}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm font-medium text-black">
                  HỌ
                </span>
                <div className="basis-[70%]">
                  <div className="border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                    {updatedManager.lastName}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm font-medium text-black">
                  SỐ ĐIỆN THOẠI
                </span>
                <div className="basis-[70%]">
                  <div className="border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                    {updatedManager.userPhone}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm font-medium text-black">
                  GIỚI TÍNH
                </span>
                <div className="basis-[70%]">
                  <div className="border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                    {updatedManager.userGender}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm font-medium text-black">
                  NGÀY SINH
                </span>
                <div className="basis-[70%]">
                  <div className="border-2 border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                    {new Date(updatedManager.userDoB).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex w-full flex-row justify-between space-x-6">
              <Button
                onClick={onClose}
                className="w-1/2 rounded-lg border-2 border-gray-400 bg-white py-2 text-[16px] font-medium text-black hover:bg-gray-100"
              >
                Đóng
              </Button>
              <ButtonSolid
                onClick={() => setShowDeleteConfirmation(true)}
                content="Xóa quản lý"
                className="w-1/2 rounded-lg bg-error-500 text-base-semibold text-secondary-100 hover:bg-error-700"
              />
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        size="sm"
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
          <ModalHeader>XÁC NHẬN XÓA</ModalHeader>
          <ModalBody>
            <p>
              Bạn có chắc chắn muốn xóa quản lý này không? Hành động này không
              thể hoàn tác.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setShowDeleteConfirmation(false)}
              className="w-1/2 rounded-lg bg-white py-2 text-[16px] font-medium text-black hover:bg-gray-100"
            >
              Hủy
            </Button>
            <ButtonSolid
              onClick={handleDelete}
              content="Xóa quản lý"
              className="w-1/2 rounded-lg bg-error-500 text-base-semibold text-secondary-100 hover:bg-error-700"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManagerDetailModal;