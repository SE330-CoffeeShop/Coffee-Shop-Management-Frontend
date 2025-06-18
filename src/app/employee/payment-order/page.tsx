"use client";

import { useContext, useState } from "react";
import { CartItemDisplay, PaymentMethodCard } from "@/components";
import CartContext from "@/contexts/CartContext";
import { CartContextType } from "@/types/cart.type";
import { PaymentMethodDto } from "@/types/payment-method.type";
import axios from "@/lib/axiosInstance";
import useSWR from "swr";
import ButtonSolid from "@/components/Button/ButtonSolid";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const PaymentOrder = () => {
  const router = useRouter();
  const { cartItems, totalPrice, discount, tax, finalTotal, clearCart } = useContext(CartContext) as CartContextType;
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);

  const endpointPaymentMethod = `/payment/payment-method/all?page=1&limit=100`;
  // Fetch payment methods
  const {
    data: paymentMethodsData,
    error: paymentMethodsError,
    isLoading: paymentMethodsLoading,
  } = useSWR(endpointPaymentMethod, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const paymentMethods: PaymentMethodDto[] = paymentMethodsData?.data || [];

  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethodId) {
      toast.error("Vui lòng chọn hình thức thanh toán!");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống, không thể thanh toán!");
      return;
    }

    try {
      // TODO: Call payment confirmation API
      // Example: await axios.post("/payment/confirm", { paymentMethodId: selectedPaymentMethodId, cartItems });
      toast.success("Thanh toán thành công!");
      // clearCart();
      // router.push("/employee/drinks");
    } catch (error) {
      console.error("Payment confirmation error:", error);
      toast.error("Lỗi khi thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <main className="flex w-full min-h-screen gap-2 bg-secondary-100">
      <div className="flex h-full w-full">
        {/* Payment methods */}
        <div className="flex flex-col basis-[70%] p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Danh sách hình thức thanh toán
            </h2>
          </div>
          <div className="mt-4">
            {paymentMethodsLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-16 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            ) : paymentMethodsError ? (
              <p className="text-red-500">Lỗi khi tải hình thức thanh toán.</p>
            ) : paymentMethods.length === 0 ? (
              <p className="text-gray-500">Không có hình thức thanh toán nào.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods
                  // .filter((method) => method.active)
                  .map((method) => (
                    <PaymentMethodCard
                      key={method.paymentMethodId}
                      paymentMethod={method}
                      isSelected={selectedPaymentMethodId === method.paymentMethodId}
                      onSelect={setSelectedPaymentMethodId}
                    />
                  ))}
              </div>
            )}
            {!paymentMethodsLoading && paymentMethods.length > 0 && (
              <ButtonSolid
                content="Xác nhận thanh toán"
                onClick={handleConfirmPayment}
                isDisabled={!selectedPaymentMethodId || cartItems.length === 0}
                className="mt-6 px-4 py-2 bg-primary-700 text-secondary-100 rounded-sm text-base-semibold disabled:opacity-50"
              />
            )}
          </div>
        </div>
        {/* Cart summary */}
        <div className="flex flex-col basis-[30%] bg-white p-4 shadow-md rounded-md h-full">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Giỏ hàng
          </h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 flex-grow">Giỏ hàng trống</p>
          ) : (
            <div className="flex flex-col h-full gap-4">
              <div className="flex-grow">
                {cartItems.map((item) => (
                  <CartItemDisplay
                    key={`${item.id}-${item.productVariant}`}
                    item={item}
                  />
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-900">Tạm tính:</span>
                  <span className="text-sm text-secondary-900">
                    {totalPrice.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-900">Khuyến mãi:</span>
                  <span className="text-sm text-green-600">
                    -{discount.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-900">Thuế (10%):</span>
                  <span className="text-sm text-secondary-900">
                    {tax.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-base font-semibold text-secondary-900">
                    Tổng tiền:
                  </span>
                  <span className="text-base font-semibold text-primary-700">
                    {finalTotal.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaymentOrder;