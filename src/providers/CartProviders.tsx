"use client";

import React, { useState } from "react";
import CartContext from "@/contexts/CartContext";
import { CartItem } from "@/types/cart.type";
import { ProductType } from "@/types/product.type";

const mapProductToItemCart = (
  product: ProductType,
  quantity: number,
  productVariant: string,
  productVariantTierIdx: string
): CartItem => {
  return {
    id: product.id,
    productName: product.productName,
    productThumb: product.productThumb,
    productPrice: product.productPrice,
    productCategoryId: product.productCategoryId,
    quantity,
    productVariant,
    productVariantTierIdx,
  };
};

const CartProviders = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: ProductType,
    quantity: number,
    productVariant: string,
    productVariantTierIdx: string
  ) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.id === product.id && item.productVariant === productVariant
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.productVariant === productVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        mapProductToItemCart(product, quantity, productVariant, productVariantTierIdx),
      ];
    });
  };

  const removeFromCart = (productId: string, productVariant?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          item.id !== productId || item.productVariant !== (productVariant || "")
      )
    );
  };

  const updateQuantity = (
    productId: string,
    productVariant: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      removeFromCart(productId, productVariant);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.productVariant === productVariant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProviders;
