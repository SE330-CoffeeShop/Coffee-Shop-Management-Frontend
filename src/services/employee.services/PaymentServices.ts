import axios from "@/lib/axiosInstance";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const getAllPaymentMethod = () => {

}