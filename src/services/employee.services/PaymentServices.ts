import axios from "@/lib/axiosInstance";

export type PaymentMethodDto = {
  paymentMethodId: string;
  paymentMethodName: string;
  paymentMethodDescription: string;
  active: boolean;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);


export const getAllPaymentMethod = () => {
  
}