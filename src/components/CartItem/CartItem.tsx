"use client";

import { CartItem } from "@/types/cart.type";
import { ChangeEvent } from "react";

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (item: CartItem, newQuantity: string) => void;
  onRemove: (item: CartItem) => void;
}

const CartItemComponent = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateQuantity(item, e.target.value);
  };

  const handleRemove = () => {
    onRemove(item);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
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
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="w-12 p-1 border rounded-md text-sm text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="text-red-500 text-xs hover:text-red-600 transition-colors duration-200"
      >
        Xóa
      </button>
    </div>
  );
};

export default CartItemComponent;
