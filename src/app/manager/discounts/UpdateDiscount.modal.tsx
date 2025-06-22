"use client";

import {
  Chip,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Divider,
  Select,
  SelectItem,
  Selection,
  Checkbox,
  Image,
} from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { ProductType } from "@/types/product.type";
import { UpdateDiscountDto } from "@/types/discount.type";
import ProductServices from "@/services/manager.services/ProductServices";
import DiscountService from "@/services/manager.services/DiscountServices";
import SelectedProductsTable from "@/app/manager/discounts/SelectedProducts.table";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface SelectedProduct {
  productId: string;
  productName: string;
  productThumb: string;
}

const UpdateDiscountModal = ({
  isOpen,
  onOpenChange,
  onClose,
  branchId,
  discountId,
  onUpdated,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  branchId: string;
  discountId: string;
  onUpdated?: () => void;
}) => {
  const [discountName, setDiscountName] = useState<string>("");
  const [discountDescription, setDiscountDescription] = useState<string>("");
  const [discountType, setDiscountType] = useState<Selection>(new Set([]));
  const [discountValue, setDiscountValue] = useState<string>("");
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountStartDate, setDiscountStartDate] = useState<string>("");
  const [discountEndDate, setDiscountEndDate] = useState<string>("");
  const [discountMaxUsers, setDiscountMaxUsers] = useState<string>("");
  const [discountMaxPerUser, setDiscountMaxPerUser] = useState<string>("");
  const [discountMinOrderValue, setDiscountMinOrderValue] =
    useState<string>("");
  const [discountIsActive, setDiscountIsActive] = useState<boolean>(true);
  const [productIds, setProductIds] = useState<Selection>(new Set([]));
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    discountName: string;
    discountDescription: string;
    discountType: string;
    discountValue: string;
    discountCode: string;
    discountStartDate: string;
    discountEndDate: string;
    discountMaxUsers: string;
    discountMaxPerUser: string;
    discountMinOrderValue: string;
    productIds: string;
  }>({
    discountName: "",
    discountDescription: "",
    discountType: "",
    discountValue: "",
    discountCode: "",
    discountStartDate: "",
    discountEndDate: "",
    discountMaxUsers: "",
    discountMaxPerUser: "",
    discountMinOrderValue: "",
    productIds: "",
  });

  const discountTypes = [
    { key: "AMOUNT", label: "SỐ TIỀN" },
    { key: "PERCENTAGE", label: "PHẦN TRĂM" },
  ];

  const discountTypeMap: { [key: string]: string } = {
    AMOUNT: "VNĐ",
    PERCENTAGE: "%",
  };

  const discountTypeReverseMap: { [key: string]: string } = {
    "SỐ TIỀN": "AMOUNT",
    "PHẦN TRĂM": "PERCENTAGE",
    AMOUNT: "AMOUNT",
    PERCENTAGE: "PERCENTAGE",
  };

  const selectedDiscountType = useMemo(() => {
    const selected = Array.from(discountType)[0] as string;
    return selected || "";
  }, [discountType]);

  const endpointProducts = `/product/all?page=1&limit=200`;
  const endpointDiscount = `/discount/${discountId}`;

  const { data: productsData, isLoading: productsLoading } = useSWR(
    endpointProducts,
    fetcher
  );

  const { data: discountData, isLoading: discountLoading } = useSWR(
    endpointDiscount,
    fetcher
  );

  const products: ProductType[] = productsData?.data || [];

  useEffect(() => {
    if (discountData) {
      setDiscountName(discountData.data.discountName);
      setDiscountDescription(discountData.data.discountDescription);
      const apiDiscountType = discountData.data.discountType;
      const mappedDiscountType =
        discountTypeReverseMap[apiDiscountType] || apiDiscountType;
      setDiscountType(new Set([mappedDiscountType]));
      setDiscountValue(discountData.data.discountValue.toString());
      setDiscountCode(discountData.data.discountCode);
      setDiscountStartDate(discountData.data.discountStartDate.slice(0, 16));
      setDiscountEndDate(discountData.data.discountEndDate.slice(0, 16));
      setDiscountMaxUsers(discountData.data.discountMaxUsers.toString());
      setDiscountMaxPerUser(discountData.data.discountMaxPerUser.toString());
      setDiscountMinOrderValue(
        discountData.data.discountMinOrderValue.toString()
      );
      setDiscountIsActive(discountData.data.discountIsActive);
      const initialProductIds = discountData.data.products.map(
        (p: any) => p.id
      );
      setProductIds(new Set(initialProductIds));
      setSelectedProducts(
        discountData.data.products.map((p: any) => ({
          productId: p.id,
          productName: p.name,
          productThumb: p.thumb,
        }))
      );
    }
  }, [discountData]);

  useEffect(() => {
    if (discountName) {
      const code = discountName.toUpperCase().replace(/\s+/g, "").slice(0, 8);
      setDiscountCode(code);
    } else {
      setDiscountCode("");
    }
  }, [discountName]);

  useEffect(() => {
    const selectedIds = Array.from(productIds) as string[];
    const updatedSelectedProducts = products
      .filter((product) => selectedIds.includes(product.id))
      .map((product) => ({
        productId: product.id,
        productName: product.productName,
        productThumb: product.productThumb,
      }));
    setSelectedProducts(updatedSelectedProducts);
  }, [productIds, products]);

  const validateInputs = () => {
    const newErrors = { ...errors };

    newErrors.discountName = discountName.trim()
      ? ""
      : "Tên khuyến mãi là bắt buộc";
    newErrors.discountDescription = discountDescription.trim()
      ? ""
      : "Mô tả khuyến mãi là bắt buộc";
    newErrors.discountType = selectedDiscountType
      ? ""
      : "Loại khuyến mãi là bắt buộc";
    newErrors.discountValue =
      discountValue && Number(discountValue) > 0
        ? ""
        : "Giá trị khuyến mãi phải lớn hơn 0";
    newErrors.discountCode = discountCode.trim()
      ? ""
      : "Mã khuyến mãi là bắt buộc";
    newErrors.discountStartDate = discountStartDate
      ? ""
      : "Ngày bắt đầu là bắt buộc";
    newErrors.discountEndDate = discountEndDate
      ? ""
      : "Ngày kết thúc là bắt buộc";
    newErrors.discountMaxUsers =
      discountMaxUsers && Number(discountMaxUsers) >= 0
        ? ""
        : "Số lượng người dùng tối đa phải là số không âm";
    newErrors.discountMaxPerUser =
      discountMaxPerUser && Number(discountMaxPerUser) >= 0
        ? ""
        : "Số lần sử dụng tối đa mỗi người phải là số không âm";
    newErrors.discountMinOrderValue =
      discountMinOrderValue && Number(discountMinOrderValue) >= 0
        ? ""
        : "Giá trị đơn hàng tối thiểu phải là số không âm";
    newErrors.productIds =
      Array.from(productIds).length > 0 ? "" : "Phải chọn ít nhất một sản phẩm";

    if (discountStartDate && discountEndDate) {
      const start = new Date(discountStartDate);
      const end = new Date(discountEndDate);
      if (end < start) {
        newErrors.discountEndDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        setIsSubmitting(true);
        const startDate = new Date(discountStartDate);
        const endDate = new Date(discountEndDate);
        const selectedIds = Array.from(productIds) as string[];
        const allVariantIds: string[] = [];

        for (const productId of selectedIds) {
          try {
            const response =
              await ProductServices.getAllProductVariantsByProductId(productId);
            const variantIds = response.data.map((variant: any) =>
              variant.id.toString()
            );
            allVariantIds.push(...variantIds);
          } catch (error) {
            console.error(
              `Error fetching variants for product ${productId}:`,
              error
            );
            toast.error(`Không thể lấy variants cho sản phẩm ${productId}`);
            return;
          }
        }

        const payload: UpdateDiscountDto = {
          discountId: discountId,
          discountName,
          discountDescription,
          discountType:
            selectedDiscountType === "SỐ TIỀN" ? "AMOUNT" : "PERCENTAGE",
          discountValue: Number(discountValue),
          discountCode,
          discountStartDate: startDate.toISOString(),
          discountEndDate: endDate.toISOString(),
          discountMaxUsers: Number(discountMaxUsers),
          discountMaxPerUser: Number(discountMaxPerUser),
          discountMinOrderValue: Number(discountMinOrderValue),
          discountIsActive,
          productVariantIds: allVariantIds,
        };
        console.log("Update payload:", payload);
        await DiscountService.updateDiscount(payload);
        toast.success("Cập nhật khuyến mãi thành công!");
        handleClose();
        if (onUpdated) {
          onUpdated();
        }
      } catch (error: any) {
        toast.error("Cập nhật khuyến mãi thất bại. Vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setDiscountName("");
    setDiscountDescription("");
    setDiscountType(new Set([]));
    setDiscountValue("");
    setDiscountCode("");
    setDiscountStartDate("");
    setDiscountEndDate("");
    setDiscountMaxUsers("");
    setDiscountMaxPerUser("");
    setDiscountMinOrderValue("");
    setDiscountIsActive(true);
    setProductIds(new Set([]));
    setSelectedProducts([]);
    setErrors({
      discountName: "",
      discountDescription: "",
      discountType: "",
      discountValue: "",
      discountCode: "",
      discountStartDate: "",
      discountEndDate: "",
      discountMaxUsers: "",
      discountMaxPerUser: "",
      discountMinOrderValue: "",
      productIds: "",
    });
    onClose();
  };

  const handleRemoveProduct = (productId: string) => {
    setProductIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const renderError = (field: keyof typeof errors) =>
    errors[field] && (
      <span className="absolute bottom-[-20px] left-2 h-4 min-w-max text-sm text-error-600">
        {errors[field]}
      </span>
    );

  return (
    <Modal
      size="full"
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
        <ModalHeader className="w-full rounded-t-xl border">
          <div className="border-b--b-primary h-11 w-11 content-center rounded-lg border-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx-auto size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5zm-15 0h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5z"
              />
            </svg>
          </div>
          <div className="ml-5">
            <div className="text-lg font-semibold">Cập nhật khuyến mãi</div>
            <div className="text-wrap text-sm font-normal">
              Cập nhật thông tin chương trình khuyến mãi
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-row gap-6">
            <div className="flex flex-col gap-7 w-[70%]">
              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-name-label"
                    className="text-sm font-medium text-black"
                  >
                    Tên khuyến mãi<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="text"
                    className="w-full rounded-lg border-2"
                    value={discountName}
                    onChange={(e) => setDiscountName(e.target.value)}
                    aria-labelledby="discount-name-label"
                  />
                  {renderError("discountName")}
                </div>
              </div>

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-description-label"
                    className="text-sm font-medium text-black"
                  >
                    Mô tả khuyến mãi<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="text"
                    className="w-full rounded-lg border-2"
                    value={discountDescription}
                    onChange={(e) => setDiscountDescription(e.target.value)}
                    aria-labelledby="discount-description-label"
                  />
                  {renderError("discountDescription")}
                </div>
              </div>

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-type-label"
                    className="text-sm font-medium text-black"
                  >
                    Loại khuyến mãi<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Select
                    className="max-w-xs"
                    placeholder="Chọn loại khuyến mãi"
                    selectedKeys={discountType}
                    onSelectionChange={setDiscountType}
                    disallowEmptySelection
                    color="default"
                    variant="bordered"
                    aria-labelledby="discount-type-label"
                    popoverProps={{
                      classNames: {
                        content:
                          "bg-white border border-gray-300 shadow-lg rounded-lg border-2",
                      },
                    }}
                  >
                    {discountTypes.map((type) => (
                      <SelectItem key={type.key} textValue={type.label}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {renderError("discountType")}
                </div>
              </div>

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-value-label"
                    className="text-sm font-medium text-black"
                  >
                    Giá trị khuyến mãi<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="number"
                    className="w-full rounded-lg border-2"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    endContent={
                      <span className="text-sm text-gray-500">
                        {discountTypeMap[selectedDiscountType] || "VNĐ"}
                      </span>
                    }
                    aria-labelledby="discount-value-label"
                  />
                  {renderError("discountValue")}
                </div>
              </div>

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-code-label"
                    className="text-sm font-medium text-black"
                  >
                    Mã khuyến mãi<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="text"
                    className="w-full rounded-lg border-2"
                    value={discountCode}
                    readOnly
                    aria-labelledby="discount-code-label"
                  />
                  {renderError("discountCode")}
                </div>
              </div>

              <Divider />

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-time-label"
                    className="text-sm font-medium text-black"
                  >
                    Thời gian<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative flex basis-[70%] gap-4">
                  <div className="relative w-1/2">
                    <Input
                      type="datetime-local"
                      className="w-full rounded-lg border-2"
                      value={discountStartDate}
                      onChange={(e) => setDiscountStartDate(e.target.value)}
                      aria-labelledby="discount-time-label"
                    />
                    {renderError("discountStartDate")}
                  </div>
                  <div className="relative w-1/2">
                    <Input
                      type="datetime-local"
                      className="w-full rounded-lg border-2"
                      value={discountEndDate}
                      onChange={(e) => setDiscountEndDate(e.target.value)}
                      aria-labelledby="discount-time-label"
                    />
                    {renderError("discountEndDate")}
                  </div>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-max-users-label"
                    className="text-sm font-medium text-black"
                  >
                    Số lượng người dùng tối đa
                    <span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="number"
                    className="w-full rounded-lg border-2"
                    placeholder="Số người dùng tối đa"
                    value={discountMaxUsers}
                    onChange={(e) => setDiscountMaxUsers(e.target.value)}
                    aria-labelledby="discount-max-users-label"
                  />
                  {renderError("discountMaxUsers")}
                </div>
              </div>

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-max-per-user-label"
                    className="text-sm font-medium text-black"
                  >
                    Số lần sử dụng mỗi người
                    <span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="number"
                    className="w-full rounded-lg border-2"
                    placeholder="Số lần dùng/người"
                    value={discountMaxPerUser}
                    onChange={(e) => setDiscountMaxPerUser(e.target.value)}
                    aria-labelledby="discount-max-per-user-label"
                  />
                  {renderError("discountMaxPerUser")}
                </div>
              </div>

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-min-order-value-label"
                    className="text-sm font-medium text-black"
                  >
                    Giá trị đơn hàng tối thiểu
                    <span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="number"
                    className="w-full rounded-lg border-2"
                    placeholder="Đơn hàng tối thiểu"
                    value={discountMinOrderValue}
                    onChange={(e) => setDiscountMinOrderValue(e.target.value)}
                    endContent={
                      <span className="text-sm text-gray-500">VNĐ</span>
                    }
                    aria-labelledby="discount-min-order-value-label"
                  />
                  {renderError("discountMinOrderValue")}
                </div>
              </div>

              <Divider />

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-is-active-label"
                    className="text-sm font-medium text-black"
                  >
                    Trạng thái
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Checkbox
                    isSelected={discountIsActive}
                    onValueChange={setDiscountIsActive}
                    aria-labelledby="discount-is-active-label"
                  >
                    Kích hoạt
                  </Checkbox>
                </div>
              </div>

              <Divider />

              <div className="flex flex-row">
                <div className="basis-[30%]">
                  <span
                    id="discount-product-ids-label"
                    className="text-sm font-medium text-black"
                  >
                    Sản phẩm áp dụng<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Select
                    selectionMode="multiple"
                    className="w-full rounded-lg border-2 max-h-[100px] overflow-y-auto flex-wrap"
                    placeholder="Chọn sản phẩm"
                    selectedKeys={productIds}
                    onSelectionChange={setProductIds}
                    variant="flat"
                    isLoading={productsLoading}
                    aria-labelledby="discount-product-ids-label"
                    popoverProps={{
                      classNames: {
                        content:
                          "bg-white border border-gray-300 shadow-lg line-clamp-1",
                      },
                    }}
                  >
                    {products.map((product: ProductType) => (
                      <SelectItem
                        key={product.id}
                        textValue={product.productName}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={product.productThumb}
                            alt={product.productName}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                          <span>{product.productName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                  {renderError("productIds")}
                </div>
              </div>
            </div>

            <div className="w-[30%]">
              <SelectedProductsTable
                selectedProductIds={productIds}
                products={selectedProducts}
                onRemoveProduct={handleRemoveProduct}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full flex-row justify-between space-x-6">
            <Button
              onPress={handleClose}
              className="w-1/2 rounded-lg border border-outline bg-white py-2 text-[16px] font-medium text-black hover:bg-highlight"
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              className="w-1/2 rounded-lg border border-outline bg-on-primary py-2 text-[16px] font-medium text-black"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật khuyến mãi"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateDiscountModal;
