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
} from "@heroui/react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { Key, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { columns, statusOptions } from "@/data/discount.data";
import { DiscountDto } from "@/types/discount.type";
import { AppContext } from "@/contexts";
import { AuthType } from "@/types/auth.type";
import { DiscountDetailDisplay } from "@/components";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Discounts = () => {
  const [discounts, setDiscounts] = useState<DiscountDto[]>([]);
  const [totalDiscounts, setTotalDiscounts] = useState<number>(0);
  const [filterDiscountName, setFilterDiscountName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { auth } = useContext(AppContext) as AuthType;
  const { branchId } = auth || {};

  const endpointDiscounts = useMemo(() => {
    if (!branchId) return null;
    const params = new URLSearchParams({
      page: page.toString(),
      limit: rowsPerPage.toString(),
    });
    // if (filterDiscountName) params.append("name", filterDiscountName); // Changed to 'name' instead of 'discountName'
    return `/discount/branch/${branchId}?${params.toString()}`;
  }, [branchId, page, filterDiscountName]);

  const {
    data: discountsData,
    error: discountsError,
    isLoading: discountsLoading,
  } = useSWR(endpointDiscounts, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (discountsError) {
      setDiscounts([]);
      setTotalDiscounts(0);
      toast.error("Lỗi khi tải danh sách khuyến mãi.");
    } else if (discountsData?.data) {
      let filteredData = discountsData.data;
      const now = new Date();
      if (selectedStatus === "ACTIVE") {
        filteredData = filteredData.filter(
          (d: DiscountDto) =>
            d.discountIsActive &&
            new Date(d.discountStartDate) <= now &&
            new Date(d.discountEndDate) >= now
        );
      } else if (selectedStatus === "INACTIVE") {
        filteredData = filteredData.filter(
          (d: DiscountDto) =>
            !d.discountIsActive ||
            new Date(d.discountStartDate) > now ||
            new Date(d.discountEndDate) < now
        );
      }
      setDiscounts(filteredData);
      setTotalDiscounts(discountsData.paging?.total || 0);
    }
  }, [discountsData, discountsError, selectedStatus]);

  const pages = useMemo(() => {
    return totalDiscounts ? Math.ceil(totalDiscounts / rowsPerPage) : 0;
  }, [totalDiscounts]);

  const loadingState =
    discountsLoading || discounts.length === 0 ? "loading" : "idle";

  const handleFilterStatus = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleSearchDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDiscountName(e.target.value);
    setPage(1);
  };

  const selectedDiscount = discounts.find((d) => d.id === selectedDiscountId);

  const renderCell = useCallback(
    (discount: DiscountDto, columnKey: Key, index: number): React.ReactNode => {
      const cellValue = discount[columnKey as keyof DiscountDto];

      switch (columnKey) {
        case "index":
          return (
            <span className="text-sm font-medium text-gray-700">
              {index + 1 + (page - 1) * rowsPerPage}
            </span>
          );
        case "discountName":
          return <span className="text-sm text-gray-900">{cellValue}</span>;
        case "discountDescription":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "discountMaxUsers":
          return <span className="text-sm text-gray-900">{cellValue}</span>;
        case "discountStartDate":
          return (
            <span className="text-sm text-gray-600">
              {new Date(cellValue as string).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          );
        case "discountEndDate":
          return (
            <span className="text-sm text-gray-600">
              {new Date(cellValue as string).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          );
        case "actions":
          return (
            <div className="flex items-center justify-center">
              <Tooltip
                content="Xem chi tiết"
                className="bg-primary-700 text-white px-2 py-1 rounded-md text-xs"
              >
                <span
                  className="cursor-pointer text-primary-700 hover:text-primary-500 transition-colors"
                  onClick={() => setSelectedDiscountId(discount.id)}
                >
                  <EyeIcon className="size-5" />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue?.toString();
      }
    },
    [page]
  );

  return (
    <main className="flex w-full min-h-screen gap-4 bg-gray-50 p-6">
      <div className="flex h-full w-full gap-4">
        {/* Discounts Table (70%) */}
        <div className="flex flex-col basis-[70%]">
          <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách khuyến mãi
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  className="bg-white w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
                  variant="bordered"
                  size="md"
                  placeholder="Tìm theo tên khuyến mãi"
                  startContent={
                    <MagnifyingGlassIcon className="size-5 text-gray-400" />
                  }
                  value={filterDiscountName}
                  onChange={handleSearchDiscount}
                />
              </div>
            </div>
            {/* Status Chips */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Chip
                  key={status.uid}
                  className={`capitalize cursor-pointer font-medium px-3 py-1 transition-all duration-200 ${
                    selectedStatus === status.uid
                      ? "text-primary-700 border-b-2 border-primary-700 border-t-transparent border-l-transparent border-r-transparent"
                      : "text-gray-700 hover:text-primary-400"
                  }`}
                  size="md"
                  radius="sm"
                  onClick={() => handleFilterStatus(status.uid)}
                >
                  {status.name}
                </Chip>
              ))}
            </div>
            {/* Table Rendering */}
            <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm">
              <Table
                aria-label="Bảng danh sách khuyến mãi"
                className="h-full w-full"
                shadow="none"
                selectionMode="none"
              >
                <TableHeader>
                  {columns.map((column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                      allowsSorting={column.sortable}
                      className="text-sm font-semibold text-gray-700 bg-gray-100"
                    >
                      {column.name}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody
                  items={discounts}
                  emptyContent={
                    <div className="text-gray-500 text-center py-4">
                      Không có khuyến mãi nào.
                    </div>
                  }
                  loadingContent={<Spinner className="mx-auto my-4" />}
                  loadingState={loadingState}
                >
                  {(item: DiscountDto) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {(columnKey: Key) => (
                        <TableCell className="py-3">
                          {renderCell(item, columnKey, discounts.indexOf(item))}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            {pages > 0 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                  className="bg-white rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
        {/* Discount Details (30%) */}
        <div className="flex flex-col basis-[30%] bg-white p-6 rounded-2xl shadow-lg h-full">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Chi tiết khuyến mãi
          </h3>
          {selectedDiscountId && selectedDiscount ? (
            <DiscountDetailDisplay discount={selectedDiscount} />
          ) : (
            <p className="text-gray-500 text-sm flex-grow">
              Chọn một khuyến mãi để xem chi tiết.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Discounts;