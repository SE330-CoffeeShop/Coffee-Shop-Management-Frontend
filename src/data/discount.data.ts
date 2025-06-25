export const columns = [
  { name: "STT", uid: "index", sortable: false },
  { name: "Tên khuyến mãi", uid: "discountName", sortable: true },
  { name: "Mô tả", uid: "discountDescription", sortable: true },
  { name: "Số lượng tối đa", uid: "discountMaxUsers", sortable: true },
  { name: "Ngày bắt đầu", uid: "discountStartDate", sortable: true },
  { name: "Ngày kết thúc", uid: "discountEndDate", sortable: true },
  { name: "Hành động", uid: "actions", sortable: false },
];

export const statusOptions = [
  { name: "Tất cả", uid: "ALL" },
  { name: "Có thể sử dụng", uid: "ACTIVE" },
  { name: "Không hiệu lực", uid: "INACTIVE" },
];