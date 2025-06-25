import { acceptPendingOrder } from "@/services/employee.services/OrderServices";
import { getOrderPaymentByOrderId } from "@/services/employee.services/PaymentServices";

// Payment Handler Interface
interface PaymentHandler {
  initiatePayment(orderId: string): Promise<void>;
}

// VNPAY Payment Handler
class VNPayHandler implements PaymentHandler {
  async initiatePayment(orderId: string): Promise<void> {
    const paymentDetails = await getOrderPaymentByOrderId(orderId);
    if (paymentDetails && paymentDetails.statusCode === 200) {
      window.open(paymentDetails.data.vnpayPayUrl, "_blank");
    } else {
      throw new Error("Không thể lấy thông tin thanh toán VNPAY");
    }
  }
}

// PayPal Payment Handler
class PayPalHandler implements PaymentHandler {
  async initiatePayment(orderId: string): Promise<void> {
    const paymentDetails = await getOrderPaymentByOrderId(orderId);
    if (paymentDetails && paymentDetails.statusCode === 200) {
      window.open(paymentDetails.data.paypalApprovalUrl, "_blank");
    } else {
      throw new Error("Không thể lấy thông tin thanh toán PayPal");
    }
  }
}

// Cash Payment Handler
class CashHandler implements PaymentHandler {
  async initiatePayment(orderId: string): Promise<void> {
    // No immediate action for cash; wait for "Đã thu tiền" confirmation
  }
}

// Factory for Payment Handlers
const paymentHandlers: { [key: string]: PaymentHandler } = {
  [process.env.NEXT_PUBLIC_PAYMENT_METHOD_VNPAY?.trim() as string]:
    new VNPayHandler(),
  [process.env.NEXT_PUBLIC_PAYMENT_METHOD_PAYPAL?.trim() as string]:
    new PayPalHandler(),
  [process.env.NEXT_PUBLIC_PAYMENT_METHOD_CASH?.trim() as string]:
    new CashHandler(),
};

export const getPaymentHandler = (paymentMethod: string): PaymentHandler => {
  const trimmedPaymentMethod = paymentMethod.trim();
  const handler = paymentHandlers[trimmedPaymentMethod];
  if (!handler) {
    throw new Error(
      `Không hỗ trợ phương thức thanh toán: ${trimmedPaymentMethod}`
    );
  }
  return handler;
};
