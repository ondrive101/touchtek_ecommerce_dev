"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/store";
import { ERROR_CODES } from "@/lib/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { getCheckoutInfo, createOrder, verifyPayment } from "@/action/common";
import { motion } from "framer-motion";
import {
  MapPin,
  ChevronLeft,
  CheckCircle,
  Phone,
  AlertCircle,
  Loader2,
  Calendar,
  Truck,
  CreditCard,
  Package,
  XCircle,
  User,
  Shield,
  Gift,
  Percent,
  X,
} from "lucide-react";
import Header from "@/components/layout/components/Header";



let baseDiscount = 0;

export default function CheckoutPage() {
  const { items,clearCart, getSubtotal } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [showFailed, setShowFailed] = useState(false);
  const [failureReason, setFailureReason] = useState("");
  const [failureOrderId, setFailureOrderId] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [maxRewardPoints, setMaxRewardPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasCoupon, setHasCoupon] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [address, setAddress] = useState(null);

  // ✅ Dynamic calculations

  const pointsDiscount = Math.min(rewardPoints, maxRewardPoints);
  const subtotal = getSubtotal() || 0;
  const discount = hasCoupon ? baseDiscount : 0;
  const rawTotal = subtotal - discount - pointsDiscount;
  const maxRedeemablePoints = Math.max(subtotal - discount, 0);
  const finalTotal = Math.max(rawTotal, 0); // never goes negative

  const handleApplyCoupon = useCallback(() => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setHasCoupon(true);
    } else {
      alert("Invalid coupon");
    }
  }, [couponCode]);

  const handleRemoveCoupon = useCallback(() => {
    setHasCoupon(false);
    setCouponCode("");
  }, []);

  const {
    data: checkoutInfo,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["checkout-info"],
    queryFn: () => getCheckoutInfo(),
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (checkoutInfo) {
      console.log("checkoutInfo", checkoutInfo?.data);
      setAddress(checkoutInfo?.data?.payload?.defaultAddress);
      setMaxRewardPoints(checkoutInfo?.data?.payload?.rewardPoints);
    }
  }, [checkoutInfo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError || !checkoutInfo?.data) {
    const errorCode = ERROR_CODES.CHECKOUT_FETCH_FAILED;
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The details you're looking for don't exist ({errorCode}).
          </p>
        </main>
      </div>
    );
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true); // already loaded
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // ── Step 1: Dynamically load Razorpay checkout script ─────────────────
      // Injects <script src="checkout.js"> if not already present in DOM
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Failed to load payment service. Please try again.");
        setLoading(false);
        return;
      }

      // ── Step 2: Create a Razorpay order on the backend ────────────────────
      // Backend calls razorpay.orders.create() and returns order_id, amount, currency
      // Amount is in ₹ here — backend converts to paise (×100) before sending to Razorpay

      if (finalTotal <= 0) {
        toast.error("Order total must be greater than ₹0");
        setLoading(false);
        return;
      }

      const createOrderPayload = {
        amount: finalTotal,
        pointsDiscount,
        discount,
        shippingAddressId: address.id,
        items: items.map(item => ({
          skuCode: item.id.toUpperCase(),
          name:item.name.toLowerCase(),
          quantity: item.quantity
        }))
      }
      const response = await createOrder(createOrderPayload);

      if (!response.success) {
        toast.error(response?.message || "Failed to create order");
        setLoading(false);
        return;
      }

      console.log("req data received", response.data);

      // response.data.data because:
      // axios wraps body in .data → { message, data: { order_id, amount, currency } }
      // server action returns as-is → response.data = backend body
      const { order_id, amount, currency } = response.data.data;

      // ── Step 3: Configure and open the Razorpay checkout modal ────────────
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public key — safe to expose
        amount, // in paise, as received from backend
        currency, // "INR"
        name: "Touchtek",
        description: "Order Payment", // shown in live mode on modal header
        order_id, // links this session to the backend Razorpay order

        // Pre-fill customer details to speed up checkout
        prefill: {
          name: address?.name || "",
          email: "VK408727@gmail.com",
          contact: address?.phone ? `+91${address.phone}` : "", // E.164 format required
        },

        // ── Payment Method Visibility ──────────────────────────────────────
        // Hiding EMI, Wallets, Pay Later — keeping only Card, UPI, Netbanking
        config: {
          display: {
            hide: [
              { method: "emi" },
              { method: "wallet" },
              { method: "paylater" },
            ],
            preferences: {
              show_default_blocks: true, // show Razorpay's default payment blocks
            },
          },
        },

        // ── Notes (max 15 key-value pairs, visible on Razorpay Dashboard) ───
        notes: {
          order_source: "web_checkout",
        },

        // ── Theme ──────────────────────────────────────────────────────────
        theme: {
          color: "#1b48b3ff", // brand color — applied to buttons, icons, text
          backdrop_color: "#00000080", // semi-transparent dark overlay behind modal
        },

        // ── Step 4: Handle successful payment ─────────────────────────────
      

        handler: async function (razorpayResponse) {
          try {
            // Verify payment on backend using HMAC SHA256 signature check
            // Backend: crypto.createHmac("sha256", secret).update(order_id|payment_id).digest("hex")
            const verifyResponse = await verifyPayment({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });


            console.log("verifyResponse full", verifyResponse);
            if (verifyResponse.success) {
              // Signature matched — order confirmed
              toast.success("Payment successful! 🎉");
              setShowSuccess(true);
              try {
                clearCart();
              } catch (err) {
                console.error("clearCart failed:", err); // non-critical, don't show to user
              }
            } else {
              // ⚠️ Signature mismatch — payment may have been deducted
              // Show amber warning screen with order_id for support contact
              toast.error("Payment verification failed. Contact support.");
              setFailureOrderId(response.data.data.order_id); // for support reference
              setFailureReason(verifyResponse.message);
              setShowFailed(true);
            }
          } catch (err) {
            console.log('error', err)
            toast.error("Verification error. Please contact support.");
            // Network/server crash during verify — money may be deducted
            setFailureOrderId(response.data.data.order_id);
            setFailureReason("Verification service unreachable");
            setShowFailed(true);
          } finally {
            setLoading(false); // ← always reset
          }
        },

        modal: {
          // Called when user closes the modal without completing payment
          // No money deducted at this point
          ondismiss: function () {
            console.log("called when");
            toast.error("Payment cancelled.");
            setLoading(false);
          },
        },

        // ── Readonly Fields ────────────────────────────────────────────────
        // Prevents user from modifying prefilled contact/email
        // Ensures payment is tied to the authenticated user's details
        readonly: {
          contact: true,
          email: true,
          name: false, // allow name edits (e.g. for gift orders)
        },

        // ── Retry ──────────────────────────────────────────────────────────
        // Disabled — user must go back to checkout to retry
        // Prevents confusion from multiple payment attempts on same order
        retry: {
          enabled: false,
        },
      };

      const rzp = new window.Razorpay(options);

      // ── Payment Failure Event ──────────────────────────────────────────
      // Fires when card is declined, bank rejects, etc.
      // No money is deducted — user stays on checkout page to retry
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false); // reset — user can try again from checkout
      });

      // Open the Razorpay checkout modal
      rzp.open();
    } catch (err) {
      // Catches: network errors, backend failures, unexpected JS errors
      console.error("Error placing order:", err);
      toast.error(err.message || "Error placing order");
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 max-w-2xl mx-auto text-center"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CheckCircle
                  className="w-16 h-16 text-emerald-600"
                  strokeWidth={1.5}
                />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                Order Placed!
              </h1>
              <p className="text-lg text-slate-600 mb-6">
                Order #TT-ORD-789456
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
                <p className="text-sm font-semibold text-emerald-800 flex items-center justify-center gap-2 mb-1">
                  <Truck className="w-5 h-5" />
                  <Calendar className="w-5 h-5" />
                  Tomorrow 10 AM - 1 PM
                </p>
                <p className="text-xs text-emerald-700">
                  Free delivery • Track anytime
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  href="/en/user/orders"
                  className="block w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3.5 px-6 rounded-xl hover:shadow-md transition-all text-sm font-semibold flex items-center justify-center gap-2"
                >
                  Track Orders
                </Link>
                <Link
                  href="/en/products"
                  className="block w-full border-2 border-slate-200 text-slate-700 py-3 px-6 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold"
                >
                  Continue Shopping
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-8 pt-6 border-t border-slate-200 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Safe & Secure • SSL Protected</span>
              </p>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  if (showFailed) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 max-w-2xl mx-auto text-center"
            >
              {/* Icon */}
              <div className="w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <AlertCircle
                  className="w-16 h-16 text-amber-500"
                  strokeWidth={1.5}
                />
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                Payment Verification Failed
              </h1>
              <p className="text-base text-slate-600 mb-2">
                Your payment was processed but we could not confirm your order.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Please do not retry — contact our support team with your Order
                ID below.
              </p>

              {/* Order ID Box — most important info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-2">
                  Your Order ID
                </p>
                <p className="text-xl font-mono font-bold text-amber-900 tracking-widest select-all mb-3">
                  {failureOrderId || "N/A"}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(failureOrderId || "");
                    toast.success("Order ID copied!");
                  }}
                  className="text-xs font-semibold text-amber-700 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors flex items-center gap-1.5 mx-auto"
                >
                  <Package className="w-3.5 h-3.5" />
                  Copy Order ID
                </button>
              </div>

              {/* What happened note */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-left space-y-2">
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  What happened?
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your bank may have debited the amount. Our team will verify
                  and either confirm your order or issue a full refund within{" "}
                  <span className="font-semibold text-slate-700">
                    3–5 business days
                  </span>
                  .
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/support"
                  className="block w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3.5 px-6 rounded-xl hover:shadow-md transition-all text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Contact Support
                </Link>
                <Link
                  href="/orders"
                  className="block w-full border-2 border-slate-200 text-slate-700 py-3 px-6 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold"
                >
                  View My Orders
                </Link>
              </div>

              <p className="text-xs text-slate-400 mt-8 pt-6 border-t border-slate-200 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Your payment is safe • We'll resolve this for you</span>
              </p>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Link
                href="/cart"
                className="p-2 -m-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
                <p className="text-sm text-slate-600">Order summary</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column */}
            <section className="xl:col-span-2 space-y-6">
              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h2>

                <div className="space-y-3">
                  <motion.button
                    key={address?.id}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left hover:shadow-md border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-100`}
                    whileHover={{ y: -1 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-blue-500`}
                      ></div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-slate-900">
                            {address?.name}
                          </span>
                          <span
                            className={`px-2 py-px text-xs font-medium rounded-full ${
                              (address?.tag || "default") === "home"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {address?.tag || "default"}
                          </span>
                        </div>

                        <p className="text-sm text-slate-700 mb-1 leading-tight">
                          {address?.address}
                        </p>

                        <div className="space-y-0.5 mb-1">
                          <p className="text-xs text-slate-600">
                            {address?.city ? `${address.city}, ` : ""}
                            {address?.state ? `${address.state} ` : ""}
                            {address?.pincode ? `-${address.pincode}` : ""}
                          </p>
                          <p className="text-xs text-slate-500">
                            {address?.country || "India"}
                          </p>
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          +91 {address?.phone}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2 pb-3 border-b border-slate-200">
                  Order Items ({items?.length})
                </h2>

                <div
                  className="space-y-3 max-h-72 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#e5e7eb #f3f4f6",
                  }}
                >
                  {items?.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0 relative">
                        <Image
                          src={item?.image}
                          alt={item?.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 line-clamp-2">
                          {item?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          ×{item?.quantity}
                        </p>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <p className="text-sm font-bold text-slate-900">
                          ₹{(item?.price * item?.quantity).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Est Delivery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Est. Delivery
                </h3>
                <p className="text-xs font-medium text-emerald-700">
                  Tomorrow 10 AM - 1 PM
                </p>
                <p className="text-xs text-slate-500">Free • Track order</p>
              </motion.div>
            </section>

            {/* ✅ Summary - REMOVED STICKY, COMPACT REWARD/COUPON */}
            <aside className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-4"
              >
                {/* ✅ COMPACT Rewards & Coupon */}
                <div className="space-y-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                  {/* Rewards - Compact with available points */}
                  <div className="flex items-center justify-between h-12 rounded-lg border border-slate-200 bg-white px-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold text-slate-900">
                        Rewards
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={rewardPoints}
                        onChange={(e) =>
                          setRewardPoints(
                            Math.min(
                              parseInt(e.target.value) || 0,
                              Math.min(maxRewardPoints, maxRedeemablePoints),
                            ),
                          )
                        }
                        className="w-16 text-sm text-slate-900 placeholder-slate-500 border-none outline-none bg-transparent text-center font-mono"
                        max={maxRewardPoints}
                      />
                      <span className="text-[11px] text-slate-500">
                        / {maxRewardPoints} pts
                      </span>
                      <button
                        onClick={() => setRewardPoints(0)}
                        className="text-xs text-blue-600 hover:underline px-1"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Coupon - Compact */}
                  <div className="relative flex items-center justify-between h-12 rounded-lg border border-slate-200 bg-white px-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-emerald-500" />
                      <input
                        type="text"
                        placeholder="WELCOME10"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        className="w-20 md:w-28 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
                      />
                    </div>
                    {!hasCoupon ? (
                      <button
                        onClick={handleApplyCoupon}
                        className="text-xs font-semibold text-emerald-600 hover:underline px-1"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1 px-1"
                      >
                        Applied <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {hasCoupon && (
                    <p className="text-[11px] text-emerald-700 text-right">
                      ₹899 discount applied!
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 p-4 bg-slate-50 rounded-xl">
                  <div className="flex justify-between text-sm py-1 border-b border-slate-200 pb-2">
                    <span>Subtotal (3 items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm text-emerald-600 font-medium py-1 border-b border-slate-200 pb-2">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>

                  {pointsDiscount > 0 && (
                    <div className="flex justify-between text-sm text-amber-600 font-medium py-1 border-b border-slate-200 pb-2">
                      <span>Reward Points ({pointsDiscount})</span>
                      <span>-₹{pointsDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-semibold py-2 border-b border-slate-200">
                    <span>Delivery</span>
                    <span className="text-emerald-600">FREE</span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xl font-bold text-slate-900 mb-1">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-500">Inclusive of taxes</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-3">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-px transition-all text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order Securely
                        <CreditCard className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <Link
                    href="/products"
                    className="block w-full text-center py-3 px-4 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all text-sm font-semibold"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <p className="text-xs text-slate-500 text-center pt-4 border-t border-slate-200 flex items-center justify-center gap-2 pb-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Safe & Secure • SSL Protected</span>
                </p>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
