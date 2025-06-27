"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { ButtonSolid } from "@/components";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  onConfirm: () => void;
  branchName: string;
}

const DeleteConfirmationModal = ({ isOpen, onOpenChange, onClose, onConfirm, branchName }: DeleteConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
        <ModalHeader>XÁC NHẬN XÓA</ModalHeader>
        <ModalBody>
          <p>Bạn có chắc chắn muốn xóa chi nhánh <strong>{branchName}</strong> không? Hành động này không thể hoàn tác.</p>
        </ModalBody>
        <ModalFooter>
          <ButtonSolid
            content="Hủy"
            onClick={onClose}
            className="w-1/2 rounded-lg border-2 border-gray-400 bg-white py-2 text-[16px] font-medium text-black hover:bg-gray-100"
          />
          <ButtonSolid
            content="Xóa"
            onClick={onConfirm}
            className="w-1/2 rounded-lg border-2 border-gray-400 bg-error-500 text-base-semibold text-secondary-100 hover:bg-error-700"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;