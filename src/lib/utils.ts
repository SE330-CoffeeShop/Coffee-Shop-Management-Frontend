import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mappingPaymentMethod = (paymentMethodId: string): string => {
  if (!paymentMethodId) return "Không xác định";
  switch (paymentMethodId) {
    case "CASH":
      return "Tiền mặt";
    case "CARD":
      return "Thẻ";
    case "MOMO":
      return "Momo";
    case "VNPAY":
      return "VNPAY";
    default:
      return "Không xác định";
  }
};
