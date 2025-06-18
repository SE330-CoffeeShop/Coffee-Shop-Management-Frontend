export type DiscountDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  discountName: string;
  discountDescription: string;
  discountType: string;
  discountValue: number;
  discountCode: string;
  discountStartDate: string;
  discountEndDate: string;
  discountMaxUsers: number;
  discountUserCount: number;
  discountMaxPerUser: number;
  discountMinOrderValue: number;
  discountIsActive: boolean;
  branchId: string;
  productVariantIds: string[];
};