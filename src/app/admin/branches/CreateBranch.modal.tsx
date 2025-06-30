"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";
import { toast } from "react-toastify";
import { CreateBranchDto } from "@/types/branch.type";
import BranchAdminServices from "@/services/admin.services/BranchServices";

interface CreateBranchModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  onCreated: () => void;
}

const CreateBranchModal = ({
  isOpen,
  onOpenChange,
  onClose,
  onCreated,
}: CreateBranchModalProps) => {
  const [formData, setFormData] = useState<CreateBranchDto>({
    branchName: "",
    branchAddress: "",
    branchPhone: "",
    branchEmail: "",
  });

  const [errors, setErrors] = useState<{
    branchName: string;
    branchAddress: string;
    branchPhone: string;
    branchEmail: string;
  }>({
    branchName: "",
    branchAddress: "",
    branchPhone: "",
    branchEmail: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateInputs = () => {
    const newErrors = { ...errors };

    newErrors.branchName = formData.branchName.trim()
      ? ""
      : "Tên chi nhánh là bắt buộc";
    newErrors.branchAddress = formData.branchAddress.trim()
      ? ""
      : "Địa chỉ là bắt buộc";
    newErrors.branchPhone = formData.branchPhone.trim()
      ? /^\d{10}$/.test(formData.branchPhone)
        ? ""
        : "Số điện thoại phải có đúng 10 chữ số"
      : "Số điện thoại là bắt buộc";
    newErrors.branchEmail = formData.branchEmail.trim()
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.branchEmail)
        ? ""
        : "Email không hợp lệ"
      : "Email là bắt buộc";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        setIsSubmitting(true);
        await BranchAdminServices.createBranch(formData);
        toast.success("Tạo chi nhánh thành công!");
        onCreated();
        onClose();
      } catch (error) {
        toast.error("Tạo chi nhánh thất bại. Vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderError = (field: keyof typeof errors) =>
    errors[field] && (
      <span className="absolute bottom-[-20px] left-2 h-4 min-w-max text-sm text-error-600">
        {errors[field]}
      </span>
    );

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
        <ModalHeader>TẠO CHI NHÁNH MỚI</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-4">
              <span className="basis-[30%] text-sm font-medium text-black">
                TÊN CHI NHÁNH
              </span>
              <div className="relative basis-[70%]">
                <Input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-400 shadow-sm"
                  placeholder="Nhập tên chi nhánh"
                  aria-label="Tên chi nhánh"
                />
                {renderError("branchName")}
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <span className="basis-[30%] text-sm font-medium text-black">
                ĐỊA CHỈ
              </span>
              <div className="relative basis-[70%]">
                <Input
                  type="text"
                  name="branchAddress"
                  value={formData.branchAddress}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-400 shadow-sm"
                  placeholder="Nhập địa chỉ"
                  aria-label="Địa chỉ"
                />
                {renderError("branchAddress")}
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <span className="basis-[30%] text-sm font-medium text-black">
                SỐ ĐIỆN THOẠI
              </span>
              <div className="relative basis-[70%]">
                <Input
                  type="text"
                  name="branchPhone"
                  value={formData.branchPhone}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-400 shadow-sm"
                  placeholder="Nhập số điện thoại"
                  aria-label="Số điện thoại"
                />
                {renderError("branchPhone")}
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <span className="basis-[30%] text-sm font-medium text-black">
                EMAIL
              </span>
              <div className="relative basis-[70%]">
                <Input
                  type="email"
                  name="branchEmail"
                  value={formData.branchEmail}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-400 shadow-sm"
                  placeholder="Nhập email"
                  aria-label="Email"
                />
                {renderError("branchEmail")}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            className="w-1/2 rounded-lg border-2 border-gray-400 bg-white py-2 text-[16px] font-medium text-black hover:bg-gray-100"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-1/2 rounded-lg border-2 border-gray-400 bg-primary-500 text-primary-0 hover:bg-primary-600"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateBranchModal;