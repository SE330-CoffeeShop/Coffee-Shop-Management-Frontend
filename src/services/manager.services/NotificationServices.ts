import axios from "@/lib/axiosInstance";

class NotificationManagerServices {
  async getReceivedNotifications({
    page = 1,
    limit = 15,
  }: {
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await axios.get(
        `/notification/received/user?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async patchReadNotification({notificationId}: {notificationId: string}) {
    try {
      const response = await axios.patch(`/notification/read/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }
}

export default new NotificationManagerServices();