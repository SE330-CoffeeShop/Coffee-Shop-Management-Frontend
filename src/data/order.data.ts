export const columns = [
  { name: "STT", uid: "index", sortable: false },
  { name: "ID", uid: "orderId", sortable: true },
  { name: "Nhân viên", uid: "employeeName", sortable: true },
  { name: "Khách hàng", uid: "userName", sortable: true },
  { name: "Thời gian", uid: "createdAt", sortable: true },
  { name: "Tổng tiền", uid: "totalAmount", sortable: true },
  { name: "Xem chi tiết", uid: "actions", sortable: false },
];

export const statusOptions = [
  { name: "Đơn đang làm", uid: "PROCESSING" },
  { name: "Đơn làm xong", uid: "COMPLETED" },
  { name: "Đang vận chuyển", uid: "DELIVERING" },
  { name: "Đã bàn giao", uid: "DELIVERED" },
  { name: "Đã huỷ", uid: "CANCELLED" },
];

export const statusAdminOptions = [
  { name: "Chờ tiếp nhận", uid: "ĐANG CHỜ" },
  { name: "Đơn đang làm", uid: "ĐANG XỬ LÝ" },
  { name: "Đơn làm xong", uid: "HOÀN TẤT" },
  { name: "Đang vận chuyển", uid: "ĐANG GIAO HÀNG" },
  { name: "Đã bàn giao", uid: "ĐÃ GIAO HÀNG" },
  { name: "Đã huỷ", uid: "ĐÃ HỦY" },
];