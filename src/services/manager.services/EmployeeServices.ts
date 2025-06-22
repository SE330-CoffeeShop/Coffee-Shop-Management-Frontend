import axiosInstance from "@/lib/axiosInstance";

class EmployeeServices {
  async getEmployeeDetailById(id: string) {
    try {
      const response = await axiosInstance.get(`/employee/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee with id ${id}:`, error);
      throw error;
    }
  }

  async getAllEmployeesByBranchId() {
    try {
      const response = await axiosInstance.get(`/employee/branch`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employees for branch:`, error);
      throw error;
    }
  }

  async deleteEmployeeById(id: string) {
    try {
      const response = await axiosInstance.delete(`/employee/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee with id ${id}:`, error);
      throw error;
    }
  }
}

export default new EmployeeServices();