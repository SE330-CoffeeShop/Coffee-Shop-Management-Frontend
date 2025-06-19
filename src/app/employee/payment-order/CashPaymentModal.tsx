import { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import ButtonSolid from "@/components/Button/ButtonSolid";
import { useRouter } from "next/navigation";

interface CashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

const CashPaymentModal = ({ isOpen, onClose, totalAmount }: CashPaymentModalProps) => {

  console.log("CashPaymentModal rendered with totalAmount:", totalAmount);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
        router.push("/employee/drinks");
      }, 5000); // Auto-close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, router]);

  const handleReturn = () => {
    onClose();
    router.push("/employee/drinks");
  };

  const size = "2xl";

  return (
    <Modal
      size={size}
      radius="lg"
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
      isOpen={isOpen}
      onClose={handleReturn}
    >
      <ModalContent>
        <ModalHeader>Thanh toán tiền mặt</ModalHeader>
        <ModalBody>
          <p className="text-lg text-center">
            Đã thu tiền của đơn hàng: {totalAmount.toLocaleString("vi-VN")} VNĐ
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            Bạn sẽ được chuyển về trang đồ uống trong 5 giây...
          </p>
        </ModalBody>
        <ModalFooter>
          <ButtonSolid
            content="Trở về"
            onClick={handleReturn}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CashPaymentModal;