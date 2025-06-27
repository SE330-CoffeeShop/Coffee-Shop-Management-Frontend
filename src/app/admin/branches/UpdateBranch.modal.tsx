"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from "@heroui/react";
import { toast } from "react-toastify";
import { BranchType } from "@/types/branch.type";
import BranchAdminServices from "@/services/admin.services/BranchServices";
import { UpdateBranchDto } from "@/types/branch.type";

interface UpdateBranchModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  branch: BranchType;
  onUpdated: () => void;
}

const UpdateBranchModal = ({ isOpen, onOpenChange, onClose, branch, onUpdated }: UpdateBranchModalProps) => {
  const [formData, setFormData] = useState({
    branchName: branch.branchName,
    branchAddress: branch.branchAddress,
    branchPhone: branch.branchPhone,
    branchEmail: branch.branchEmail,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const updateDto: UpdateBranchDto = {
        branchId: branch.id,
        branchName: formData.branchName,
        branchAddress: formData.branchAddress,
        branchPhone: formData.branchPhone,
        branchEmail: formData.branchEmail,
      };
      await BranchAdminServices.updateBranch(updateDto);
      toast.success("Cập nhật chi nhánh thành công!");
      onUpdated();
      onClose();
    } catch (error) {
      toast.error("Cập nhật chi nhánh thất bại. Vui lòng thử lại.");
    }
  };

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
        <ModalHeader>CẬP NHẬT CHI NHÁNH</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-4">
              <span className="basis-[30%] text-sm font-medium text-black">TÊN CHI NHÁNH</span>
              <div className="basis-[70%]">
                <Input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-400 shadow-sm"
                  placeholder="Nhập tên chi nhánh"
                  aria-label="Tên chi nhánh"
                />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <span className="basis-[30%] text-sm font-medium text-black">ĐỊA CHỈ</span>
              <div className="basis-[70%]">
                <Input
                  type="text"
                  name="branchAddress"
                  value={formData.branchAddress}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-400 shadow-sm"
                  placeholder="Nhập địa chỉ"
                  aria-label="Địa chỉ"
                />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <span className="basis-[30%] text-sm font-medium text-black">SỐ ĐIỆN THOẠI</span>
              <div className="basis-[70%]">
                <Input
                  type="text"
                  name="branchPhone"
                  value={formData.branchPhone}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-400 shadow-sm"
                  placeholder="Nhập số điện thoại"
                  aria-label="Số điện thoại"
                />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <span className="basis-[30%] text-sm font-medium text-black">EMAIL</span>
              <div className="basis-[70%]">
                <Input
                  type="email"
                  name="branchEmail"
                  value={formData.branchEmail}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-400 shadow-sm"
                  placeholder="Nhập email"
                  aria-label="Email"
                />
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
          >
            Cập nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateBranchModal;