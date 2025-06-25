"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface ConfirmCancelCheckinProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmCancelCheckin: React.FC<ConfirmCancelCheckinProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="bg-white rounded-2xl shadow-lg">
      <ModalContent>
        <ModalHeader className="text-lg font-bold text-gray-900">
          Xác nhận hủy chấm công
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn hủy chấm công cho ca làm việc này?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onClick={onClose}>
            Hủy
          </Button>
          <Button color="danger" onClick={onConfirm}>
            Xác nhận
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmCancelCheckin;