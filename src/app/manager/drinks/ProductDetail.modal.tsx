"use client";

import { Key, useMemo } from "react";
import useSWR from "swr";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { ProductType } from "@/types/product.type";
import { ProductVariantType } from "@/types/product.variant.type";
import { ButtonProductVariant, classNames } from "@/components";
import ButtonSolid from "@/components/Button/ButtonSolid";
import axios from "@/lib/axiosInstance";

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

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductType;
}

const ProductDetailModal = ({ isOpen, onClose, product }: ProductDetailModalProps) => {
  const endpointProductVariants = `/product-variant/by-product/${product.id}`;

  const {
    data: productVariantsData,
    error: productVariantsError,
    isLoading: productVariantsLoading,
  } = useSWR(isOpen ? endpointProductVariants : null, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const processedVariants = useMemo(() => {
    if (!productVariantsData) return [];
    return productVariantsData.data
      .map(mapResponseToProductVariantType)
      .filter(
        (variant: ProductVariantType) =>
          variant.variantIsPublished && !variant.variantIsDeleted
      )
      .sort(
        (a: ProductVariantType, b: ProductVariantType) =>
          a.variantSort - b.variantSort
      );
  }, [productVariantsData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      radius="lg"
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
        <ModalHeader>Chi tiết sản phẩm</ModalHeader>
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
              <p className="mt-2 text-base-semibold text-secondary-900">
                Giá: {product.productPrice.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Biến thể sản phẩm</h3>
            {productVariantsLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : productVariantsError ? (
              <div className="text-red-500">Lỗi khi tải biến thể sản phẩm</div>
            ) : processedVariants.length === 0 ? (
              <div className="text-gray-500">Không có biến thể nào</div>
            ) : (
              <ul className="flex flex-row gap-4">
                {processedVariants.map((variant: { id: Key | null | undefined; variantTierIdx: string | undefined; }) => (
                  <li key={variant.id}>
                    <ButtonProductVariant
                      content={variant.variantTierIdx}
                      isDisabled={true}
                      className={classNames(
                        "bg-bg-content text-secondary-400 rounded-sm border-secondary-400 cursor-not-allowed"
                      )}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <ButtonSolid
            content="Đóng"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductDetailModal;