export const columns = [
  { name: "STT", uid: "index", sortable: false },
  { name: "ID", uid: "orderId", sortable: true },
  { name: "Nhân viên", uid: "employeeName", sortable: true },
  { name: "Khách hàng", uid: "customerName", sortable: true },
  { name: "Thời gian", uid: "createdAt", sortable: true },
  { name: "Tổng tiền", uid: "totalAmount", sortable: true },
  { name: "Xem chi tiết", uid: "actions", sortable: false },
];

export const statusOptions = [
  { name: "Đơn đang làm", uid: "PROCESSING" },
  { name: "Đơn làm xong", uid: "COMPLETED" },
  { name: "Đang vận chuyển", uid: "DELIVERING" },
  { name: "Đã giao hàng", uid: "DELIVERED" },
  { name: "Đã huỷ", uid: "CANCELLED" },
];