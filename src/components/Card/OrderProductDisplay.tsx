"use clinet";

import React from "react";
import { Card, CardBody, Image } from "@heroui/react";
import { OrderDetailDto } from "@/types/order.type";
import { formatNumberWithCommas } from "@/helpers";

interface OrderProductDisplayProps {
  item: OrderDetailDto;
}

const OrderProductDisplay: React.FC<OrderProductDisplayProps> = ({ item }) => {
  return (
    <Card className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardBody className="p-4 flex gap-4">
        <Image
          src={item.productThumb}
          alt={item.productName}
          className="w-20 h-20 object-cover rounded-md"
          fallbackSrc="/placeholder-image.png"
        />
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">
              {item.productName}
            </p>
            <p className="text-xs text-gray-600 capitalize">
              Kích thước: {item.variantTierId || "N/A"}
            </p>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-xs text-gray-600">
              Số lượng: {item.orderDetailQuantity}
            </p>
            <p className="text-sm font-medium text-primary-700">
              {formatNumberWithCommas(String(item.orderDetailUnitPrice))} VNĐ
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default OrderProductDisplay;
