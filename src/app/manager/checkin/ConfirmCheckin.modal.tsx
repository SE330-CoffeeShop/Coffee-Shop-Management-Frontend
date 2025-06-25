"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface ConfirmCheckinProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmCheckin: React.FC<ConfirmCheckinProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="bg-white rounded-2xl shadow-lg">
      <ModalContent>
        <ModalHeader className="text-lg font-bold text-gray-900">
          Xác nhận chấm công
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn chấm công cho ca làm việc này?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Hủy
          </Button>
          <Button color="success" onClick={onConfirm}>
            Xác nhận
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmCheckin;