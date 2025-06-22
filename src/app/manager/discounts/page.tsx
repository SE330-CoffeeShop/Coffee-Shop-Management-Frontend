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
} from "@heroui/react";
import { EyeIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, {
  Key,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { columns, statusOptions } from "@/data/discount.data";
import { DiscountDto, DiscountListResponse } from "@/types/discount.type";
import { AppContext } from "@/contexts";
import { AuthType } from "@/types/auth.type";
import { ButtonSolid, DiscountDetailDisplay } from "@/components";
import { useDisclosure } from "@heroui/react";
import AddDiscountModal from "@/app/manager/discounts/AddDiscount.modal";
import UpdateDiscountModal from "@/app/manager/discounts/UpdateDiscount.modal";
import ConfirmDeleteModal from "@/app/manager/discounts/ConfirmDeleteDiscount.modal";
import DiscountService from "@/services/manager.services/DiscountServices";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Discounts = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange, onClose: onAddClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onOpenChange: onUpdateOpenChange, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();
  const [discounts, setDiscounts] = useState<DiscountListResponse[]>([]);
  const [totalDiscounts, setTotalDiscounts] = useState<number>(0);
  const [filterDiscountName, setFilterDiscountName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(null);
  const [selectedDiscountIdForUpdate, setSelectedDiscountIdForUpdate] = useState<string | null>(null);
  const [selectedDiscountIdForDelete, setSelectedDiscountIdForDelete] = useState<string | null>(null);
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
    return `/discount/branch/${branchId}?${params.toString()}`;
  }, [branchId, page, filterDiscountName]);

  const {
    data: discountsData,
    error: discountsError,
    isLoading: discountsLoading,
    mutate,
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
      console.log("Discounts Data:", filteredData);
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

  const handleOpenUpdateModal = (discountId: string) => {
    setSelectedDiscountIdForUpdate(discountId);
    onUpdateOpen();
  };

  const handleOpenDeleteModal = (discountId: string) => {
    setSelectedDiscountIdForDelete(discountId);
    onDeleteOpen();
  };

  const handleDeleteDiscount = async () => {
    if (selectedDiscountIdForDelete) {
      console.log("Deleting discount with ID:", selectedDiscountIdForDelete);
      try {
        await DiscountService.deleteDiscount(selectedDiscountIdForDelete);
        toast.success("Xóa khuyến mãi thành công!");
        mutate();
        onDeleteClose();
      } catch (error) {
        toast.error("Xóa khuyến mãi thất bại. Vui lòng thử lại.");
      }
    }
  };

  const renderCell = useCallback(
    (discount: DiscountListResponse, columnKey: Key, index: number): React.ReactNode => {
      const cellValue = discount[columnKey as keyof DiscountListResponse];

      switch (columnKey) {
        case "index":
          return (
            <span className="text-sm font-medium text-gray-700">
              {index + 1 + (page - 1) * rowsPerPage}
            </span>
          );
        case "discountName":
          return (
            <span className="text-sm text-gray-900">
              {Array.isArray(cellValue)
                ? cellValue.map((item, idx) => (
                    <span key={idx} className="block">
                      {JSON.stringify(item)}
                    </span>
                  ))
                : cellValue}
            </span>
          );
        case "discountDescription":
          return (
            <span className="text-sm text-gray-600">
              {Array.isArray(cellValue)
                ? cellValue.map((item, idx) => (
                    <span key={idx} className="block">
                      {JSON.stringify(item)}
                    </span>
                  ))
                : cellValue}
            </span>
          );
        case "discountMaxUsers":
          return (
            <span className="text-sm text-gray-900">
              {Array.isArray(cellValue)
                ? cellValue.map((item, idx) => (
                    <span key={idx} className="block">
                      {JSON.stringify(item)}
                    </span>
                  ))
                : cellValue}
            </span>
          );
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
            <div className="flex items-center justify-center gap-2">
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
              <Tooltip
                content="Cập nhật"
                className="bg-primary-700 text-white px-2 py-1 rounded-md text-xs"
              >
                <span
                  className="cursor-pointer text-primary-700 hover:text-primary-500 transition-colors"
                  onClick={() => handleOpenUpdateModal(discount.id)}
                >
                  <PencilIcon className="size-5" />
                </span>
              </Tooltip>
              <Tooltip
                content="Xóa"
                className="bg-primary-700 text-white px-2 py-1 rounded-md text-xs"
              >
                <span
                  className="cursor-pointer text-primary-700 hover:text-primary-500 transition-colors"
                  onClick={() => handleOpenDeleteModal(discount.id)}
                >
                  <TrashIcon className="size-5" />
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

                <ButtonSolid
                  content="Thêm khuyến mãi"
                  className="px-4 py-2 bg-primary-500 text-primary-0 rounded-xl hover:bg-primary-600 transition sm:line-clamp-1"
                  onClick={onAddOpen}
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
                  {(item: DiscountListResponse) => (
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
      {/* Add Discount Modal */}
      {branchId && (
        <AddDiscountModal
          isOpen={isAddOpen}
          onOpenChange={onAddOpenChange}
          onClose={onAddClose}
          branchId={branchId}
          onCreated={() => mutate()}
        />
      )}
      {/* Update Discount Modal */}
      {branchId && selectedDiscountIdForUpdate && (
        <UpdateDiscountModal
          isOpen={isUpdateOpen}
          onOpenChange={onUpdateOpenChange}
          onClose={onUpdateClose}
          branchId={branchId}
          discountId={selectedDiscountIdForUpdate}
          onUpdated={() => mutate()}
        />
      )}
      {/* Confirm Delete Modal */}
      {selectedDiscountIdForDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={handleDeleteDiscount}
          discountName={discounts.find(d => d.id === selectedDiscountIdForDelete)?.discountName || ""}
        />
      )}
    </main>
  );
};

export default Discounts;