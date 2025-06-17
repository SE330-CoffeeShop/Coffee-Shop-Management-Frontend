"use client";

import { ModalProps } from "@/types";
import { useState, useEffect, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import useSWR from "swr";
import { ProductType } from "@/types/product.type";
import { ProductVariantType } from "@/types/product.variant.type";
import { ButtonProductVariant, classNames } from "@/components";
import ButtonSolid from "@/components/Button/ButtonSolid";
import CartContext from "@/contexts/CartContext";
import { CartContextType } from "@/types/cart.type";

interface AddProductToCartModalType extends ModalProps {
  product: ProductType;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const mapResponseToProductVariantType = (response: any): ProductVariantType => {
  return {
    id: response.id,
    variantTierIdx: response.variantTierIdx,
    variantDefault: response.variantDefault,
    variantSlug: response.variantSlug,
    variantSort: response.variantSort,
    variantPrice: response.variantPrice,
    variantIsPublished: response.variantIsPublished,
    variantIsDeleted: response.variantIsDeleted,
    productId: response.productId,
  };
};

const AddProductToCartModal = ({
  isOpen,
  onOpenChange,
  onClose,
  onCallParent,
  product,
}: AddProductToCartModalType) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productVariants, setProductVariants] = useState<ProductVariantType[]>(
    []
  );
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantType | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const { addToCart } = useContext(CartContext) as CartContextType;

  const endpointProductVariants = `/product-variant/by-product/${product.id}`;

  const {
    data: productVariantsData,
    error: productVariantsError,
    isLoading: productVariantsLoading,
  } = useSWR(endpointProductVariants, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  // Cập nhật danh sách biến thể và chọn biến thể mặc định
  useEffect(() => {
    if (productVariantsData) {
      console.log("productVariantsData: ", productVariantsData);
      const mappedVariants = productVariantsData.data
        .map(mapResponseToProductVariantType)
        .filter(
          (variant: ProductVariantType) =>
            variant.variantIsPublished && !variant.variantIsDeleted
        )
        .sort(
          (a: ProductVariantType, b: ProductVariantType) =>
            a.variantSort - b.variantSort
        );
      setProductVariants(mappedVariants);

      // Chọn biến thể mặc định
      const defaultVariant = mappedVariants.find(
        (variant: ProductVariantType) => variant.variantDefault
      );
      setSelectedVariant(defaultVariant || mappedVariants[0] || null);
    }
  }, [productVariantsData]);

  // Xử lý chọn biến thể
  const handleSelectVariant = (variant: ProductVariantType) => {
    setSelectedVariant(variant);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn một biến thể");
      return;
    }

    setIsSubmitting(true);
    addToCart(
      { ...product },
      quantity,
      selectedVariant.id,
      selectedVariant.variantTierIdx
    );
    if (onCallParent) {
      onCallParent();
    }
    handleClose();
    setIsSubmitting(false);
  };

  // Xử lý đóng modal
  const handleClose = () => {
    setProductVariants([]);
    setSelectedVariant(null);
    onClose();
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1) {
      setQuantity(num);
    }
  };

  const size = "2xl";

  // Tính giá hiển thị
  const displayPrice = selectedVariant
    ? (selectedVariant.variantPrice * quantity).toLocaleString("vi-VN")
    : product.productPrice.toLocaleString("vi-VN");

  return (
    <Modal
      size={size}
      isOpen={isOpen}
      radius="lg"
      onOpenChange={onOpenChange}
      onClose={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      scrollBehavior="outside"
      classNames={{
        body: "py-5 px-6 bg-white border-outline-var",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-outline-var bg-outline-var",
        header: "border-b-[1px] border-border bg-white",
        footer: "border-t-[1px] border-border bg-white",
      }}
    >
      <ModalContent>
        <ModalHeader>Thêm sản phẩm vào Giỏ hàng</ModalHeader>
        <ModalBody>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-shrink-0">
              <img
                src={product.productThumb}
                alt={product.productName}
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-lg-2-semibold text-secondary-900 line-clamp-2">
                {product.productName}
              </p>
              <p className="mt-2 text-sm-regular text-secondary-400 line-clamp-3">
                {product.productDescription}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 mb-4">
            <p className="text-base-semibold text-secondary-900 mr-4">
              Số lượng
            </p>
            <Input
              id="quantity"
              type="number"
              min={1}
              radius="sm"
              fullWidth={false}
              value={quantity.toString()}
              onChange={(e) => handleQuantityChange(e.target.value)}
            />
          </div>
          {productVariantsLoading ? (
            <div className="animate-pulse space-y-2">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : productVariantsError ? (
            <div className="text-red-500">Lỗi khi tải biến thể sản phẩm</div>
          ) : productVariants.length === 0 ? (
            <div className="text-gray-500">Không có biến thể nào</div>
          ) : (
            <ul className="flex flex-row gap-4">
              {productVariants.map((variant) => (
                <li key={variant.id}>
                  <ButtonProductVariant
                    content={variant.variantTierIdx}
                    isDisabled={!variant.variantIsPublished}
                    onClick={() => handleSelectVariant(variant)}
                    className={classNames(
                      selectedVariant?.id === variant.id
                        ? "bg-primary-700 text-secondary-100"
                        : "bg-bg-content text-secondary-400",
                      "rounded-sm border-secondary-400"
                    )}
                  />
                </li>
              ))}
            </ul>
          )}
        </ModalBody>
        <ModalFooter className="justify-between">
          <div className="flex flex-row items-center gap-4">
            <p className="text-base-semibold text-secondary-900">
              Giá: {displayPrice} VNĐ
            </p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <ButtonSolid
              content="Hủy"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
            />
            <ButtonSolid
              content="Thêm vào giỏ hàng"
              isDisabled={isSubmitting || !selectedVariant}
              onClick={handleAddToCart}
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            />
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductToCartModal;
