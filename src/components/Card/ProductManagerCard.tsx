"use client";

import { useDisclosure } from "@heroui/react"; // Adjust import based on your library
import { ProductType } from "@/types/product.type";
import ProductDetailModal from "@/app/manager/drinks/ProductDetail.modal";

interface ProductCardProps {
  product: ProductType;
}

const ProductManagerCard = ({ product }: ProductCardProps) => {
  // Use useDisclosure to manage modal state
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <>
      <div
        className="flex flex-col sm:flex-row p-4 bg-white rounded-xl shadow-sm border gap-4 cursor-pointer"
        onClick={onOpen} // Trigger modal open
      >
        <div className="flex-shrink-0">
          <img
            src={product.productThumb}
            alt={product.productName}
            className="w-full xsm:w-20 xsm:h-20 sm:w-32 sm:h-32 object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col flex-grow justify-between">
          <div>
            <p className="text-lg-2-semibold text-secondary-900 line-clamp-2">
              {product.productName}
            </p>
            <p className="mt-2 text-sm-regular text-secondary-900 line-clamp-3">
              {product.productDescription}
            </p>
          </div>
        </div>
      </div>
      <ProductDetailModal
        isOpen={isOpen}
        onClose={onClose}
        product={product}
      />
    </>
  );
};

export default ProductManagerCard;