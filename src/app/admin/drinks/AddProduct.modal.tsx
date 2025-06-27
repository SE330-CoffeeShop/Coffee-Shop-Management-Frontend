"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
} from "@heroui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ProductAdminServices from "@/services/admin.services/ProductServices";
import useSWR from "swr";
import { Ingredient } from "@/types/ingredient.type";
import { ProductCategoryType } from "@/types/product.category.type";
import { CreateProductDto } from "@/types/product.type";
import axiosInstance from "@/lib/axiosInstance";

interface IngredientEntry {
  ingredientId: string;
  quantity: number;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [phase, setPhase] = useState(1);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [drink, setDrink] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([]);
  const [errors, setErrors] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productCategory: "",
    ingredients: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categoriesData, error: categoriesError } = useSWR(
    "/product-category/all?limit=100",
    fetcher
  );
  const { data: ingredientsData, error: ingredientsError } = useSWR(
    "/ingredient/all?limit=200",
    fetcher
  );

  useEffect(() => {
    if (categoriesError) toast.error("Lỗi khi tải danh sách danh mục.");
    if (ingredientsError) toast.error("Lỗi khi tải danh sách nguyên liệu.");
  }, [categoriesError, ingredientsError]);

  const validatePhase1 = () => {
    const newErrors = {
      productName: productName.trim() ? "" : "Tên sản phẩm là bắt buộc",
      productDescription: productDescription.trim()
        ? ""
        : "Mô tả sản phẩm là bắt buộc",
      productPrice:
        productPrice && Number(productPrice) > 0
          ? ""
          : "Giá sản phẩm phải là số dương",
      productCategory: productCategory ? "" : "Danh mục sản phẩm là bắt buộc",
      ingredients: "",
      image: image ? "" : "Hình ảnh sản phẩm là bắt buộc",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const validatePhase2 = () => {
    const hasValidIngredients = ingredients.every(
      (ing) => ing.ingredientId && ing.quantity > 0
    );
    const newErrors = {
      ...errors,
      ingredients:
        ingredients.length > 0 && hasValidIngredients
          ? ""
          : "Phải chọn ít nhất một nguyên liệu hợp lệ",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Hình ảnh không được vượt quá 5MB",
        }));
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredientId: "", quantity: 0 }]);
  };

  const updateIngredient = (
    index: number,
    field: "ingredientId" | "quantity",
    value: string | number
  ) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const deleteIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (phase === 1) {
      if (validatePhase1()) {
        setPhase(2);
      }
      return;
    }

    if (!validatePhase2()) return;

    try {
      setIsSubmitting(true);
      const productIngredients = ingredients.reduce((acc, ing) => {
        if (ing.ingredientId && ing.quantity > 0) {
          acc[ing.ingredientId] = ing.quantity;
        }
        return acc;
      }, {} as { [key: string]: number });

      const payload: CreateProductDto = {
        productName,
        productDescription,
        productPrice: Number(productPrice),
        productCategory,
        productIngredients,
        drink,
        image: image || undefined,
      };

      console.log("Submitting product data:", payload);

      await ProductAdminServices.createProduct(payload);
      toast.success("Tạo sản phẩm thành công!");
      handleClose();
      if (onCreated) onCreated();
    } catch (error: any) {
      toast.error("Tạo sản phẩm thất bại. Vui lòng thử lại.");
      toast.error(error?.response?.data?.message || "Lỗi không xác định");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductCategory("");
    setDrink(false);
    setImage(null);
    setImagePreview(null);
    setIngredients([]);
    setErrors({
      productName: "",
      productDescription: "",
      productPrice: "",
      productCategory: "",
      ingredients: "",
      image: "",
    });
    setPhase(1);
    onClose();
  };

  const availableIngredients = (currentIndex: number) =>
    ingredientsData?.data.filter(
      (ing: Ingredient) =>
        !ingredients.some(
          (i, idx) => i.ingredientId === ing.id && idx !== currentIndex
        )
    ) || [];

  return (
    <Modal
      size="4xl"
      isOpen={isOpen}
      onOpenChange={onClose}
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-5">
            <div className="text-lg font-semibold">Thêm sản phẩm mới</div>
            <div className="text-wrap text-sm font-normal">
              Nhập thông tin để tạo sản phẩm mới
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          {phase === 1 ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-4">
                <div className="basis-[30%]">
                  <span className="text-sm-semibold text-black">
                    Tên sản phẩm<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="text"
                    className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Nhập tên sản phẩm"
                    aria-label="Tên sản phẩm"
                  />
                  {errors.productName && (
                    <span className="absolute bottom-[-20px] left-2 text-sm text-error-600">
                      {errors.productName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="basis-[30%]">
                  <span className="text-sm-semibold text-black">
                    Mô tả sản phẩm<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="text"
                    className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Nhập mô tả sản phẩm"
                    aria-label="Mô tả sản phẩm"
                  />
                  {errors.productDescription && (
                    <span className="absolute bottom-[-20px] left-2 text-sm text-error-600">
                      {errors.productDescription}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="basis-[30%]">
                  <span className="text-sm-semibold text-black">
                    Giá sản phẩm<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="number"
                    className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="Nhập giá sản phẩm"
                    min="0"
                    aria-label="Giá sản phẩm"
                  />
                  {errors.productPrice && (
                    <span className="absolute bottom-[-20px] left-2 text-sm text-error-600">
                      {errors.productPrice}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="basis-[30%]">
                  <span className="text-sm-semibold text-black">
                    Danh mục<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Select
                    className="w-full rounded-lg border-gray-300 shadow-sm"
                    placeholder="Chọn danh mục"
                    selectedKeys={productCategory ? [productCategory] : []}
                    popoverProps={{
                      classNames: {
                        content:
                          "bg-white border border-gray-300 shadow-lg rounded-lg border-2",
                      },
                    }}
                    onChange={(e) => setProductCategory(e.target.value)}
                    aria-label="Danh mục sản phẩm"
                  >
                    {categoriesData?.data.map(
                      (category: ProductCategoryType) => (
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
                  {errors.productCategory && (
                    <span className="absolute bottom-[-20px] left-2 text-sm text-error-600">
                      {errors.productCategory}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="basis-[30%]">
                  <span className="text-sm-semibold text-black">Thức uống</span>
                </div>
                <div className="relative basis-[70%]">
                  <Checkbox
                    isSelected={drink}
                    onChange={(e) => setDrink(e.target.checked)}
                    aria-label="Thức uống"
                  >
                    Là thức uống
                  </Checkbox>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="basis-[30%]">
                  <span className="text-sm-semibold text-black">
                    Hình ảnh<span className="text-error-600">*</span>
                  </span>
                </div>
                <div className="relative basis-[70%]">
                  <Input
                    type="file"
                    accept="image/*"
                    className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                    onChange={handleImageChange}
                    aria-label="Hình ảnh sản phẩm"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="mt-2 h-24 w-24 object-cover rounded-md"
                    />
                  )}
                  {errors.image && (
                    <span className="absolute bottom-[-20px] left-2 text-sm text-error-600">
                      {errors.image}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="text-sm-semibold text-black">
                Chọn nguyên liệu
              </div>
              {ingredients.map((ing, index) => (
                <div key={index} className="flex flex-row items-center gap-4">
                  <div className="basis-[50%]">
                    <Select
                      className="w-full rounded-lg border-gray-300 shadow-sm"
                      placeholder="Chọn nguyên liệu"
                      selectedKeys={ing.ingredientId ? [ing.ingredientId] : []}
                      onChange={(e) =>
                        updateIngredient(index, "ingredientId", e.target.value)
                      }
                      popoverProps={{
                        classNames: {
                          content:
                            "bg-white border border-gray-300 shadow-lg rounded-lg border-2",
                        },
                      }}
                      aria-label={`Nguyên liệu ${index + 1}`}
                    >
                      {availableIngredients(index).map(
                        (ingredient: Ingredient) => (
                          <SelectItem
                            key={ingredient.id}
                            textValue={ingredient.ingredientName}
                            className="bg-white"
                          >
                            {ingredient.ingredientName}
                          </SelectItem>
                        )
                      )}
                    </Select>
                  </div>
                  <div className="basis-[30%]">
                    <Input
                      type="number"
                      className="w-full rounded-lg border-secondary-200 shadow-sm border-2"
                      placeholder="Số lượng (g/ml)"
                      value={ing.quantity.toString()}
                      onChange={(e) =>
                        updateIngredient(
                          index,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      aria-label={`Số lượng nguyên liệu ${index + 1}`}
                    />
                  </div>
                  <div className="basis-[20%]">
                    <Button
                      isIconOnly
                      color="danger"
                      onClick={() => deleteIngredient(index)}
                      className="text-danger-600 hover:text-danger-700"
                      aria-label={`Xóa nguyên liệu ${index + 1}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
              {errors.ingredients && (
                <span className="text-sm text-error-600">
                  {errors.ingredients}
                </span>
              )}
              <Button
                isIconOnly
                color="primary"
                onClick={addIngredient}
                className="w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700"
                aria-label="Thêm nguyên liệu"
              >
                <PlusIcon className="h-5 w-5" />
              </Button>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full flex-row justify-between space-x-6">
            {phase === 2 && (
              <Button
                onPress={() => setPhase(1)}
                className="w-1/2 rounded-lg border border-outline bg-white py-2 text-[16px] font-medium text-black hover:bg-gray-100"
                aria-label="Quay lại"
              >
                Quay lại
              </Button>
            )}
            <Button
              color="primary"
              onPress={handleSubmit}
              className="w-1/2 rounded-lg border border-outline bg-primary-600 text-base-semibold text-secondary-100 hover:bg-primary-700"
              isDisabled={isSubmitting}
              aria-label={phase === 1 ? "Tiếp theo" : "Tạo sản phẩm"}
            >
              {isSubmitting
                ? "Đang tạo..."
                : phase === 1
                ? "Tiếp theo"
                : "Tạo sản phẩm"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;
