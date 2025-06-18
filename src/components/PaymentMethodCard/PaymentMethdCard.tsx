"use client";

import Image from "next/image";
import { PaymentMethodDto } from "@/types/payment-method.type";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodDto;
  isSelected: boolean;
  onSelect: (paymentMethodId: string) => void;
}

const PaymentMethodCard = ({
  paymentMethod,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) => {
  // Fallback image based on payment method name
  const getImageSrc = () => {
    const name = paymentMethod.paymentMethodName.toLowerCase();
    console.log("name", name);
    if (name.includes("zalo pay")) return "/images/payment/zalo-pay.svg";
    if (name.includes("momo")) return "/images/payment/momo.svg";
    if (name.includes("paypal")) return "/images/payment/paypal.svg";
    if (name.includes("vn pay")) return "/images/payment/vnpay.svg";
    return "/images/payment/cash.svg";
  };

  const handleSelect = () => {
    if (paymentMethod.active) {
      onSelect(paymentMethod.paymentMethodId);
    }
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border ${
        isSelected && paymentMethod.active
          ? "border-primary-500"
          : "border-gray-200"
      } transition-all duration-200 ${
        paymentMethod.active
          ? "hover:shadow-md cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }`}
      {...(paymentMethod.active ? { onClick: handleSelect } : {})}
    >
      {/* Image */}
      <div className="flex-shrink-0">
        <Image
          src={getImageSrc()}
          alt={paymentMethod.paymentMethodName}
          width={48}
          height={48}
          className="rounded-md object-contain"
        />
      </div>
      {/* Name */}
      <div className="flex-grow">
        <span className="text-sm font-semibold text-secondary-900">
          {paymentMethod.paymentMethodName}
        </span>
      </div>
      {/* Radio Button */}
      <div className="flex-shrink-0">
        <input
          type="radio"
          name="paymentMethod"
          checked={isSelected && paymentMethod.active}
          onChange={handleSelect}
          disabled={!paymentMethod.active}
          className="form-radio h-5 w-5 text-primary-500 focus:ring-primary-500"
        />
      </div>
    </div>
  );
};

export default PaymentMethodCard;
