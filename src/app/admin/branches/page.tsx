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
import { EyeIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { BranchType } from "@/types/branch.type";
import BranchAdminServices from "@/services/admin.services/BranchServices";
import { ButtonSolid } from "@/components";
import { useDisclosure } from "@heroui/react";
import BranchDetailModal from "@/app/admin/branches/BranchDetail.modal";
import UpdateBranchModal from "@/app/admin/branches/UpdateBranch.modal";
import DeleteConfirmationModal from "@/app/admin/branches/DeleteBranch.modal";
import CreateBranchModal from "@/app/admin/branches/CreateBranch.modal";
import CreateManagerModal from "@/app/admin/branches/CreateManager.modal";
import ManagerDetailModal from "@/app/admin/branches/ManagerDetail.modal";
import { columnsBranch } from "@/data/branch.data";

const fetcher = () => BranchAdminServices.getAllBranchesInSystem();

const Branches = () => {
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onOpenChange: onDetailOpenChange, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onOpenChange: onUpdateOpenChange, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isCreateBranchOpen, onOpen: onCreateBranchOpen, onOpenChange: onCreateBranchOpenChange, onClose: onCreateBranchClose } = useDisclosure();
  const { isOpen: isCreateManagerOpen, onOpen: onCreateManagerOpen, onOpenChange: onCreateManagerOpenChange, onClose: onCreateManagerClose } = useDisclosure();
  const { isOpen: isManagerDetailOpen, onOpen: onManagerDetailOpen, onOpenChange: onManagerDetailOpenChange, onClose: onManagerDetailClose } = useDisclosure();

  const [branches, setBranches] = useState<BranchType[]>([]);
  const [totalBranches, setTotalBranches] = useState<number>(0);
  const [filterBranchName, setFilterBranchName] = useState<string>("");
  const [selectedBranchForDetail, setSelectedBranchForDetail] = useState<BranchType | null>(null);
  const [selectedBranchForUpdate, setSelectedBranchForUpdate] = useState<BranchType | null>(null);
  const [selectedBranchForDelete, setSelectedBranchForDelete] = useState<BranchType | null>(null);
  const [selectedBranchForCreateManager, setSelectedBranchForCreateManager] = useState<BranchType | null>(null);
  const [selectedBranchForManagerDetail, setSelectedBranchForManagerDetail] = useState<BranchType | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { data: branchesData, error: branchesError, isLoading: branchesLoading, mutate } = useSWR("/branch/all", fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (branchesError) {
      setBranches([]);
      setTotalBranches(0);
      toast.error("Lỗi khi tải danh sách chi nhánh.");
    } else if (branchesData?.data) {
      setBranches(branchesData.data);
      setTotalBranches(branchesData.paging?.total || 0);
    }
  }, [branchesData, branchesError]);

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) =>
      branch.branchName.toLowerCase().includes(filterBranchName.toLowerCase())
    );
  }, [branches, filterBranchName]);

  const paginatedBranches = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredBranches.slice(start, end);
  }, [filteredBranches, page, rowsPerPage]);

  const pages = Math.ceil(filteredBranches.length / rowsPerPage);

  const loadingState = branchesLoading || branches.length === 0 ? "loading" : "idle";

  const handleSearchBranch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterBranchName(e.target.value);
    setPage(1);
  };

  const handleOpenDetailModal = (branch: BranchType) => {
    setSelectedBranchForDetail(branch);
    onDetailOpen();
  };

  const handleOpenUpdateModal = (branch: BranchType) => {
    setSelectedBranchForUpdate(branch);
    onUpdateOpen();
  };

  const handleOpenDeleteModal = (branch: BranchType) => {
    setSelectedBranchForDelete(branch);
    onDeleteOpen();
  };

  const handleManagerAction = (branch: BranchType) => {
    if (branch.managerId) {
      setSelectedBranchForManagerDetail(branch);
      onManagerDetailOpen();
    } else {
      setSelectedBranchForCreateManager(branch);
      onCreateManagerOpen();
    }
  };

  const handleDeleteBranch = async () => {
    if (selectedBranchForDelete) {
      try {
        await BranchAdminServices.deleteBranchById(selectedBranchForDelete.id);
        toast.success("Xóa chi nhánh thành công!");
        mutate();
        onDeleteClose();
      } catch (error) {
        toast.error("Xóa chi nhánh thất bại. Vui lòng thử lại.");
      }
    }
  };

  const renderCell = useCallback(
    (branch: BranchType, columnKey: Key, index: number): React.ReactNode => {
      const cellValue = branch[columnKey as keyof BranchType];

      switch (columnKey) {
        case "index":
          return (
            <span className="text-sm font-medium text-gray-700">
              {index + 1 + (page - 1) * rowsPerPage}
            </span>
          );
        case "id":
          return (
            <span className="text-sm text-gray-900">
              {branch.id.slice(0, 8)}...
            </span>
          );
        case "branchName":
        case "branchAddress":
        case "managerName":
          return (
            <span className="text-sm text-gray-900">
              {cellValue as string}
            </span>
          );
        case "createdAt":
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
                  onClick={() => handleOpenDetailModal(branch)}
                >
                  <EyeIcon className="size-5" />
                </span>
              </Tooltip>
              <Tooltip
                content="Cập nhật chi nhánh"
                className="bg-primary-700 text-white px-2 py-1 rounded-md text-xs"
              >
                <span
                  className="cursor-pointer text-primary-700 hover:text-primary-500 transition-colors"
                  onClick={() => handleOpenUpdateModal(branch)}
                >
                  <PencilIcon className="size-5" />
                </span>
              </Tooltip>
              <Tooltip
                content={branch.managerId ? "Cập nhật quản lý" : "Thêm quản lý"}
                className="bg-primary-700 text-white px-2 py-1 rounded-md text-xs"
              >
                <span
                  className="cursor-pointer text-primary-700 hover:text-primary-500 transition-colors"
                  onClick={() => handleManagerAction(branch)}
                >
                  <UserIcon className="size-5" />
                </span>
              </Tooltip>
              <Tooltip
                content="Xóa chi nhánh"
                className="bg-primary-700 text-white px-2 py-1 rounded-md text-xs"
              >
                <span
                  className="cursor-pointer text-primary-700 hover:text-primary-500 transition-colors"
                  onClick={() => handleOpenDeleteModal(branch)}
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
      <div className="flex h-full w-full">
        <div className="flex flex-col basis-full">
          <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách chi nhánh
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  className="bg-white w-full sm:w-72 rounded-lg border-gray-200 shadow-sm"
                  variant="bordered"
                  size="md"
                  placeholder="Tìm theo tên chi nhánh"
                  startContent={
                    <MagnifyingGlassIcon className="size-5 text-gray-400" />
                  }
                  value={filterBranchName}
                  onChange={handleSearchBranch}
                />
                <ButtonSolid
                  content="Thêm chi nhánh"
                  onClick={onCreateBranchOpen}
                  className="w-full sm:w-auto rounded-lg bg-primary-500 text-primary-0 hover:bg-primary-600"
                />
              </div>
            </div>
            {/* Table Rendering */}
            <div className="h-[500px] overflow-auto rounded-xl bg-white shadow-sm">
              <Table
                aria-label="Bảng danh sách chi nhánh"
                className="h-full w-full"
                shadow="none"
                selectionMode="none"
              >
                <TableHeader>
                  {columnsBranch.map((column) => (
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
                  items={paginatedBranches}
                  emptyContent={
                    <div className="text-gray-500 text-center py-4">
                      Không có chi nhánh nào.
                    </div>
                  }
                  loadingContent={<Spinner className="mx-auto my-4" />}
                  loadingState={loadingState}
                >
                  {(item: BranchType) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {(columnKey: Key) => (
                        <TableCell className="py-3">
                          {renderCell(item, columnKey, filteredBranches.indexOf(item))}
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
      </div>
      {/* Modals */}
      {selectedBranchForDetail && (
        <BranchDetailModal
          isOpen={isDetailOpen}
          onOpenChange={onDetailOpenChange}
          onClose={onDetailClose}
          branch={selectedBranchForDetail}
        />
      )}
      {selectedBranchForUpdate && (
        <UpdateBranchModal
          isOpen={isUpdateOpen}
          onOpenChange={onUpdateOpenChange}
          onClose={onUpdateClose}
          branch={selectedBranchForUpdate}
          onUpdated={() => mutate()}
        />
      )}
      {selectedBranchForDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          onClose={onDeleteClose}
          onConfirm={handleDeleteBranch}
          branchName={selectedBranchForDelete.branchName}
        />
      )}
      <CreateBranchModal
        isOpen={isCreateBranchOpen}
        onOpenChange={onCreateBranchOpenChange}
        onClose={onCreateBranchClose}
        onCreated={() => mutate()}
      />
      {selectedBranchForCreateManager && (
        <CreateManagerModal
          isOpen={isCreateManagerOpen}
          onOpenChange={onCreateManagerOpenChange}
          onClose={onCreateManagerClose}
          branch={selectedBranchForCreateManager}
          onCreated={() => mutate()}
        />
      )}
      {selectedBranchForManagerDetail && (
        <ManagerDetailModal
          isOpen={isManagerDetailOpen}
          onOpenChange={onManagerDetailOpenChange}
          onClose={onManagerDetailClose}
          managerId={selectedBranchForManagerDetail.managerId!}
          branchId={selectedBranchForManagerDetail.id}
          onDeleted={() => mutate()}
        />
      )}
    </main>
  );
};

export default Branches;