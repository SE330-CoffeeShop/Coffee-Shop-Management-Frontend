import axios from "@/lib/axiosInstance";

export const acceptPendingOrder = async (orderId: string) => {
  const payload = {
    orderId: orderId,
    orderStatus: "PROCESSING",
  };
  try {
    const response = await axios.put(`/orders/`, payload);
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error accepting order:", error);
    throw error;
  }
};

export const cancelPendingOrder = async (orderId: string) => {
  const payload = {
    orderId: orderId,
    orderStatus: "CANCELLED",
  };
  try {
    const response = await axios.put(`/orders/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error CANCELLED order:", error);
    throw error;
  }
};

export const completeOrder = async (orderId: string) => {
  const payload = {
    orderId: orderId,
    orderStatus: "COMPLETED",
  };
  try {
    const response = await axios.put(`/orders/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error COMPLETED order:", error);
    throw error;
  }
};

export const deliveringOrder = async (orderId: string) => {
  const payload = {
    orderId: orderId,
    orderStatus: "DELIVERING",
  };
  try {
    const response = await axios.put(`/orders/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error DELIVERING order:", error);
    throw error;
  }
};

export const deliveredOrder = async (orderId: string) => {
  const payload = {
    orderId: orderId,
    orderStatus: "DELIVERED",
  };
  try {
    const response = await axios.put(`/orders/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error DELIVERED order:", error);
    throw error;
  }
};

export type OrderCardDetailPayload = {
  variantId: string;
  cartDetailQuantity: number;
};

export const createOrder = async (
  paymentMethodId: string,
  cartDetails: OrderCardDetailPayload[]
) => {
  const payload = {
    paymentMethodId: paymentMethodId,
    cartDetails: cartDetails,
  };
  try {
    const response = await axios.post(`/orders/employee`, payload);
    return response.data;
  } catch (error) {
    console.error("Error CREATE order (Employee):", error);
    throw error;
  }
};
