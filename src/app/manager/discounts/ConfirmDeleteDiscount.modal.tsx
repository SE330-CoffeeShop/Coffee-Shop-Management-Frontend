"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  discountName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  discountName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
          <h2 className="text-lg font-bold">Xác nhận xóa khuyến mãi</h2>
        </ModalHeader>
        <ModalBody>
          <p>Bạn có chắc chắn muốn xóa khuyến mãi "{discountName}" không?</p>
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose} variant="light">
            Hủy
          </Button>
          <Button onPress={onConfirm} color="danger">
            Xóa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;
