"use client";

import { CartItem } from "@/types/cart.type";

interface CartItemDisplayProps {
  item: CartItem;
}

const CartItemDisplay = ({ item }: CartItemDisplayProps) => {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 mb-2">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.productThumb}
          alt={item.productName}
          width={64}
          height={64}
          className="rounded-lg object-cover"
        />
      </div>
      {/* Text Section */}
      <div className="flex flex-col flex-grow">
        {/* Line 1: Product Name */}
        <span className="text-sm font-semibold text-secondary-900 line-clamp-1">
          {item.productName}
        </span>
        {/* Line 2: Variant */}
        <span className="text-xs text-gray-500 mt-1">
          Kích thước: {item.productVariantTierIdx}
        </span>
        {/* Line 3: Price and Quantity */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-secondary-900">
            {(item.productPrice * item.quantity).toLocaleString("vi-VN")} VNĐ
          </span>
          <span className="text-sm text-secondary-900">
            Số lượng: {item.quantity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItemDisplay;