import axiosInstance from "@/lib/axiosInstance";
import { CreateBranchDto, UpdateBranchDto } from "@/types/branch.type";

class BranchAdminServices {
  async getAllBranchesInSystem() {
    try {
      const response = await axiosInstance.get("/branch/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw new Error("Failed to fetch branches");
    }
  }

  async createBranch(branchData: CreateBranchDto) {
    try {
      const response = await axiosInstance.post("/branch/", branchData);
      return response.data;
    } catch (error) {
      console.error("Error creating branch:", error);
      throw new Error("Failed to create branch");
    }
  }

  async deleteBranchById(branchId: string) {
    try {
      const response = await axiosInstance.delete(`/branch/${branchId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting branch:", error);
      throw new Error("Failed to delete branch");
    }
  }

  async getDetailBranch(branchId: string) {
    try {
      const response = await axiosInstance.get(`/branch/${branchId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching branch details:", error);
      throw new Error("Failed to fetch branch details");
    }
  }

  async updateBranch(branchData: UpdateBranchDto) {
    try {
      const response = await axiosInstance.patch(`/branch/`, branchData);
      return response.data;
    } catch (error) {
      console.error("Error updating branch:", error);
      throw new Error("Failed to update branch");
    }
  }
}

export default new BranchAdminServices();
