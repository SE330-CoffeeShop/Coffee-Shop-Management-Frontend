"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { ProductType } from "@/types/product.type";
import { ProductCategoryType } from "@/types/product.category.type";
import axios from "@/lib/axiosInstance";
import { ProductCard, SearchBar } from "@/components";
import ButtonSolid from "@/components/Button/ButtonSolid";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useDisclosure } from "@heroui/react";
import { Button } from "@heroui/react";
import AddProductModal from "@/app/admin/drinks/AddProduct.modal";

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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productCategories, setProductCategories] = useState<
    ProductCategoryType[]
  >([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const rowsPerPage = 12;
  const endpointProductCategories = `/product-category/all?page=1&limit=100`;
  const endpointProducts = useMemo(
    () =>
      selectedCategory
        ? `/product/by-category/${selectedCategory}?page=${page}&limit=${rowsPerPage}`
        : `/product/all?page=${page}&limit=${rowsPerPage}`,
    [selectedCategory, page, rowsPerPage]
  );

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
    mutate: mutateProducts,
  } = useSWR(endpointProducts, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useSWR(endpointProductCategories, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

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

  const filteredProducts = useMemo(() => {
    if (!searchKeyword) return products;
    return products.filter((product) =>
      product.productName.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [products, searchKeyword]);

  const debouncedSearch = useCallback(
    debounce((keyword: string) => {
      setSearchKeyword(keyword);
      setPage(1);
    }, 300),
    []
  );

  const handleSearch = (keyword: string) => {
    debouncedSearch(keyword);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalProducts / rowsPerPage);

  return (
    <main className="flex w-full min-h-screen bg-secondary-100 p-4">
      <div className="flex flex-col w-full">
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
            <ButtonSolid
              content="Thêm vào giỏ hàng"
              className="px-4 py-2 bg-primary-500 text-primary-0 rounded-xl hover:bg-primary-600 transition sm:line-clamp-1"
              onClick={onOpen}
            />
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
            <div className="grid xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelected={() => {}}
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
      <AddProductModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        onCreated={() => mutateProducts()}/>
    </main>
  );
};

export default Drinks;
