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
  productCommentCount: number;
  productIsPublished: boolean;
  productIsDeleted: boolean;
  productCategoryId: string;
};

export type CreateProductDto = {
  productName: string;
  productDescription: string;
  productPrice: number;
  productCategory: string;
  productIngredients: {};
  drink: boolean;
  image?: File;
};

export type UpdateProductDto = {
  productId?: string;
  productName?: string;
  productDescription?: string;
  productPrice?: number;
  productCommentCount?: number;
  productRatingsAverage?: number;
  productIsPublished?: boolean;
  productIsDeleted?: boolean;
  productCategory?: string;
};  
