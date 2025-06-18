import React from "react";
import { Card, CardBody } from "@heroui/react";
import { DiscountDto } from "@/types/discount.type";
import { formatNumberWithCommas } from "@/helpers";

interface DiscountDetailDisplayProps {
  discount: DiscountDto;
}

const DiscountDetailDisplay: React.FC<DiscountDetailDisplayProps> = ({ discount }) => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <Card className="bg-gray-50 shadow-none border border-gray-200">
      <CardBody className="p-4 flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Tên khuyến mãi</h4>
          <p className="text-base text-gray-900">{discount.discountName}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Mô tả</h4>
          <p className="text-sm text-gray-600">{discount.discountDescription}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Loại khuyến mãi</h4>
          <p className="text-sm text-gray-900">{discount.discountType}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Giá trị khuyến mãi</h4>
          <p className="text-sm text-gray-900">
            {discount.discountType === "PHẦN TRĂM"
              ? `${discount.discountValue}%`
              : `${formatNumberWithCommas(String(discount.discountValue))} VNĐ`}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Mã khuyến mãi</h4>
          <p className="text-sm text-gray-900 font-mono">{discount.discountCode}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Ngày bắt đầu</h4>
          <p className="text-sm text-gray-600">{formatDate(discount.discountStartDate)}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Ngày kết thúc</h4>
          <p className="text-sm text-gray-600">{formatDate(discount.discountEndDate)}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Số lượng tối đa</h4>
          <p className="text-sm text-gray-900">{discount.discountMaxUsers}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Số lượng đã sử dụng</h4>
          <p className="text-sm text-gray-900">{discount.discountUserCount}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Giới hạn mỗi người</h4>
          <p className="text-sm text-gray-900">{discount.discountMaxPerUser}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Giá trị đơn hàng tối thiểu</h4>
          <p className="text-sm text-gray-900">{formatNumberWithCommas(String(discount.discountMinOrderValue))} VNĐ</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Trạng thái</h4>
          <p className={`text-sm ${discount.discountIsActive ? "text-green-600" : "text-red-600"}`}>
            {discount.discountIsActive ? "Đang hoạt động" : "Không hoạt động"}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default DiscountDetailDisplay;