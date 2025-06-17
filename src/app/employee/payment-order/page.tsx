"use client";

import CartContext from "@/contexts/CartContext";
import { CartContextType } from "@/types/cart.type";
import { useContext } from "react";

const PaymentOrder = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useContext(
    CartContext
  ) as CartContextType;

  return <main>
    
  </main>
};

export default PaymentOrder;
