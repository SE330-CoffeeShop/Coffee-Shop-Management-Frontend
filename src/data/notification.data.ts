export const columns = [
  { uid: "notificationType", name: "Loại", sortable: true },
  { uid: "notificationContent", name: "Nội dung", sortable: true },
  { uid: "createdAt", name: "Ngày tạo", sortable: true },
  { uid: "read", name: "Trạng thái", sortable: true },
  { uid: "actions", name: "Hành động", sortable: false },
];

export const filterOptions = [
  { uid: "ALL", name: "Tất cả" },
  { uid: "UNREAD", name: "Chưa đọc" },
  { uid: "READ", name: "Đã đọc" },
];