"use client";

import { useEffect, useState, useCallback, useMemo, useContext } from "react";
import useSWR from "swr";
import { ProductType } from "@/types/product.type";
import { ProductCategoryType } from "@/types/product.category.type";
import axios from "@/lib/axiosInstance";
import { ProductCard, SearchBar } from "@/components";
import ButtonSolid from "@/components/Button/ButtonSolid";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useDisclosure } from "@heroui/react";
import AddProductToCartModal from "@/app/employee/drinks/AddProductToCart.modal";
import { toast } from "react-toastify";
import CartContext from "@/contexts/CartContext";
import { CartContextType, CartItem } from "@/types/cart.type";
import { applyDiscountToCart } from "@/services/employee.services/CartServices";
import CartItemComponent from "@/components/CartItem/CartItem";
import { useRouter } from "next/navigation";
import { AppContext } from "@/contexts";
import { AuthType } from "@/types/auth.type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Drinks = () => {
  const router = useRouter();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    discount,
    setDiscount,
    tax,
    finalTotal,
  } = useContext(CartContext) as CartContextType;
  const { auth } = useContext(AppContext) as AuthType;

  //! CONTROL Add Product To Cart modal
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  const handleOpenAddProductToCartModal = (product: ProductType) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleCloseAddProductToCartModal = () => {
    onClose();
    setSelectedProduct(null);
  };

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productCategories, setProductCategories] = useState<
    ProductCategoryType[]
  >([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const rowsPerPage = 6;
  const endpointProductCategories = `/product-category/all?page=1&limit=100`;
  const endpointProducts = useMemo(
    () =>
      selectedCategory
        ? `/product/by-category/${selectedCategory}?page=${page}&limit=${rowsPerPage}`
        : `/product/all?page=${page}&limit=${rowsPerPage}`,
    [selectedCategory, page, rowsPerPage]
  );

  // Fetch sản phẩm
  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
    mutate: refreshEndpoint,
  } = useSWR(endpointProducts, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  // Fetch danh mục
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useSWR(endpointProductCategories, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  // Cập nhật sản phẩm và danh mục
  useEffect(() => {
    if (productsError) {
      setProducts([]);
      setTotalProducts(0);
    } else if (productsData?.data) {
      setProducts(productsData.data);
      setTotalProducts(productsData.paging.total);
    }

    if (categoriesError) {
      setProductCategories([]);
    } else if (categoriesData?.data) {
      setProductCategories(categoriesData.data);
    }
  }, [productsData, productsError, categoriesData, categoriesError]);

  // Lọc sản phẩm theo searchKeyword
  const filteredProducts = useMemo(() => {
    if (!searchKeyword) return products;
    return products.filter((product) =>
      product.productName.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [products, searchKeyword]);

  // Debounce tìm kiếm
  const debouncedSearch = useCallback(
    debounce((keyword: string) => {
      setSearchKeyword(keyword);
      setPage(1); // Reset trang khi tìm kiếm
    }, 300),
    []
  );

  const handleSearch = (keyword: string) => {
    debouncedSearch(keyword);
  };

  // Xử lý chọn danh mục
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1); // Reset trang khi chọn danh mục
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Gọi đến parent
  const handleCallParent = () => {
    toast.success("Chọn sản phẩm thành công!");
    refreshEndpoint();
  };

  const handleUpdateQuantity = (item: CartItem, newQuantity: string) => {
    const num = parseInt(newQuantity);
    if (!isNaN(num) && num >= 1) {
      updateQuantity(item.id, item.productVariant, num);
    } else if (newQuantity === "") {
      return;
    } else {
      removeFromCart(item.id, item.productVariant);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống, không thể thanh toán!");
      return;
    }
    toast.info("Chuyển hướng đến trang thanh toán...");
    router.push("/employee/payment-order");
  };

  const handleDiscountWrapper = () => {
    handleDiscount(cartItems);
  };

  const handleDiscount = async (cartItems: CartItem[]) => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống, không thể áp dụng khuyến mãi!");
      return;
    }

    try {
      const cartDetails = cartItems.map((item) => ({
        variantId: item.productVariant,
        cartDetailQuantity: item.quantity,
      }));

      const cartDetailsProps = {
        cartDetails: cartDetails,
      };

      console.log("Applying discount with cart details:", cartDetailsProps);
      console.log("User ID for discount:", auth.id);

      const discountAmount = await applyDiscountToCart(cartDetailsProps, auth.id);

      setDiscount(discountAmount);
      toast.success(
        `Áp dụng khuyến mãi thành công: ${discount.toLocaleString("vi-VN")} VNĐ`
      );
    } catch (error: any) {
      console.error("Discount API error:", error);
      toast.error("Lỗi khi áp dụng khuyến mãi. Vui lòng thử lại.");
    }
  };

  const totalPages = Math.ceil(totalProducts / rowsPerPage);

  return (
    <main className="flex w-full min-h-screen gap-2 bg-secondary-100">
      <div className="flex h-full w-full">
        <div className="flex flex-col basis-[70%] p-4 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Danh sách thức uống
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="p-2 border rounded-md w-full sm:w-48"
                disabled={categoriesLoading || categoriesError}
              >
                <option value="">Tất cả danh mục</option>
                {productCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <div className="mt-4">
            {productsLoading || categoriesLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : productsError || categoriesError ? (
              <div className="text-red-500">
                Lỗi khi tải dữ liệu. Vui lòng thử lại.
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-gray-500">Không tìm thấy sản phẩm</div>
            ) : (
              <div className="grid xsm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelected={handleOpenAddProductToCartModal}
                  />
                ))}
              </div>
            )}
          </div>
          {totalProducts > 0 && (
            <div className="sticky bottom-0 bg-secondary-100 py-4 flex justify-between items-center mt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Trang {page} / {totalPages} ({totalProducts} sản phẩm)
              </div>
              <div className="space-x-2 flex xsm:flex-col xsm:space-x-0 xsm:gap-2 sm:flex-row">
                <ButtonSolid
                  content="Trang trước"
                  iconLeft={<IoIosArrowBack />}
                  isDisabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 w-[150px] bg-gray-200 text-gray-800 rounded disabled:opacity-50 text-base-regular"
                />
                <ButtonSolid
                  content="Trang sau"
                  iconRight={<IoIosArrowForward />}
                  isDisabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 w-[150px] bg-gray-200 text-gray-800 rounded disabled:opacity-50 text-base-regular"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col basis-[30%] bg-white p-4 shadow-md rounded-md h-full">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Giỏ hàng
          </h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 flex-grow">Giỏ hàng trống</p>
          ) : (
            <div className="flex flex-col h-full gap-4">
              <div className="flex-grow">
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={`${item.id}-${item.productVariant}`}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={() =>
                      removeFromCart(item.id, item.productVariant)
                    }
                  />
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-900">Tạm tính:</span>
                  <span className="text-sm text-secondary-900">
                    {totalPrice.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-900">
                    Khuyến mãi:
                  </span>
                  <span className="text-sm text-green-600">
                    -{discount.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-900">Thuế (5%):</span>
                  <span className="text-sm text-secondary-900">
                    {tax.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-base font-semibold text-secondary-900">
                    Tổng tiền:
                  </span>
                  <span className="text-base font-semibold text-primary-700">
                    {finalTotal.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <ButtonSolid
                    content="Áp dụng khuyến mãi"
                    onClick={handleDiscountWrapper}
                    isDisabled={cartItems.length === 0}
                    className="flex-1 px-4 py-2 bg-primary-500 text-secondary-100 rounded-sm disabled:opacity-50 text-base-semibold"
                  />
                  <ButtonSolid
                    content="Thanh toán"
                    onClick={handleCheckout}
                    isDisabled={cartItems.length === 0}
                    className="flex-1 px-4 py-2 bg-primary-700 text-secondary-100 rounded-sm disabled:opacity-50 text-base-semibold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpen && selectedProduct && (
        <AddProductToCartModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          onClose={handleCloseAddProductToCartModal}
          onCallParent={handleCallParent}
          product={selectedProduct}
        />
      )}
    </main>
  );
};

export default Drinks;
