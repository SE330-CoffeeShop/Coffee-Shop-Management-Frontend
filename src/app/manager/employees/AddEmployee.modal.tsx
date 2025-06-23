"use client";

import {
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import EmployeeServices from "@/services/manager.services/EmployeeServices";
import { EmployeeCreateDto } from "@/types/employee.type";

const AddEmployeeModal = ({
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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const genderOptions = [
    { key: "Nam", label: "Nam" },
    { key: "Nữ", label: "Nữ" },
    { key: "Khác", label: "Khác" },
  ];

  const validateInputs = () => {
    const newErrors = { ...errors };
  
    newErrors.email =
      email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? ""
        : "Email không hợp lệ";
  
    newErrors.password =
      password.trim() &&
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)
        ? ""
        : "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt";
  
    newErrors.passwordConfirm =
      passwordConfirm === password ? "" : "Mật khẩu xác nhận không khớp";
  
    newErrors.name = name.trim() ? "" : "Tên là bắt buộc";
    newErrors.lastName = lastName.trim() ? "" : "Họ là bắt buộc";
  
    newErrors.phoneNumber =
      phoneNumber.trim() && /^\+?\d{10,15}$/.test(phoneNumber)
        ? ""
        : "Số điện thoại không hợp lệ";
  
    newErrors.gender = gender ? "" : "Giới tính là bắt buộc";
    newErrors.birthDate = birthDate ? "" : "Ngày sinh là bắt buộc";
  
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };
  

  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        setIsSubmitting(true);
        const payload: EmployeeCreateDto = {
          email,
          password,
          passwordConfirm,
          name,
          lastName,
          phoneNumber,
          gender,
          birthDate: new Date(birthDate).toISOString(),
        };
        await EmployeeServices.createEmployee(payload);
        toast.success("Tạo nhân viên thành công!");
        handleClose();
        if (onCreated) {
          onCreated();
        }
      } catch (error: any) {
        toast.error("Tạo nhân viên thất bại. Vui lòng thử lại.");
        toast.error(error?.response?.data?.message || "Lỗi không xác định");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setName("");
    setLastName("");
    setPhoneNumber("");
    setGender("");
    setBirthDate("");
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
      size="4xl"
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-5">
            <div className="text-lg font-semibold">Thêm nhân viên mới</div>
            <div className="text-wrap text-sm font-normal">
              Nhập thông tin để tạo nhân viên mới
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6">
            {/* User Information */}
            <div className="flex flex-row gap-4">
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
                  className="w-full rounded-lg border-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-labelledby="email-label"
                />
                {renderError("email")}
              </div>
            </div>

            <div className="flex flex-row gap-4">
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
                  className="w-full rounded-lg border-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-labelledby="password-label"
                />
                {renderError("password")}
              </div>
            </div>

            <div className="flex flex-row gap-4">
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
                  className="w-full rounded-lg border-2"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  aria-labelledby="password-confirm-label"
                />
                {renderError("passwordConfirm")}
              </div>
            </div>

            <div className="flex flex-row gap-4">
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
                  className="w-full rounded-lg border-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-labelledby="name-label"
                />
                {renderError("name")}
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span
                  id="lastName-label"
                  className="text-sm font-medium text-black"
                >
                  Họ<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="text"
                  className="w-full rounded-lg border-2"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  aria-labelledby="lastName-label"
                />
                {renderError("lastName")}
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span
                  id="phoneNumber-label"
                  className="text-sm font-medium text-black"
                >
                  Số điện thoại<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="text"
                  className="w-full rounded-lg border-2"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  aria-labelledby="phoneNumber-label"
                />
                {renderError("phoneNumber")}
              </div>
            </div>

            <div className="flex flex-row gap-4">
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
                  className="w-full rounded-lg border-2 bg-bg-white"
                  placeholder="Chọn giới tính"
                  selectedKeys={gender ? [gender] : []}
                  onChange={(e) => setGender(e.target.value)}
                  aria-labelledby="gender-label"
                  popoverProps={{
                    className:
                      "bg-bg-white border-2 border-outline-var rounded-lg shadow-lg",
                  }}
                >
                  {genderOptions.map((option) => (
                    <SelectItem
                      key={option.key}
                      textValue={option.label}
                      className="bg-bg-white"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                {renderError("gender")}
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="basis-[30%]">
                <span
                  id="birthDate-label"
                  className="text-sm font-medium text-black"
                >
                  Ngày sinh<span className="text-error-600">*</span>
                </span>
              </div>
              <div className="relative basis-[70%]">
                <Input
                  type="date"
                  className="w-full rounded-lg border-2"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  aria-labelledby="birthDate-label"
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
              className="w-1/2 rounded-lg border border-outline bg-white py-2 text-[16px] font-medium text-black hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              className="w-1/2 rounded-lg border border-outline bg-primary-600 text-base-semibold text-secondary-100 hover:bg-primary-700"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo nhân viên"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddEmployeeModal;
