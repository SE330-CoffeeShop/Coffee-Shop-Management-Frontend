import axiosInstance from "@/lib/axiosInstance";
import { CreateShiftDto } from "@/types/shift.type";

class ShiftServices {
  async createShift(shiftData: CreateShiftDto) {
    try {
      const response = await axiosInstance.post(`/shift/`, shiftData);
      return response.data;
    } catch (error) {
      console.error("Error creating shift:", error);
      throw error;
    }
  }
}

export default new ShiftServices();