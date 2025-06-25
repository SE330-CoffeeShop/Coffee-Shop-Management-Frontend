import axiosInstance from "@/lib/axiosInstance";

class CheckinManagerService {
  async getAllCheckinByBranchId({
    branchId,
    day,
    month,
    year,
    page,
    limit,
  }: {
    branchId: string;
    day: number;
    month: number;
    year: number;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await axiosInstance.get(
        `/checkin/branch/${branchId}/year/${year}/month/${month}/day/${day}?page=${
          page || 1
        }&limit=${limit || 10}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching check-ins for branch:", error);
      throw error;
    }
  }

  async checkInDailyEmployee(shiftId: string, checkinTime: string) {
    try {
      const response = await axiosInstance.post("/checkin/", {
        shiftId,
        checkinTime,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCheckinByShiftAndDateMonthYear({
    shiftId,
    day,
    month,
    year,
    page = 1,
    limit = 15,
  }: {
    shiftId: string;
    day: number;
    month: number;
    year: number;
    page?: number;
    limit?: number;
  }) {
    if (!shiftId || !day || !month || !year) {
      throw new Error("Missing required parameters: shiftId, day, month, year");
    }
    console.log("shiftId:", shiftId);
    console.log("day:", day);
    console.log("month:", month);
    console.log("year:", year);
    try {
      const response = await axiosInstance.get(
        `/checkin/shift/${shiftId}/year/${year}/month/${month}/day/${day}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching check-in for shift:", error);
      throw error;
    }
  }

  async deleteCheckin(checkinId: string) {
    console.log("Deleting check-in with ID:", checkinId);
    try {
      const response = await axiosInstance.delete(`/checkin/${checkinId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting check-in:", error);
      throw error;
    }
  }
}

export default new CheckinManagerService();
