"use client";

import {
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
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { columns } from "@/data/customer.data";
import { CustomerDto } from "@/types/customer.type";
import { CustomerCardDisplay } from "@/components";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Customers = () => {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [filterFullName, setFilterFullName] = useState<string>("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const endpointCustomers = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: rowsPerPage.toString(),
    });
    return `/customers/my-branch?${params.toString()}`;
  }, [page]);

  const {
    data: customersData,
    error: customersError,
    isLoading: customersLoading,
    mutate: mutateCustomers,
  } = useSWR(endpointCustomers, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (customersError) {
      setCustomers([]);
      setTotalCustomers(0);
      toast.error("Lỗi khi tải danh sách khách hàng.");
    } else if (customersData?.data) {
      let filteredCustomers = customersData.data;
      if (filterFullName) {
        filteredCustomers = filteredCustomers.filter((customer: CustomerDto) =>
          customer.userFullName
            .toLowerCase()
            .includes(filterFullName.toLowerCase())
        );
      }
      setCustomers(filteredCustomers);
      setTotalCustomers(customersData.paging?.total || 0);
    }
  }, [customersData, customersError, filterFullName]);

  const customerDetails = useMemo(() => {
    return customers.find((customer) => customer.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const pages = useMemo(() => {
    return totalCustomers ? Math.ceil(totalCustomers / rowsPerPage) : 0;
  }, [totalCustomers]);

  const loadingState =
    customersLoading || customers.length === 0 ? "loading" : "idle";

  const handleSearchFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFullName(e.target.value);
    setPage(1);
  };

  const renderCell = useCallback(
    (customer: CustomerDto, columnKey: Key, index: number): React.ReactNode => {
      const cellValue = customer[columnKey as keyof CustomerDto];

      switch (columnKey) {
        case "index":
          return (
            <span className="text-sm font-medium text-gray-700">
              {index + 1 + (page - 1) * rowsPerPage}
            </span>
          );
        case "userFullName":
          return <span className="text-sm text-gray-900">{cellValue}</span>;
        case "userDoB":
          return (
            <span className="text-sm text-gray-600">
              {new Date(cellValue as string).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          );
        case "userPhone":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "userGender":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "userEmail":
          return <span className="text-sm text-gray-600">{cellValue}</span>;
        case "lastBuyAt":
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
                  onClick={() => setSelectedCustomerId(customer.id)}
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
        {/* Customers Table (70%) */}
        <div className="flex flex-col basis-[70%]">
          <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách khách hàng
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  className="bg-white w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
                  variant="bordered"
                  size="md"
                  placeholder="Tìm theo họ và tên"
                  startContent={
                    <MagnifyingGlassIcon className="size-5 text-gray-400" />
                  }
                  value={filterFullName}
                  onChange={handleSearchFullName}
                />
              </div>
            </div>
            {/* Table Rendering */}
            <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm">
              <Table
                aria-label="Bảng danh sách khách hàng"
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
                  items={customers}
                  emptyContent={
                    <div className="text-gray-500 text-center py-4">
                      Không có khách hàng nào.
                    </div>
                  }
                  loadingContent={<Spinner className="mx-auto my-4" />}
                  loadingState={loadingState}
                >
                  {(item: CustomerDto) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {(columnKey: Key) => (
                        <TableCell className="py-3">
                          {renderCell(item, columnKey, customers.indexOf(item))}
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
        {/* Customer Details (30%) */}
        <div className="flex flex-col basis-[30%] bg-white p-6 rounded-2xl shadow-lg h-full">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Chi tiết khách hàng
          </h3>
          {selectedCustomerId && customerDetails ? (
            <CustomerCardDisplay {...customerDetails} />
          ) : (
            <p className="text-gray-500 text-sm flex-grow">
              Chọn một khách hàng để xem chi tiết.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Customers;