import axiosInstance from "@/lib/axiosInstance";
import { UserCreateDto } from "@/types/user.type";

class UserManagerServices {
  async createUser(userData: UserCreateDto) {
    try {
      const response = await axiosInstance.post(`/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default new UserManagerServices();