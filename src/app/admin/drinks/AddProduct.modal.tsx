"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter } from "@heroui/react";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const AddProductModal = ({
  isOpen,
  onOpenChange,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  onCreated?: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onCreated?.();
      handleClose();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClose = () => {
    onClose();
  };

  const size = "2xl";

  return (
    <Modal
      size={size}
      isOpen={isOpen}
      radius="lg"
      onOpenChange={onOpenChange}
      onClose={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
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
        <ModalHeader className="w-full rounded-t-xl border">
          <div className="h-11 w-11 content-center rounded-lg border-3">
            <BeakerIcon className="h-8 w-8 text-secondary-900"/>
          </div>
          <div className="ml-5">
            <div className="text-lg font-semibold">Thêm sản phẩm mới</div>
            <div className="text-wrap text-sm font-normal">
              Tạo và quản lý sản phẩm dễ dàng
            </div>
          </div>
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <div className="flex w-full flex-row justify-between space-x-6">
            <Button
              onPress={handleClose}
              className="w-1/2 rounded-lg border border-outline bg-white py-2 text-[16px] font-medium text-secondary-900 hover:bg-highlight"
            >
              Hủy
            </Button>
            <Button
              onPress={() => {}}
              className="w-1/2 rounded-lg border border-outline bg-primary-500 py-2 text-base-regular text-secondary-900"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;
