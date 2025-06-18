import axios from "@/lib/axiosInstance";

type ItemApplyDiscountType = {
  variantId: string;
  cartDetailQuantity: number;
};

export type ApplyDiscountDto = {
  cartDetails: ItemApplyDiscountType[];
};

export const applyDiscountToCart = async (cartDetails: ApplyDiscountDto) => {
  try {
    const response = await axios.put("/discount/employee/apply-to-cart", {
      cartDetails: cartDetails.cartDetails,
    });

    console.log("response: ", response);

    const discountAmount = response.data.data.cartDiscountCost || 0;
    console.log("discountAmount: ", discountAmount);
    return discountAmount;
  } catch (error: any) {
    console.error("Discount API error:", error);
    throw error;
  }
};
