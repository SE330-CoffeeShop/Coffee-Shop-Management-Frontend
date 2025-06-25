"use client";

import { useContext, useState, useEffect } from "react";
import { CartItemDisplay, PaymentMethodCard } from "@/components";
import PaymentTimerModal from "@/app/employee/payment-order/PaymentTimerModal";
import PaymentSuccessModal from "@/app/employee/payment-order/PaymentSuccessModal";
import CashPaymentModal from "@/app/employee/payment-order/CashPaymentModal";
import CartContext from "@/contexts/CartContext";
import { CartContextType, CartItem } from "@/types/cart.type";
import { PaymentMethodDto } from "@/types/payment-method.type";
import axios from "@/lib/axiosInstance";
import useSWR from "swr";
import ButtonSolid from "@/components/Button/ButtonSolid";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  cancelPendingOrder,
  createOrder,
  acceptPendingOrder,
} from "@/services/employee.services/OrderServices";
import { getPaymentHandler } from "@/app/employee/payment-order/PaymentFactory";
import {
  getOrderPaymentByOrderId,
  updateOrderPaymentStatusFail,
} from "@/services/employee.services/PaymentServices";

// Fetcher for SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// Order Creation Function
const createOrderAndGetId = async (
  paymentMethodId: string,
  cartItems: CartItem[]
): Promise<string> => {
  const response = await createOrder(
    paymentMethodId,
    cartItems.map((item) => ({
      variantId: item.productVariant,
      cartDetailQuantity: item.quantity,
    }))
  );
  if (response && response.statusCode === 201) {
    return response.data.id;
  }
  throw new Error("Không thể tạo đơn hàng");
};

const PaymentOrder = () => {
  const router = useRouter();
  const { cartItems, totalPrice, discount, tax, finalTotal, clearCart } =
    useContext(CartContext) as CartContextType;
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cashTotal, setCashTotal] = useState<number>(0);
  const [isPolling, setIsPolling] = useState(false);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const endpointPaymentMethod = `/payment/payment-method/all?page=1&limit=100`;
  const {
    data: paymentMethodsData,
    error: paymentMethodsError,
    isLoading: paymentMethodsLoading,
  } = useSWR(endpointPaymentMethod, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const paymentMethods: PaymentMethodDto[] = paymentMethodsData?.data || [];

  const cancelOrderAndPayment = async (orderId: string) => {
    try {
      const responseCancelledOrder = await cancelPendingOrder(orderId);
      if (!responseCancelledOrder) {
        throw new Error("Không thể hủy đơn hàng.");
      }

      const paymentDetails = await getOrderPaymentByOrderId(orderId);
      if (paymentDetails) {
        const responseUpdatePaymentStatusFail =
          await updateOrderPaymentStatusFail(paymentDetails.data.orderPaymentId);
        if (!responseUpdatePaymentStatusFail) {
          throw new Error("Không thể hủy phương thức thanh toán đơn hàng.");
        }
      }
      return true;
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng và phương thức thanh toán:", error);
      toast.error("Lỗi khi hủy đơn hàng. Vui lòng thử lại.");
      return false;
    }
  };

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
      const orderId = await createOrderAndGetId(selectedPaymentMethodId, cartItems);
      setOrderId(orderId);
      setCashTotal(finalTotal);

      const handler = getPaymentHandler(selectedPaymentMethodId);
      await handler.initiatePayment(orderId);

      setIsTimerModalOpen(true);
      if (selectedPaymentMethodId !== process.env.NEXT_PUBLIC_PAYMENT_METHOD_CASH) {
        setIsPolling(true);
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      toast.error("Lỗi khi thanh toán. Vui lòng thử lại.");
    }
  };

  const handleCancelOrder = async () => {
    if (orderId) {
      setIsPolling(false);
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutId) clearTimeout(timeoutId);
      const success = await cancelOrderAndPayment(orderId);
      if (success) {
        toast.success("Đơn hàng đã bị hủy.");
        setIsTimerModalOpen(false);
        clearCart();
        router.push("/employee/drinks");
      }
    }
  };

  const handleChangePaymentMethod = async () => {
    if (orderId) {
      setIsPolling(false);
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutId) clearTimeout(timeoutId);
      const success = await cancelOrderAndPayment(orderId);
      if (!success) {
        return;
      }
    }
    setIsTimerModalOpen(false);
    setSelectedPaymentMethodId(null);
    setOrderId(null);
  };

  const handleConfirmCash = async () => {
    if (orderId) {
      try {
        const responseCompleteOrder = await acceptPendingOrder(orderId);
        if (responseCompleteOrder) {
          setIsTimerModalOpen(false);
          toast.success("Đơn hàng đã được hoàn thành!");
          clearCart();
          setIsCashModalOpen(true);
        } else {
          throw new Error("Không thể hoàn thành đơn hàng");
        }
      } catch (error) {
        console.error("Lỗi xác nhận thanh toán tiền mặt:", error);
        toast.error("Lỗi khi xác nhận thanh toán. Vui lòng thử lại.");
      }
    }
  };

  const onTimeout = async () => {
    if (orderId) {
      setIsPolling(false);
      if (pollInterval) clearInterval(pollInterval);
      const success = await cancelOrderAndPayment(orderId);
      if (success) {
        toast.success("Đơn hàng đã bị hủy do quá thời gian thanh toán.");
        setIsTimerModalOpen(false);
        clearCart();
        router.push("/employee/drinks");
      }
    }
  };

  useEffect(() => {
    if (isPolling && orderId) {
      const interval = setInterval(async () => {
        try {
          const paymentStatus = await getOrderPaymentByOrderId(orderId);
          if (paymentStatus && paymentStatus.statusCode === 200) {
            if (paymentStatus.data.status === "COMPLETED") {
              setIsPolling(false);
              clearInterval(interval);
              if (timeoutId) clearTimeout(timeoutId);
              setIsTimerModalOpen(false);
              const responseCompleteOrder = await acceptPendingOrder(orderId);
              if (responseCompleteOrder) {
                toast.success("Đơn hàng đã được hoàn thành!");
                clearCart();
                setIsSuccessModalOpen(true);
              } else {
                throw new Error("Không thể hoàn thành đơn hàng");
              }
            }
          } else {
            throw new Error("Không thể kiểm tra trạng thái thanh toán");
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái:", error);
          setIsPolling(false);
          clearInterval(interval);
          if (timeoutId) clearTimeout(timeoutId);
          toast.error("Lỗi khi kiểm tra trạng thái thanh toán.");
        }
      }, 3000); // Poll every 3 seconds

      setPollInterval(interval);

      const timeout = setTimeout(() => {
        setIsPolling(false);
        clearInterval(interval);
        onTimeout();
      }, 300000); // 5 minutes

      setTimeoutId(timeout);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isPolling, orderId]);

  const isCashPayment =
    selectedPaymentMethodId === process.env.NEXT_PUBLIC_PAYMENT_METHOD_CASH;

  return (
    <>
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
              <p className="text-gray-500">
                Không có hình thức thanh toán nào.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.paymentMethodId}
                    paymentMethod={method}
                    isSelected={
                      selectedPaymentMethodId === method.paymentMethodId
                    }
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
                  <span className="text-sm text-secondary-900">
                    Khuyến mãi:
                  </span>
                  <span className="text-sm text-green-600">
                    -{discount.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-900">Thuế (5%):</span>
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
      {isTimerModalOpen && (
        <PaymentTimerModal
          isOpen={isTimerModalOpen}
          onClose={() => setIsTimerModalOpen(false)}
          onCancelOrder={handleCancelOrder}
          onChangePaymentMethod={handleChangePaymentMethod}
          timeLeft={300}
          isCashPayment={isCashPayment}
          onConfirmCash={handleConfirmCash}
        />
      )}
      {isSuccessModalOpen && (
        <PaymentSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
        />
      )}
      {isCashModalOpen && (
        <CashPaymentModal
          isOpen={isCashModalOpen}
          onClose={() => setIsCashModalOpen(false)}
          totalAmount={cashTotal}
        />
      )}
    </>
  );
};

export default PaymentOrder;