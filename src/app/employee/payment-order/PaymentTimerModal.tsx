import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import ButtonSolid from "@/components/Button/ButtonSolid";

interface PaymentTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancelOrder: () => void;
  onChangePaymentMethod: () => void;
  timeLeft: number;
  isCashPayment: boolean;
  onConfirmCash?: () => void;
}

const PaymentTimerModal = ({
  isOpen,
  onClose,
  onCancelOrder,
  onChangePaymentMethod,
  timeLeft,
  isCashPayment,
  onConfirmCash,
}: PaymentTimerModalProps) => {
  const [seconds, setSeconds] = useState(timeLeft);

  useEffect(() => {
    if (isOpen) {
      setSeconds(timeLeft); // Reset timer when modal opens
      const timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, onClose, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
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
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>Đang chờ thanh toán</ModalHeader>
        <ModalBody>
          <p className="text-lg text-center">
            Thời gian còn lại: {formatTime(seconds)}
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            Đơn hàng sẽ tự động hủy sau {formatTime(seconds)}.
          </p>
        </ModalBody>
        <ModalFooter>
          <ButtonSolid
            content="Chọn phương thức khác"
            onClick={onChangePaymentMethod}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          />
          <ButtonSolid
            content="Hủy đơn hàng"
            onClick={onCancelOrder}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          />
          {isCashPayment && (
            <ButtonSolid
              content="Đã thu tiền"
              onClick={onConfirmCash}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentTimerModal;