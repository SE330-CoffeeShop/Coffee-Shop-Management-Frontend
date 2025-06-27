"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Button,
} from "@heroui/react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { ProductType } from "@/types/product.type";
import { UpdateProductDto } from "@/types/product.type";
import ProductAdminServices from "@/services/admin.services/ProductServices";
import axiosInstance from "@/lib/axiosInstance";
import { ButtonSolid } from "@/components";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductType;
  onUpdate: () => void;
  onDelete: () => void;
}

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  onUpdate,
  onDelete,
}: ProductDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState<ProductType>(product);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Fetch categories when modal opens or in editing mode
  const { data: categoriesData, error: categoriesError } = useSWR(
    isOpen ? "/product-category/all?limit=100" : null,
    fetcher
  );

  useEffect(() => {
    if (categoriesError) toast.error("Lỗi khi tải danh sách danh mục.");
  }, [categoriesError]);

  // Reset state when product changes
  useEffect(() => {
    setUpdatedProduct(product);
    setNewImage(null);
    setImageRemoved(false);
    setIsEditing(false);
  }, [product]);

  const handleUpdate = async () => {
    try {
      const updateDto: UpdateProductDto = {
        productId: product.id,
        productName: updatedProduct.productName,
        productDescription: updatedProduct.productDescription,
        productPrice: updatedProduct.productPrice,
        productCommentCount: updatedProduct.productCommentCount,
        productRatingsAverage: updatedProduct.productRatingsAverage,
        productIsPublished: updatedProduct.productIsPublished,
        productIsDeleted: updatedProduct.productIsDeleted,
        productCategory: updatedProduct.productCategoryId,
      };
      console.log("Updating product with data:", updateDto);
      await ProductAdminServices.updateProduct(updateDto);

      if (newImage) {
        await ProductAdminServices.updateImageProduct(product.id, newImage);
      } else if (imageRemoved) {
        await ProductAdminServices.deleteImageProduct(product.id);
      }

      toast.success("Cập nhật sản phẩm thành công!");
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
      toast.error(error?.response?.data?.message || "Lỗi không xác định");
    }
  };

  const handleDelete = async () => {
    try {
      await ProductAdminServices.deleteProduct(product.id);
      toast.success("Xoá sản phẩm thành công!");
      onDelete();
      onClose();
    } catch (error: any) {
      toast.error("Xoá sản phẩm thất bại. Vui lòng thử lại.");
      toast.error(error?.response?.data?.message || "Lỗi không xác định");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="4xl"
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
          <ModalHeader>
            {isEditing ? "CHỈNH SỬA SẢN PHẨM" : "CHI TIẾT SẢN PHẨM"}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-6">
              {/* Product Name */}
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-secondary-900">
                  TÊN SẢN PHẨM<span className="text-error-600">*</span>
                </span>
                <div className="basis-[70%]">
                  {isEditing ? (
                    <Input
                      type="text"
                      value={updatedProduct.productName}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          productName: e.target.value,
                        })
                      }
                      placeholder="Nhập tên sản phẩm"
                      aria-label="Tên sản phẩm"
                      className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                    />
                  ) : (
                    <div className="border-2 border-secondary-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {product.productName}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-secondary-900">
                  MÔ TẢ<span className="text-error-600">*</span>
                </span>
                <div className="basis-[70%]">
                  {isEditing ? (
                    <Input
                      type="text"
                      value={updatedProduct.productDescription}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          productDescription: e.target.value,
                        })
                      }
                      readOnly={true}
                      placeholder="Nhập mô tả sản phẩm"
                      aria-label="Mô tả sản phẩm"
                      className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                    />
                  ) : (
                    <div className="border-2 border-secondary-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {product.productDescription}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Price */}
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-secondary-900">
                  GIÁ<span className="text-error-600">*</span>
                </span>
                <div className="basis-[70%]">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={updatedProduct.productPrice.toString()}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          productPrice: Number(e.target.value),
                        })
                      }
                      placeholder="Nhập giá sản phẩm"
                      min="0"
                      aria-label="Giá sản phẩm"
                      className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                    />
                  ) : (
                    <div className="border-2 border-secondary-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {product.productPrice.toLocaleString("vi-VN")} VNĐ
                    </div>
                  )}
                </div>
              </div>

              {/* Product Category */}
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-secondary-900">
                  DANH MỤC<span className="text-error-600">*</span>
                </span>
                <div className="basis-[70%]">
                  {isEditing ? (
                    <Select
                      placeholder="Chọn danh mục"
                      selectedKeys={
                        updatedProduct.productCategoryId
                          ? [updatedProduct.productCategoryId]
                          : []
                      }
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          productCategoryId: e.target.value,
                        })
                      }
                      aria-label="Danh mục sản phẩm"
                      className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                      popoverProps={{
                        classNames: {
                          content:
                            "bg-white border-2 border-secondary-200 shadow-lg rounded-lg",
                        },
                      }}
                    >
                      {categoriesData?.data.map(
                        (category: { id: string; categoryName: string }) => (
                          <SelectItem
                            key={category.id}
                            textValue={category.categoryName}
                            className="bg-white"
                          >
                            {category.categoryName}
                          </SelectItem>
                        )
                      )}
                    </Select>
                  ) : (
                    <div className="border-2 border-secondary-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {categoriesData?.data.find(
                        (cat: { id: string }) =>
                          cat.id === product.productCategoryId
                      )?.categoryName || "Chưa có danh mục"}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Is Published */}
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-secondary-900">
                  ĐƯỢC CÔNG BỐ
                </span>
                <div className="basis-[70%]">
                  {isEditing ? (
                    <Checkbox
                      isSelected={updatedProduct.productIsPublished}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          productIsPublished: e.target.checked,
                        })
                      }
                      aria-label="Được công bố"
                    >
                      Công khai sản phẩm
                    </Checkbox>
                  ) : (
                    <div className="border-2 border-secondary-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                      {product.productIsPublished ? "Có" : "Không"}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Image */}
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-secondary-900">
                  HÌNH ẢNH
                </span>
                <div className="basis-[70%] flex flex-col gap-2">
                  {isEditing ? (
                    <>
                      {newImage ? (
                        <img
                          src={URL.createObjectURL(newImage)}
                          alt="New Image"
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      ) : imageRemoved ? (
                        <span>Ảnh đã bị xoá</span>
                      ) : (
                        <img
                          src={product.productThumb}
                          alt={product.productName}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setNewImage(e.target.files?.[0] || null)
                        }
                        aria-label="Hình ảnh sản phẩm"
                        className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                      />
                      {!imageRemoved && product.productThumb && (
                        <Button
                          color="danger"
                          onClick={() => setImageRemoved(true)}
                          className="w-fit"
                        >
                          Xoá ảnh
                        </Button>
                      )}
                    </>
                  ) : (
                    <img
                      src={product.productThumb}
                      alt={product.productName}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
              {/* Read-only fields: Ratings Average */}
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-secondary-900">
                  SỐ LƯỢT ĐÁNH GIÁ
                </span>
                <div className="basis-[70%] border-2 border-secondary-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                  {product.productCommentCount || 0}
                </div>
              </div>

              {/* Read-only fields: Ratings Average */}
              <div className="flex flex-row gap-4">
                <span className="basis-[30%] text-sm-semibold text-secondary-900">
                  ĐÁNH GIÁ TRUNG BÌNH
                </span>
                <div className="basis-[70%] border-2 border-secondary-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                  {product.productRatingsAverage || 0}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {!isEditing ? (
              <div className="flex w-full flex-row justify-between space-x-6">
                <Button
                  onClick={onClose}
                  className="w-1/3 rounded-lg border-2 border-secondary-200 bg-white py-2 text-[16px] font-medium text-secondary-900 hover:bg-gray-100"
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-1/3 rounded-lg border-2 border-secondary-200 bg-primary-500 text-primary-0 hover:bg-primary-600"
                >
                  Cập nhật
                </Button>
                <ButtonSolid
                  onClick={() => setShowDeleteConfirmation(true)}
                  content="Xoá sản phẩm"
                  className="w-1/3 rounded-lg border-2 border-secondary-200 bg-error-500 text-base-semibold text-secondary-100 hover:bg-error-700"
                />
              </div>
            ) : (
              <div className="flex w-full flex-row justify-between space-x-6">
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setNewImage(null);
                    setImageRemoved(false);
                    setUpdatedProduct(product);
                  }}
                  className="w-1/2 rounded-lg border-2 border-secondary-200 bg-white py-2 text-[16px] font-medium text-secondary-900 hover:bg-gray-100"
                >
                  Huỷ cập nhật
                </Button>
                <Button
                  onClick={() => setShowUpdateConfirmation(true)}
                  className="w-1/2 rounded-lg border-2 border-secondary-200 bg-primary-500 text-primary-0 hover:bg-primary-600"
                >
                  Cập nhật
                </Button>
              </div>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Confirmation Modal */}
      <Modal
        isOpen={showUpdateConfirmation}
        onClose={() => setShowUpdateConfirmation(false)}
        size="sm"
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
          <ModalHeader>XÁC NHẬN CẬP NHẬT</ModalHeader>
          <ModalBody>
            <p>Bạn có chắc chắn muốn cập nhật sản phẩm này không?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setShowUpdateConfirmation(false)}
              className="w-1/2 rounded-lg border-2 border-secondary-200 bg-white py-2 text-[16px] font-medium text-secondary-900 hover:bg-gray-100"
            >
              Huỷ
            </Button>
            <Button
              color="primary"
              onClick={handleUpdate}
              className="w-1/2 rounded-lg border-2 border-secondary-200 bg-primary-500 text-primary-0 hover:bg-primary-600"
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        size="sm"
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
          <ModalHeader>XÁC NHẬN XOÁ</ModalHeader>
          <ModalBody>
            <p>
              Bạn có chắc chắn muốn xoá sản phẩm này không? Hành động này không
              thể hoàn tác.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setShowDeleteConfirmation(false)}
              className="w-1/2 rounded-lg border-2 border-secondary-200 bg-white py-2 text-[16px] font-medium text-secondary-900 hover:bg-gray-100"
            >
              Huỷ
            </Button>
            <ButtonSolid
              onClick={handleDelete}
              content="Xoá sản phẩm"
              className="w-1/2 rounded-lg border-2 border-secondary-200 bg-error-500 text-base-semibold text-secondary-100 hover:bg-error-700"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductDetailModal;
