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
  Chip,
  Tooltip,
} from "@heroui/react";
import { MagnifyingGlassIcon, EyeIcon } from "@heroicons/react/24/outline";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { columns, filterOptions } from "@/data/notification.data";
import { NotificationDto } from "@/types/notification.type";
import NotificationEmployeeServices from "@/services/employee.services/NotificationServices";
import NotificationDetailModal from "@/app/employee/notifications/NotificationDetail.modal";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const Notifications = () => {
  const [allNotifications, setAllNotifications] = useState<NotificationDto[]>([]);
  const [filterContent, setFilterContent] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<NotificationDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        let page = 1;
        let allData: NotificationDto[] = [];
        let totalPages = 1;

        while (page <= totalPages) {
          const response = await NotificationEmployeeServices.getReceivedNotifications({
            page,
            limit: 100,
          });
          allData = [...allData, ...response.data];
          totalPages = response.paging.totalPages;
          page++;
        }

        setAllNotifications(allData);
      } catch (error) {
        toast.error("Lỗi khi tải danh sách thông báo.");
      }
    };

    fetchAllNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    let result = allNotifications;

    if (filterContent) {
      result = result.filter((notification) =>
        notification.notificationContent
          .toLowerCase()
          .includes(filterContent.toLowerCase())
      );
    }

    if (filterStatus !== "ALL") {
      result = result.filter((notification) =>
        filterStatus === "UNREAD" ? !notification.read : notification.read
      );
    }

    return result;
  }, [allNotifications, filterContent, filterStatus]);

  const paginatedNotifications = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredNotifications, page]);

  const totalPages = Math.ceil(filteredNotifications.length / rowsPerPage);
  const loadingState = allNotifications.length === 0 ? "loading" : "idle";

  const handleSearchContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterContent(e.target.value);
    setPage(1);
  };

  const handleFilterStatus = (status: string) => {
    setFilterStatus(status);
    setPage(1);
  };

  const openModal = (notification: NotificationDto) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationEmployeeServices.patchReadNotification({
        notificationId,
      });
      setAllNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setIsModalOpen(false);
      toast.success("Đã đánh dấu thông báo là đã đọc.");
    } catch (error) {
      toast.error("Lỗi khi đánh dấu thông báo.");
    }
  };

  const renderCell = useCallback(
    (notification: NotificationDto, columnKey: Key): React.ReactNode => {
      const cellValue = notification[columnKey as keyof NotificationDto];

      switch (columnKey) {
        case "notificationType":
          return <span className="text-sm text-gray-900">{cellValue}</span>;
        case "notificationContent":
          return (
            <span className="text-sm text-gray-600 line-clamp-2">
              {cellValue}
            </span>
          );
        case "createdAt":
          return (
            <span className="text-sm text-gray-600">
              {format(new Date(cellValue as string), "dd/MM/yyyy HH:mm", { locale: vi })}
            </span>
          );
        case "read":
          return (
            <Chip
              size="sm"
              color={notification.read ? "success" : "danger"}
              className="text-secondary-900"
            >
              {notification.read ? "Đã đọc" : "Chưa đọc"}
            </Chip>
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
                  onClick={() => openModal(notification)}
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
    []
  );

  return (
    <main className="flex w-full min-h-screen gap-4 bg-gray-50 p-6">
      <div className="flex h-full w-full gap-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách thông báo
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  className="bg-white w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
                  variant="bordered"
                  size="md"
                  placeholder="Tìm theo nội dung thông báo"
                  startContent={
                    <MagnifyingGlassIcon className="size-5 text-gray-400" />
                  }
                  value={filterContent}
                  onChange={handleSearchContent}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Chip
                  key={option.uid}
                  className={`capitalize cursor-pointer font-medium px-3 py-1 transition-all duration-200 ${
                    filterStatus === option.uid
                      ? "text-primary-700 border-b-2 border-primary-700 border-t-transparent border-l-transparent border-r-transparent"
                      : "text-gray-700 hover:text-primary-400"
                  }`}
                  size="md"
                  radius="sm"
                  onClick={() => handleFilterStatus(option.uid)}
                >
                  {option.name}
                </Chip>
              ))}
            </div>
            <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm">
              <Table
                aria-label="Bảng danh sách thông báo"
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
                  items={paginatedNotifications}
                  emptyContent={
                    <div className="text-gray-500 text-center py-4">
                      Không có thông báo nào.
                    </div>
                  }
                  loadingContent={<Spinner className="mx-auto my-4" />}
                  loadingState={loadingState}
                >
                  {(item: NotificationDto) => (
                    <TableRow
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        item.read ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      {(columnKey: Key) => (
                        <TableCell className="py-3">
                          {renderCell(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 0 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                  className="bg-white rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <NotificationDetailModal
        isOpen={isModalOpen}
        notification={selectedNotification}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNotification(null);
        }}
        onMarkAsRead={markAsRead}
      />
    </main>
  );
};

export default Notifications;