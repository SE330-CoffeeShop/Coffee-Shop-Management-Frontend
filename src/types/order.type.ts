export type OrderDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderTotalCost: number;
  orderDiscountCost: number;
  orderTotalCostAfterDiscount: number;
  orderStatus:
    | "ĐANG CHỜ"
    | "ĐANG XỬ LÝ"
    | "HOÀN TẤT"
    | "ĐANG GIAO HÀNG"
    | "ĐÃ GIAO"
    | "ĐÃ HỦY";
  orderTrackingNumber: string;
  employeeId: string;
  employeeName: string;
  userId: string;
  shippingAddressId?: string;
  shippingAddressName?: string;
  userPhoneNumber?:string;
  userName: string;
};

export type OrderDetailDto = {
  id: string;
  orderId: string;
  productName: string;
  orderDetailQuantity: number;
  orderDetailUnitPrice: number;
  productVariantId: string;
  variantTierId: string;
  productThumb: string;
};

export const statusColorMap: Record<
  string,
  "default" | "primary" | "success" | "warning" | "danger"
> = {
  "CHỜ XÁC NHẬN": "default",
  "ĐANG XỬ LÝ": "primary",
  "HOÀN THÀNH": "success",
  "ĐANG VẬN CHUYỂN": "warning",
  "ĐÃ GIAO": "success",
  "ĐÃ HỦY": "danger",
};

export const statusDisplayMap: Record<string, string> = {
  "CHỜ XÁC NHẬN": "Chờ xác nhận",
  "ĐANG XỬ LÝ": "Đơn đang làm",
  "HOÀN THÀNH": "Đơn làm xong",
  "ĐANG VẬN CHUYỂN": "Đang vận chuyển",
  "ĐÃ GIAO": "Đã giao hàng",
  "ĐÃ HỦY": "Đã huỷ",
};
