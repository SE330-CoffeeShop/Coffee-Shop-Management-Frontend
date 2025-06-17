import { ProductType } from "@/types/product.type";

export type CartItem = {
  id: string;
  productName: string;
  productThumb: string;
  productPrice: number;
  productCategoryId: string;
  quantity: number;
  productVariant: string; // variant.id
  productVariantTierIdx: string; // variant.variantTierIdx
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (
    product: ProductType,
    quantity: number,
    productVariant: string,
    productVariantTierIdx: string
  ) => void;
  removeFromCart: (productId: string, productVariant?: string) => void;
  updateQuantity: (
    productId: string,
    productVariant: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalPrice: number;
};