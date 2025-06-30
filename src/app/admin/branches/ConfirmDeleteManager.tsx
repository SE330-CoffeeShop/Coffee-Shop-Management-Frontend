"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { toast } from "react-toastify";
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

const ConfirmDeleteManager = ({
  isOpen,
  onOpenChange,
  onClose,
  managerId,
  branchId,
  onDeleted,
}: ManagerDetailModalProps) => {
  const handleDelete = async () => {
    try {
      await EmployeeAdminServices.deleteManagerBranchById(managerId);
      // await BranchAdminServices.updateBranch({
      //   branchId,
      //   managerId: "",
      // });
      toast.success("Xóa quản lý thành công!");
      onDeleted();
      onClose();
    } catch (error) {
      toast.error("Xóa quản lý thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
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
        <ModalHeader>XÁC NHẬN XÓA QUẢN LÝ</ModalHeader>
        <ModalBody>
          <p>
            Bạn có chắc chắn muốn xóa quản lý này không? Hành động này không thể hoàn tác.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
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
  );
};

export default ConfirmDeleteManager;