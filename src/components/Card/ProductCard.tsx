"use client";

import ButtonSolid from "@/components/Button/ButtonSolid";
import { ProductType } from "@/types/product.type";

interface ProductCardProps {
  product: ProductType;
  onSelected: (product: ProductType) => void;
}

const ProductCard = ({ product, onSelected }: ProductCardProps) => {
  const handleAddToCart = () => {
    onSelected(product);
  };

  return (
    <div className="flex flex-col sm:flex-row p-4 bg-white rounded-xl shadow-sm border gap-4">
      {/* Div 1: Ảnh sản phẩm */}
      <div className="flex-shrink-0">
        <img
          src={product.productThumb}
          alt={product.productName}
          className="w-full xsm:w-20 xsm:h-20 sm:w-32 sm:h-32 object-cover rounded-xl"
        />
      </div>

      {/* Div 2: Thông tin sản phẩm */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          <p className="text-lg-2-semibold text-secondary-900 line-clamp-2">
            {product.productName}
          </p>
          <p className="mt-2 text-sm-regular text-secondary-400 line-clamp-3">
            {product.productDescription}
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <span className="text-base-semibold text-gray-800 line-clamp-1">
            {product.productPrice.toLocaleString("vi-VN")} VNĐ
          </span>
          <ButtonSolid
            content="Thêm vào giỏ hàng"
            isDisabled={!product.productIsPublished}
            className="px-4 py-2 bg-primary-500 text-primary-0 rounded-xl hover:bg-primary-600 transition sm:line-clamp-1"
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
