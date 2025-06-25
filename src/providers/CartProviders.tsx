"use client";

import React, { useState } from "react";
import CartContext from "@/contexts/CartContext";
import { CartItem, CartContextType } from "@/types/cart.type";
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
  const [discount, setDiscount] = useState<number>(0);
  const taxRate = 0.05; // 5% fixed tax

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  const tax = (totalPrice - discount) * taxRate;
  const finalTotal = totalPrice - discount + tax;

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
    setDiscount(0); // Reset discount when clearing cart
  };

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    discount,
    setDiscount,
    taxRate,
    tax,
    finalTotal,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProviders;