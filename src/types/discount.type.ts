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
  productIds: string[];
};

export type CreateDiscountDto = {
  discountName: string;
  discountDescription: string;
  discountType: string;
  discountValue: number;
  discountCode: string;
  discountStartDate: string;
  discountEndDate: string;
  discountMaxUsers: number;
  discountMaxPerUser: number;
  discountMinOrderValue: number;
  discountIsActive: boolean;
  productVariantIds: string[];
};

export type UpdateDiscountDto = {
  discountId: string;
  discountName?: string;
  discountDescription?: string;
  discountType?: string;
  discountValue?: number;
  discountCode?: string;
  discountStartDate?: string;
  discountEndDate?: string;
  discountMaxUsers?: number;
  discountMaxPerUser?: number;
  discountMinOrderValue?: number;
  discountIsActive?: boolean;
  productVariantIds?: string[];
};

export type productsDiscountResponse = {
  id: string;
  name: string;
  thumb: string;
}

export type DiscountListResponse = {
  id: string;
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
  products: productsDiscountResponse[];
};