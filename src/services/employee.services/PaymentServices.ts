import axios from "@/lib/axiosInstance";

export const getOrderPaymentByOrderId = async (
  orderId: string
): Promise<any> => {
  try {
    const response = await axios.get(`/payment/order/by-order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error GET ORDER PAYMENT BY ORDER ID (Employee):", error);
    throw error;
  }
};

export const updateOrderPaymentStatusFail = async (
  orderPayemntId: string
): Promise<any> => {
  try {
    const response = await axios.patch(`/payment/order/${orderPayemntId}/status?status=FAILED`);
    return response.data;
  } catch (error) {
    console.error("Error UPDATE FAILED ORDER PAYMENT STATUS (Employee):", error);
    throw error;
  }
};
