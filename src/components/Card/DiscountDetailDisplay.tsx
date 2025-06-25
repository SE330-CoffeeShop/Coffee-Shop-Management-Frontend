"use client";

import React, { useState } from "react";
import { Card, CardBody, Button, Image } from "@heroui/react";
import { BeakerIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import {
  DiscountListResponse,
  productsDiscountResponse,
} from "@/types/discount.type";
import { formatNumberWithCommas } from "@/helpers";

interface DiscountDetailDisplayProps {
  discount: DiscountListResponse;
}

const DiscountDetailDisplay: React.FC<DiscountDetailDisplayProps> = ({
  discount,
}) => {
  const [showProducts, setShowProducts] = useState(false);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <Card className="bg-white shadow-lg border border-gray-200 rounded-2xl">
      <CardBody className="p-6 relative">
        <Button
          isIconOnly
          className="absolute top-4 right-4"
          onClick={() => setShowProducts(!showProducts)}
        >
          {showProducts ? (
            <DocumentTextIcon className="size-5" />
          ) : (
            <BeakerIcon className="size-5" />
          )}
        </Button>
        {showProducts ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Sản phẩm áp dụng
            </h3>
            {discount.products.length === 0 ? (
              <p className="text-sm text-gray-500">
                Không có sản phẩm nào được áp dụng.
              </p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
                  {discount.products.map(
                    (product: productsDiscountResponse) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Image
                          src={product.thumb}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                          fallbackSrc="/placeholder-image.png"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          {/* <p className="text-xs text-gray-600">
                            ID: {product.id}
                          </p> */}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Tên khuyến mãi
              </h4>
              <p className="text-base text-gray-900">{discount.discountName}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Mô tả</h4>
              <p className="text-sm text-gray-600">
                {discount.discountDescription}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Loại khuyến mãi
              </h4>
              <p className="text-sm text-gray-900">{discount.discountType}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Giá trị khuyến mãi
              </h4>
              <p className="text-sm text-gray-900">
                {discount.discountType === "PHẦN TRĂM"
                  ? `${discount.discountValue}%`
                  : `${formatNumberWithCommas(
                      String(discount.discountValue)
                    )} VNĐ`}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Mã khuyến mãi
              </h4>
              <p className="text-sm text-gray-900 font-mono">
                {discount.discountCode}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Ngày bắt đầu
              </h4>
              <p className="text-sm text-gray-600">
                {formatDate(discount.discountStartDate)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Ngày kết thúc
              </h4>
              <p className="text-sm text-gray-600">
                {formatDate(discount.discountEndDate)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Số lượng tối đa
              </h4>
              <p className="text-sm text-gray-900">
                {discount.discountMaxUsers}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Số lượng đã sử dụng
              </h4>
              <p className="text-sm text-gray-900">
                {discount.discountUserCount}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Giới hạn mỗi người
              </h4>
              <p className="text-sm text-gray-900">
                {discount.discountMaxPerUser}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Giá trị đơn hàng tối thiểu
              </h4>
              <p className="text-sm text-gray-900">
                {formatNumberWithCommas(String(discount.discountMinOrderValue))}{" "}
                VNĐ
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Trạng thái
              </h4>
              <p
                className={`text-sm ${
                  discount.discountIsActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {discount.discountIsActive
                  ? "Đang hoạt động"
                  : "Không hoạt động"}
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default DiscountDetailDisplay;
