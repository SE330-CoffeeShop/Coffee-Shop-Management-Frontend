"use client";

import { Button, Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Selection } from "@heroui/react";

interface SelectedProduct {
  productId: string;
  productName: string;
  productThumb: string;
}

interface SelectedProductsTableProps {
  selectedProductIds: Selection;
  products: SelectedProduct[];
  onRemoveProduct: (productId: string) => void;
}

const SelectedProductsTable: React.FC<SelectedProductsTableProps> = ({
  selectedProductIds,
  products,
  onRemoveProduct,
}) => {
  const selectedProducts = products.filter((product) =>
    Array.from(selectedProductIds).includes(product.productId)
  );

  return (
    <Table aria-label="Danh sách sản phẩm đã chọn">
      <TableHeader>
        <TableColumn>Ảnh</TableColumn>
        <TableColumn>Tên sản phẩm</TableColumn>
        <TableColumn>Hành động</TableColumn>
      </TableHeader>
      <TableBody emptyContent="Chưa có sản phẩm nào được chọn">
        {selectedProducts.map((product) => (
          <TableRow key={product.productId}>
            <TableCell>
              <Image
                src={product.productThumb}
                alt={product.productName}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
            </TableCell>
            <TableCell>{product.productName}</TableCell>
            <TableCell>
              <Button
                isIconOnly
                color="danger"
                variant="flat"
                size="sm"
                onPress={() => onRemoveProduct(product.productId)}
                aria-label={`Xóa sản phẩm ${product.productName}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SelectedProductsTable;