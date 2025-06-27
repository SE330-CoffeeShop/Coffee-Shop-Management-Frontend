import axiosInstance from "@/lib/axiosInstance";
import { EmployeeCreateDto, UpdateEmployeeDto } from "@/types/employee.type";

class EmployeeAdminServices {
  updateEmployee(managerId: string, updateDto: UpdateEmployeeDto) {
    throw new Error("Method not implemented.");
  }
  async getDetailEmployee(employeeId: string) {
    try {
      const response = await axiosInstance.get(`/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      throw new Error("Failed to fetch employee details");
    }
  }

  async createManagerBranch(branchId: string, manager: EmployeeCreateDto) {
    try {
      const response = await axiosInstance.post(`/employee/branch-manager/${branchId}`, manager);
      return response.data;
    } catch (error) {
      console.error("Error creating manager for branch:", error);
      throw new Error("Failed to create manager for branch");
    }
  }

  async deleteManagerBranchById(employeeId: string) {
    try {
      const response = await axiosInstance.delete(`/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting manager for branch:", error);
      throw new Error("Failed to delete manager for branch");
    }
  }
}

export default new EmployeeAdminServices();