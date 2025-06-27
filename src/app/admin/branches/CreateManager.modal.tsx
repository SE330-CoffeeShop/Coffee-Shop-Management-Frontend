"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { toast } from "react-toastify";
import { EmployeeCreateDto } from "@/types/employee.type";
import EmployeeAdminServices from "@/services/admin.services/EmployeeServices";
import BranchAdminServices from "@/services/admin.services/BranchServices";
import { BranchType, UpdateBranchDto } from "@/types/branch.type";

interface CreateManagerModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  branch: BranchType;
  onCreated: () => void;
}

const CreateManagerModal = ({
  isOpen,
  onOpenChange,
  onClose,
  branch,
  onCreated,
}: CreateManagerModalProps) => {
  const [formData, setFormData] = useState<EmployeeCreateDto>({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    birthDate: string;
  }>({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
  });

  const validateInputs = () => {
    const newErrors = { ...errors };

    newErrors.email = formData.email.trim() ? "" : "Email là bắt buộc";
    newErrors.password = formData.password.trim() ? "" : "Mật khẩu là bắt buộc";
    newErrors.passwordConfirm = formData.passwordConfirm.trim()
      ? formData.password === formData.passwordConfirm
        ? ""
        : "Mật khẩu và xác nhận mật khẩu không khớp"
      : "Xác nhận mật khẩu là bắt buộc";
    newErrors.name = formData.name.trim() ? "" : "Tên là bắt buộc";
    newErrors.lastName = formData.lastName.trim() ? "" : "Họ là bắt buộc";
    newErrors.phoneNumber = formData.phoneNumber.trim()
      ? /^\d{10,11}$/.test(formData.phoneNumber)
        ? ""
        : "Số điện thoại không hợp lệ"
      : "Số điện thoại là bắt buộc";
    newErrors.gender = formData.gender ? "" : "Giới tính là bắt buộc";
    newErrors.birthDate = formData.birthDate
      ? new Date(formData.birthDate) <= new Date()
        ? ""
        : "Ngày sinh không thể là tương lai"
      : "Ngày sinh là bắt buộc";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        setIsSubmitting(true);
        const payload: EmployeeCreateDto = {
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          name: formData.name,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          birthDate: new Date(formData.birthDate).toISOString(),
        };

        // Gọi API tạo quản lý và kiểm tra phản hồi
        const responseManager = await EmployeeAdminServices.createManagerBranch(
          branch.id,
          payload
        );

        toast.success("Tạo và gán quản lý thành công!");
        onCreated();
        handleClose();
      } catch (error: any) {
        console.error("Lỗi trong handleSubmit:", error.message);
        toast.error(
          error.message || "Tạo hoặc gán quản lý thất bại. Vui lòng thử lại."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      lastName: "",
      phoneNumber: "",
      gender: "",
      birthDate: "",
    });
    setErrors({
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      lastName: "",
      phoneNumber: "",
      gender: "",
      birthDate: "",
    });
    setIsSubmitting(false);
    onClose();
  };

  const renderError = (field: keyof typeof errors) =>
    errors[field] && (
      <span className="absolute bottom-[-20px] left-2 h-4 min-w-max text-sm text-error-600">
        {errors[field]}
      </span>
    );

  return (
    <Modal
      size="2xl"
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
          <div className="border-b--b-primary h-11 w-11 content-center rounded-lg border-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx-auto size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="ml-5">
            <div className="text-lg font-semibold">
              Tạo quản lý cho chi nhánh
            </div>
            <div className="text-wrap text-sm font-normal">
              Tạo và quản lý tài khoản quản lý cho chi nhánh
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-7">
            <div className="flex flex-row">
              <div className="basis-[30%]">
                <span
                  id="email-label"
                  className="text-sm font-medium text-black"
                >
                  Email<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2"
                  placeholder="Nhập email"
                  aria-labelledby="email-label"
                />
                {renderError("email")}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-[30%]">
                <span
                  id="password-label"
                  className="text-sm font-medium text-black"
                >
                  Mật khẩu<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2"
                  placeholder="Nhập mật khẩu"
                  aria-labelledby="password-label"
                />
                {renderError("password")}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-[30%]">
                <span
                  id="password-confirm-label"
                  className="text-sm font-medium text-black"
                >
                  Xác nhận mật khẩu<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2"
                  placeholder="Xác nhận mật khẩu"
                  aria-labelledby="password-confirm-label"
                />
                {renderError("passwordConfirm")}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-[30%]">
                <span
                  id="name-label"
                  className="text-sm font-medium text-black"
                >
                  Tên<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2"
                  placeholder="Nhập tên"
                  aria-labelledby="name-label"
                />
                {renderError("name")}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-[30%]">
                <span
                  id="last-name-label"
                  className="text-sm font-medium text-black"
                >
                  Họ<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2"
                  placeholder="Nhập họ"
                  aria-labelledby="last-name-label"
                />
                {renderError("lastName")}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-[30%]">
                <span
                  id="phone-number-label"
                  className="text-sm font-medium text-black"
                >
                  Số điện thoại<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2"
                  placeholder="Nhập số điện thoại"
                  aria-labelledby="phone-number-label"
                />
                {renderError("phoneNumber")}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-[30%]">
                <span
                  id="gender-label"
                  className="text-sm font-medium text-black"
                >
                  Giới tính<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2"
                  placeholder="Chọn giới tính"
                  aria-labelledby="gender-label"
                  popoverProps={{
                    classNames: {
                      content:
                        "bg-white border border-gray-300 shadow-lg rounded-lg border-2",
                    },
                  }}
                >
                  <SelectItem key="Nam">Nam</SelectItem>
                  <SelectItem key="Nữ">Nữ</SelectItem>
                </Select>
                {renderError("gender")}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-[30%]">
                <span
                  id="birth-date-label"
                  className="text-sm font-medium text-black"
                >
                  Ngày sinh<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2"
                  aria-labelledby="birth-date-label"
                />
                {renderError("birthDate")}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full flex-row justify-between space-x-6">
            <Button
              onPress={handleClose}
              className="w-1/2 rounded-lg border border-outline bg-white py-2 text-base-regular text-secondary-900 hover:bg-secondary-300"
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              className="w-1/2 rounded-lg bg-primary-500 py-2 text-base-semibold text-secondary-100 hover:bg-primary-400"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo quản lý"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateManagerModal;
