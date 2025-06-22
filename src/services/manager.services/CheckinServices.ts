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

  async patchCheckinDailyEmployeeByCheckinId({
    checkinId,
    checkinTime,
  }: {
    checkinId: string;
    checkinTime: string;
  }) {
    const payload = {
      checkinId: checkinId,
      checkinTime: checkinTime,
    };
    try {
      const response = await axiosInstance.patch(`/checkin/`, payload);
      return response.data;
    } catch (error) {
      console.error("Error updating check-in time:", error);
      throw error;
    }
  }
}

export default new CheckinManagerService();
