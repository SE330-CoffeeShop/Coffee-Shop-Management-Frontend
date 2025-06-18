export type ProductType = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  productName: string;
  productThumb: string;
  productDescription: string;
  productPrice: number;
  productSlug: string;
  productRatingsAverage: number;
  productIsPublished: boolean;
  productIsDeleted: boolean;
  productCategoryId: string;
};
