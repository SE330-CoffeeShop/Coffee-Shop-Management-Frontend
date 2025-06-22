import axiosInstance from "@/lib/axiosInstance";
import { CreateDiscountDto, UpdateDiscountDto } from "@/types/discount.type";

class DiscountService {
  async createDiscount(discountData: CreateDiscountDto) {
    try {
      const response = await axiosInstance.post("/discount/", discountData);
      return response.data;
    } catch (error) {
      console.error("Error creating discount:", error);
      throw error;
    }
  }

  async updateDiscount(updateDiscountData: UpdateDiscountDto) {
    try {
      const response = await axiosInstance.patch(`/discount/`, updateDiscountData);
      return response.data;
    } catch (error) {
      console.error("Error updating discount:", error);
      throw error;
    }
  }

  async deleteDiscount(discountId: string) {
    try {
      const response = await axiosInstance.delete(`/discount/${discountId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting discount:", error);
      throw error;
    }
  }
}

export default new DiscountService();
