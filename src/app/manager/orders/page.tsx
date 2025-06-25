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
import {
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import React, {
  Key,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { columns, statusOptions } from "@/data/order.data";
import { OrderDetailDto, OrderDto } from "@/types/order.type";
import { formatNumberWithCommas } from "@/helpers";
import { OrderProductDisplay } from "@/components";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Orders = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [filterCustomerName, setFilterCustomerName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("PROCESSING");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const endpointOrders = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: rowsPerPage.toString(),
    });
    return `/orders/branch/status/${selectedStatus}?${params.toString()}`;
  }, [page, selectedStatus]);

  const {
    data: ordersData,
    error: ordersError,
    isLoading: ordersLoading,
    mutate: mutateOrders,
  } = useSWR(endpointOrders, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const endpointOrderDetails = selectedOrderId
    ? `/order-details/by-order/${selectedOrderId}`
    : null;

  const { data: orderDetailsData, error: orderDetailsError } = useSWR(
    endpointOrderDetails,
    fetcher,
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const orderDetails: OrderDetailDto[] = orderDetailsData?.data || [];

  useEffect(() => {
    if (ordersError) {
      setOrders([]);
      setTotalOrders(0);
      toast.error("Lỗi khi tải danh sách đơn hàng.");
    } else if (ordersData?.data) {
      let filteredOrders = ordersData.data;
      if (filterCustomerName) {
        filteredOrders = filteredOrders.filter((order: OrderDto) =>
          order.userName
            ?.toLowerCase()
            .includes(filterCustomerName.toLowerCase())
        );
      }
      setOrders(filteredOrders);
      setTotalOrders(ordersData.paging?.total || 0);
    }
  }, [ordersData, ordersError, filterCustomerName]);

  useEffect(() => {
    if (orderDetailsError) {
      toast.error("Lỗi khi tải chi tiết đơn hàng.");
    }
  }, [orderDetailsError]);

  const pages = useMemo(() => {
    return totalOrders ? Math.ceil(totalOrders / rowsPerPage) : 0;
  }, [totalOrders]);

  const loadingState =
    ordersLoading || orders.length === 0 ? "loading" : "idle";

  const handleFilterStatus = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleSearchCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCustomerName(e.target.value);
    setPage(1);
  };

  const renderCell = useCallback(
    (order: OrderDto, columnKey: Key, index: number): React.ReactNode => {
      const cellValue = order[columnKey as keyof OrderDto];

      switch (columnKey) {
        case "index":
          return (
            <span className="text-sm font-medium text-gray-700">
              {index + 1 + (page - 1) * rowsPerPage}
            </span>
          );
        case "orderId":
          return <span className="text-sm text-gray-900">{order.id}</span>;
        case "employeeName":
          return (
            <span className="text-sm text-gray-600">
              {order.employeeName || "N/A"}
            </span>
          );
        case "userName":
          return (
            <span className="text-sm text-gray-900">
              {cellValue || "Khách vãng lai"}
            </span>
          );
        case "createdAt":
          return (
            <span className="text-sm text-gray-600">
              {new Date(cellValue as string).toLocaleString("vi-VN", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          );
        case "totalAmount":
          return (
            <span className="text-sm font-semibold text-primary-700">
              {formatNumberWithCommas(
                String(order.orderTotalCostAfterDiscount)
              )}{" "}
              VNĐ
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
                  onClick={() => setSelectedOrderId(order.id)}
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

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  return (
    <main className="flex w-full min-h-screen gap-4 bg-gray-50 p-6">
      <div className="flex h-full w-full gap-4">
        {/* Orders Table (70%) */}
        <div className="flex flex-col basis-[70%]">
          <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách đơn hàng
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  className="bg-white w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
                  variant="bordered"
                  size="md"
                  placeholder="Tìm theo tên khách hàng"
                  startContent={
                    <MagnifyingGlassIcon className="size-5 text-gray-400" />
                  }
                  value={filterCustomerName}
                  onChange={handleSearchCustomer}
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
                aria-label="Bảng danh sách đơn hàng"
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
                  items={orders}
                  emptyContent={
                    <div className="text-gray-500 text-center py-4">
                      Không có đơn hàng nào.
                    </div>
                  }
                  loadingContent={<Spinner className="mx-auto my-4" />}
                  loadingState={loadingState}
                >
                  {(item: OrderDto) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {(columnKey: Key) => (
                        <TableCell className="py-3">
                          {renderCell(item, columnKey, orders.indexOf(item))}
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
        {/* Order Details (30%) */}
        <div className="flex flex-col basis-[30%] bg-white p-6 rounded-2xl shadow-lg h-full">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Chi tiết đơn hàng
          </h3>
          {selectedOrderId ? (
            orderDetails.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Tên khách hàng: {selectedOrder?.userName || "Khách vãng lai"}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Số điện thoại: {selectedOrder?.userPhoneNumber || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Địa chỉ: {selectedOrder?.shippingAddressName || "Tại quầy"}
                  </p>
                </div>
                {orderDetails.map((item) => (
                  <OrderProductDisplay key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Không có chi tiết đơn hàng.
              </p>
            )
          ) : (
            <p className="text-gray-500 text-sm flex-grow">
              Chọn một đơn hàng để xem chi tiết.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Orders;