import React, { useEffect, useState, useRef } from "react";
import { FileMinus, Minus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FaRegCalendarAlt } from "react-icons/fa";
import {
  removeFromCart,
  addToCart,
  getCartItems,
  createBookService,
} from "../api/apiMethods";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  _id: string;
  technicianId: string;
  serviceId: string;
  serviceName: string;
  serviceImg?: string;
  servicePrice?: number;
  price?: number;
  quantity: number;
  bookingDate: string;
  otp?: number;
  isSelected: boolean;
}

interface CartData {
  user: {
    _id: string;
    username: string;
    phoneNumber: string;
    role: string;
    buildingName: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
  };
  cart: {
    _id: string;
    userId: string;
    items: CartItem[];
  };
}

const CartPage = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [isBooking, setIsBooking] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [savingsData, setSavingsData] = useState<{
    prnvTotal: number;
    otherTotal: number;
    savings: number;
  } | null>(null);
  const dateInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const bookingIdRef = useRef(0);

  useEffect(() => {
    fetchCartData();
    // Cleanup to reset modal state when component unmounts
    return () => {
      setShowSavingsModal(false);
      setSavingsData(null);
      console.log("CartPage unmounted, resetting modal state");
    };
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        console.log("No userId found in localStorage");
        return;
      }
      const response = await getCartItems(userId);
      console.log("fetchCartData response:", response);
      if (response.success && response.result.cart) {
        const formattedItems = response.result.cart.map((item: any) => ({
          _id: item?._id,
          serviceId: item?.serviceId,
          serviceName: item?.serviceName,
          serviceImg: item?.serviceImg,
          servicePrice: item?.servicePrice || item?.price || 0,
          quantity: item.quantity,
          technicianId: item.technicianId,
          bookingDate: item.bookingDate || "",
          isSelected: false,
        }));
        const updatedCartData = {
          user: response.result.user,
          cart: {
            ...response.result.cart,
            items: formattedItems,
          },
        };

        setCartData(updatedCartData);
        // Reset selectedItems to ensure consistency
        setSelectedItems([]);
      } else {
        setError("Failed to fetch cart data");
        console.log("fetchCartData failed:", response.message);
      }
    } catch (err: any) {
      console.error("fetchCartData error:", err);
      setError(err?.message || "Failed to fetch cart data");
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarClick = (itemId: string) => {
    setSelectedItemId(itemId);
    if (dateInputRefs.current[itemId]) {
      dateInputRefs.current[itemId]?.showPicker?.();
      dateInputRefs.current[itemId]?.focus();
    }
  };

  const handleDateChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const selectedDate = e.target.value;
    setCartData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: prev.cart.items.map((item) =>
            item._id === itemId ? { ...item, bookingDate: selectedDate } : item
          ),
        },
      };
    });

    setSelectedItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, bookingDate: selectedDate } : item
      )
    );
  };

  const handleClearDate = async (itemId: string) => {
    setCartData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: prev.cart.items.map((item) =>
            item._id === itemId ? { ...item, bookingDate: "" } : item
          ),
        },
      };
    });

    setSelectedItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, bookingDate: "" } : item
      )
    );
  };

  const handleQuantityChange = async (itemId: string, delta: number) => {
    try {
      setProcessingItems((prev) => ({ ...prev, [itemId]: true }));

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        return;
      }

      const item = cartData?.cart.items.find((item) => item._id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);

      setCartData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cart: {
            ...prev.cart,
            items: prev.cart.items.map((cartItem) =>
              cartItem._id === itemId
                ? { ...cartItem, quantity: newQuantity }
                : cartItem
            ),
          },
        };
      });

      setSelectedItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      const payload = {
        userId,
        serviceId: item.serviceId,
        technicianId: item.technicianId,
        quantity: newQuantity,
      };

      await addToCart(payload);
    } catch (err: any) {
      console.error("handleQuantityChange error:", err);
      setError("Failed to update quantity");
      await fetchCartData();
    } finally {
      setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      setProcessingItems((prev) => ({ ...prev, [itemId]: true }));

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        return;
      }

      const item = cartData?.cart.items.find((item) => item._id === itemId);
      if (!item) return;

      setCartData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cart: {
            ...prev.cart,
            items: prev.cart.items.filter(
              (cartItem) => cartItem._id !== itemId
            ),
          },
        };
      });

      setSelectedItems((prev) => prev.filter((item) => item._id !== itemId));

      await removeFromCart({
        userId,
        serviceId: item.serviceId,
        technicianId: item.technicianId,
      });
    } catch (err: any) {
      console.error("handleRemove error:", err);
      setError("Failed to remove item");
      await fetchCartData();
    } finally {
      setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCheckboxChange = (itemId: string) => {
    setCartData((prev) => {
      if (!prev) return null;

      const updatedItems = prev.cart.items.map((item) => {
        if (item._id === itemId) {
          const newSelectedState = !item.isSelected;

          setSelectedItems((prev) => {
            const exists = prev.some((selected) => selected._id === itemId);
            if (newSelectedState && !exists) {
              return [...prev, { ...item, isSelected: true }];
            } else if (!newSelectedState) {
              return prev.filter((selected) => selected._id !== itemId);
            }
            return prev;
          });

          return { ...item, isSelected: newSelectedState };
        }
        return item;
      });

      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: updatedItems,
        },
      };
    });
  };

  // const handleBookNow = async () => {
  //   try {
  //     setIsBooking(true);
  //     setError(null); // Clear previous errors
  //     const userId = localStorage.getItem("userId");
  //     if (!userId) {
  //       setError("User not logged in");
  //       console.log("No userId found in localStorage");
  //       return;
  //     }

  //     if (selectedItems.length === 0) {
  //       setError("No items selected for booking");
  //       console.log("No items selected");
  //       return;
  //     }

  //     if (selectedItems.some((item) => !item.bookingDate)) {
  //       setError("Select dates for all selected items");
  //       console.log("Missing booking dates:", selectedItems);
  //       return;
  //     }

  //     const prnvTotal = selectedItems.reduce(
  //       (acc, item) => acc + (item.servicePrice || 0) * item.quantity,
  //       0
  //     );
  //     const otherBaseTotal = prnvTotal * 1.3;
  //     const otherGst = Math.round(otherBaseTotal * 0.18);
  //     const otherTotal = Math.round(otherBaseTotal) + otherGst;
  //     const savings = otherTotal - prnvTotal;

  //     const bookings = selectedItems.map((item) => ({
  //       userId,
  //       serviceId: item.serviceId,
  //       technicianId: item.technicianId,
  //       quantity: item.quantity.toString(),
  //       bookingDate: item.bookingDate,
  //       servicePrice: ((item.servicePrice || 0) * item.quantity).toString(),
  //       gst: "0",
  //       totalPrice: ((item.servicePrice || 0) * item.quantity).toString(),
  //     }));

  //     console.log("Sending bookings to API:", bookings);
  //     const response = await createBookService(bookings);
  //     console.log("createBookService response:", response);

  //     if (response.success) {
  //       console.log("Booking successful, setting savings data and showing modal");
  //       setSavingsData({ prnvTotal: Math.round(prnvTotal), otherTotal, savings });
  //       setShowSavingsModal(true);
  //       await fetchCartData();
  //     } else {
  //       setError(response.message || "Booking failed");
  //       console.log("Booking failed:", response.message);
  //     }
  //   } catch (err: any) {
  //     console.error("handleBookNow error:", err);
  //     setError(err?.message || "Failed to create bookings");
  //   } finally {
  //     setIsBooking(false);
  //   }
  // };
  const handleBookNow = async () => {
    try {
      setIsBooking(true);
      setError(null); // Clear errors
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        return;
      }

      if (selectedItems.length === 0) {
        setError("No items selected for booking");
        return;
      }

      if (selectedItems.some((item) => !item.bookingDate)) {
        setError("Select dates for all selected items");
        return;
      }

      const prnvTotal = selectedItems.reduce(
        (acc, item) => acc + (item.servicePrice || 0) * item.quantity,
        0
      );
      const otherBaseTotal = prnvTotal * 1.3;
      const otherGst = Math.round(otherBaseTotal * 0.18);
      const otherTotal = Math.round(otherBaseTotal) + otherGst;
      const savings = otherTotal - prnvTotal;

      const bookings = selectedItems.map((item) => ({
        userId,
        serviceId: item.serviceId,
        technicianId: item.technicianId,
        quantity: item.quantity.toString(),
        bookingDate: item.bookingDate,
        servicePrice: ((item.servicePrice || 0) * item.quantity).toString(),
        gst: "0",
        totalPrice: ((item.servicePrice || 0) * item.quantity).toString(),
      }));

      const response = await createBookService(bookings);

      if (response?.success) {
        bookingIdRef.current += 1; // Increment unique booking ID
        setShowSavingsModal(false); // Reset modal before showing new one
        setSavingsData({
          prnvTotal: Math.round(prnvTotal),
          otherTotal,
          savings,
        });
        setShowSavingsModal(true); // Show modal with new data
        alert("Booking conformed");
        await fetchCartData(); // Refresh cart
        setSelectedItems([]); // Clear selections for next booking
      } else {
        setError(response.message || "Booking failed");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create bookings");
    } finally {
      setIsBooking(false);
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);
    return maxDate.toISOString().split("T")[0];
  };

  const calculateItemTotal = (item: CartItem) => {
    const price = item.servicePrice || 0;
    const subtotal = price * item.quantity;
    const gst = 0;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6"
      >
        <p className="text-red-500 text-center text-lg font-semibold">
          {error}
        </p>
        <div className="flex justify-center gap-4 mt-4">
          {error.includes("log in") && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="bg-fuchsia-500 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
            >
              Log In
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCartData}
            className="bg-fuchsia-500 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (
    !cartData ||
    !cartData.cart?.items ||
    cartData.cart?.items?.length === 0
  ) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/categories")}
            className="mt-4 bg-fuchsia-500 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
          >
            Browse Services
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const isBookingDisabled =
    selectedItems.length === 0 ||
    selectedItems.some((item) => !item.bookingDate);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full py-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6"
      >
        Your Cart
      </motion.h1>

      <div className="space-y-4">
        {cartData.cart?.items?.map((item) => {
          const isProcessing = processingItems[item._id];
          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow ${
                isProcessing ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.isSelected}
                  onChange={() => handleCheckboxChange(item._id)}
                  className="h-5 w-5 text-fuchsia-500 focus:ring-fuchsia-400 mr-3 sm:mr-4 rounded"
                  disabled={isProcessing}
                />
                <img
                  src={item?.serviceImg}
                  alt={item?.serviceName}
                  className="rounded-xl w-16 h-16 object-cover border border-gray-200"
                />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-800">
                    {item?.serviceName}
                  </p>
                  <p className="text-gray-600">
                    ₹{" "}
                    <span className="text-fuchsia-600">
                      {item?.servicePrice}
                    </span>{" "}
                    per unit
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-fuchsia-50 rounded-lg px-2 py-1 border border-fuchsia-200">
                  {item.quantity === 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => !isProcessing && handleRemove(item._id)}
                      className="p-1 rounded-full hover:bg-fuchsia-100"
                      disabled={isProcessing}
                      aria-label={`Remove ${item?.serviceName}`}
                    >
                      <Trash2
                        size={16}
                        className="text-red-500 hover:text-red-700"
                      />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        !isProcessing && handleQuantityChange(item._id, -1)
                      }
                      className="p-1 rounded-full hover:bg-fuchsia-100 text-fuchsia-600"
                      disabled={isProcessing}
                      aria-label={`Decrease quantity of ${item?.serviceName}`}
                    >
                      <Minus size={12} />
                    </motion.button>
                  )}
                  <span className="text-sm text-gray-800 w-8 text-center font-mono">
                    {isProcessing ? "..." : item.quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      !isProcessing && handleQuantityChange(item._id, 1)
                    }
                    className="p-1 rounded-full hover:bg-fuchsia-100 text-fuchsia-600"
                    disabled={isProcessing}
                    aria-label={`Increase quantity of ${item?.serviceName}`}
                  >
                    <GoPlus size={16} />
                  </motion.button>
                </div>

                <div className="font-semibold text-gray-800">
                  ₹ {(item?.servicePrice || 0) * item.quantity}
                </div>

                <div className="relative flex items-center space-x-2">
                  {item.bookingDate ? (
                    <div className="flex items-center space-x-2">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="text-sm text-fuchsia-600 cursor-pointer hover:underline"
                        onClick={() => handleCalendarClick(item._id)}
                        aria-label={`Edit date for ${item?.serviceName}`}
                      >
                        📅 {item.bookingDate}
                      </motion.span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleClearDate(item._id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        aria-label={`Clear date for ${item?.serviceName}`}
                      >
                        <X
                          size={16}
                          className="text-gray-500 hover:text-gray-700"
                        />
                      </motion.button>
                    </div>
                  ) : (
                    <motion.label
                      whileHover={{ scale: 1.1 }}
                      htmlFor={`date-picker-${item._id}`}
                      className="cursor-pointer"
                      onClick={() => handleCalendarClick(item._id)}
                    >
                      <FaRegCalendarAlt
                        size={20}
                        className="text-fuchsia-600"
                      />
                    </motion.label>
                  )}
                  <input
                    id={`date-picker-${item._id}`}
                    ref={(el) => (dateInputRefs.current[item._id] = el)}
                    type="date"
                    onChange={(e) => handleDateChange(e, item._id)}
                    value={item.bookingDate}
                    className="absolute opacity-0 w-0 h-0"
                    min={new Date().toISOString().split("T")[0]}
                    max={getMaxDate()}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 border-t pt-4"
        >
          <h2 className="text-lg font-semibold mb-4">Selected Items</h2>
          {selectedItems.map((item) => {
            const { subtotal, gst, total } = calculateItemTotal(item);
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 px-4 py-3 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between">
                  <span className="font-medium">
                    {item.serviceName} ({item.quantity})
                  </span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Booking Date</span>
                  <span>
                    {item.bookingDate
                      ? new Date(item.bookingDate).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between font-semibold mt-1">
                  <span>Total</span>
                  <span className="font-mono">₹{total}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm sm:text-base font-medium mt-4 sm:mt-6"
      >
        <span className="text-gray-800 mb-2 sm:mb-0">Missed Something?</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-600 flex items-center text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
          onClick={() => navigate("/categories")}
        >
          <GoPlus size={23} className="font-bold me-1" />
          Add More Items
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 border-t pt-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full mt-4 sm:mt-6 py-3 rounded-xl text-sm sm:text-lg font-semibold transition-all ${
            isBookingDisabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:from-fuchsia-600 hover:to-purple-700"
          } ${isBooking ? "opacity-70" : ""}`}
          disabled={isBookingDisabled || isBooking}
          onClick={handleBookNow}
        >
          {isBooking
            ? "Processing..."
            : isBookingDisabled
            ? selectedItems.length === 0
              ? "Select at least one item"
              : "Select dates for all selected items"
            : "Book Now"}
        </motion.button>
      </motion.div>

      {/* <AnimatePresence>
        {showSavingsModal && savingsData && (
          <motion.div
            key="savings-modal" // Added key to force re-render
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-labelledby="savings-modal-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl border border-gray-200 relative"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSavingsModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </motion.button>
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h2 id="savings-modal-title" className="text-2xl font-bold text-gray-800 mb-2">
                  Congratulations!
                </h2>
                <p className="text-gray-600">Your booking was successful!</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-700 font-semibold">Description</th>
                      <th className="text-right py-2 text-gray-700 font-semibold">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">PRNV Service (No GST)</td>
                      <td className="text-right font-mono">{savingsData.prnvTotal}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Other Services (30% higher + 18% GST)</td>
                      <td className="text-right font-mono">{savingsData.otherTotal}</td>
                    </tr>
                    <tr className="bg-green-50 font-semibold">
                      <td className="py-2">Your Total Savings</td>
                      <td className="text-right text-green-600 font-mono">₹{savingsData.savings}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm">
                <p className="text-blue-800">
                  PRNV offers competitive pricing with <span className="font-semibold">no GST</span> and rates{" "}
                  <span className="font-semibold">30% lower</span> than competitors, saving you money!
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowSavingsModal(false);
                  setSavingsData(null); // Reset savingsData
                  navigate("/transactions");
                }}
                className="w-full bg-fuchsia-500 text-white py-3 rounded-xl font-semibold hover:bg-fuchsia-600 transition-colors"
              >
                View Transaction Details
              </motion.button>
            </motion.div>
            
              </div>
          </motion.div>
        )}
      </AnimatePresence> */}
      <AnimatePresence>
        {showSavingsModal && savingsData && (
          <motion.div
            key={`savings-modal-${bookingIdRef.current}`} // Unique key for each booking
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-labelledby="savings-modal-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl border border-gray-200 relative"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowSavingsModal(false);
                  setSavingsData(null); // Reset data
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </motion.button>
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <h2
                  id="savings-modal-title"
                  className="text-2xl font-bold text-gray-800 mb-2"
                >
                  Congratulations!
                </h2>
                <p className="text-gray-600">Your booking was successful!</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-700 font-semibold">
                        Description
                      </th>
                      <th className="text-right py-2 text-gray-700 font-semibold">
                        Amount (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">PRNV Service (No GST)</td>
                      <td className="text-right font-mono">
                        {savingsData.prnvTotal}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">
                        Other Services (30% higher + 18% GST)
                      </td>
                      <td className="text-right font-mono">
                        {savingsData.otherTotal}
                      </td>
                    </tr>
                    <tr className="bg-green-50 font-semibold">
                      <td className="py-2">Your Total Savings</td>
                      <td className="text-right text-green-600 font-mono">
                        ₹{savingsData.savings}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm">
                <p className="text-blue-800">
                  PRNV offers competitive pricing with{" "}
                  <span className="font-semibold">no GST</span> and rates{" "}
                  <span className="font-semibold">30% lower</span> than
                  competitors, saving you money!
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowSavingsModal(false);
                  setSavingsData(null);
                  navigate("/transactions");
                }}
                className="w-full bg-fuchsia-500 text-white py-3 rounded-xl font-semibold hover:bg-fuchsia-600 transition-colors"
              >
                View Transaction Details
              </motion.button>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {["💰", "🎯", "👍", "⭐"].map((emoji, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      y: 100,
                      x: Math.random() * 100,
                      opacity: 0,
                      rotate: Math.random() * 360,
                    }}
                    animate={{
                      y: -100,
                      opacity: [0, 1, 0],
                      rotate: Math.random() * 360 + 180,
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: index * 0.3,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="absolute text-2xl"
                    style={{ left: `${20 + index * 15}%` }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
// import React, { useEffect, useState, useRef } from "react";
// import { FileMinus, Minus, Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { GoPlus } from "react-icons/go";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods";
// import { motion, AnimatePresence } from "framer-motion";

// interface CartItem {
//   _id: string;
//   technicianId: string;
//   serviceId: string;
//   serviceName: string;
//   serviceImg?: string;
//   servicePrice?: number;
//   price?: number;
//   quantity: number;
//   bookingDate: string;
//   otp?: number;
//   isSelected: boolean;
// }

// interface CartData {
//   user: {
//     _id: string;
//     username: string;
//     phoneNumber: string;
//     role: string;
//     buildingName: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//   };
//   cart: {
//     _id: string;
//     userId: string;
//     items: CartItem[];
//   };
// }

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
//   const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
//   const [isBooking, setIsBooking] = useState(false);
//   const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
//   const [showSavingsModal, setShowSavingsModal] = useState(false);
//   const [savingsData, setSavingsData] = useState<{ prnvTotal: number; otherTotal: number; savings: number } | null>(null);
//   const dateInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }
//       const response = await getCartItems(userId);
//       if (response.success && response.result.cart) {
//         const formattedItems = response.result.cart.map((item: any) => ({
//           _id: item?._id,
//           serviceId: item?.serviceId,
//           serviceName: item?.serviceName,
//           serviceImg: item?.serviceImg,
//           servicePrice: item?.servicePrice,
//           quantity: item.quantity,
//           technicianId: item.technicianId,
//           bookingDate: item.bookingDate,
//           isSelected: false,
//         }));
//         const updatedCartData = {
//           user: response.result.user,
//           cart: {
//             ...response.result.cart,
//             items: formattedItems,
//           },
//         };

//         setCartData(updatedCartData);
//         setSelectedItems([]);
//       } else {
//         setError("Failed to fetch cart data");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to fetch cart data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCalendarClick = (itemId: string) => {
//     setSelectedItemId(itemId);
//     if (dateInputRefs.current[itemId]) {
//       dateInputRefs.current[itemId]?.showPicker?.();
//       dateInputRefs.current[itemId]?.focus();
//     }
//   };

//   const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
//     const selectedDate = e.target.value;
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items?.map((item) =>
//             item._id === itemId ? { ...item, bookingDate: selectedDate } : item
//           ),
//         },
//       };
//     });

//     setSelectedItems((prev) =>
//       prev.map((item) => (item._id === itemId ? { ...item, bookingDate: selectedDate } : item))
//     );
//   };

//   const handleClearDate = async (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map((item) =>
//             item._id === itemId ? { ...item, bookingDate: "" } : item
//           ),
//         },
//       };
//     });

//     setSelectedItems((prev) =>
//       prev.map((item) => (item._id === itemId ? { ...item, bookingDate: "" } : item))
//     );
//   };

//   const handleQuantityChange = async (itemId: string, delta: number) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));

//       const userId = localStorage.getItem("userId");
//       if (!userId) return;

//       const item = cartData?.cart.items.find((item) => item._id === itemId);
//       if (!item) return;

//       const newQuantity = Math.max(1, item.quantity + delta);

//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.map((cartItem) =>
//               cartItem._id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
//             ),
//           },
//         };
//       });

//       setSelectedItems((prev) =>
//         prev.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item))
//       );
//       const payload = {
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: newQuantity,
//       };

//       await addToCart(payload);
//     } catch (err: any) {
//       setError("Failed to update quantity");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleRemove = async (itemId: string) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));

//       const userId = localStorage.getItem("userId");
//       if (!userId) return;

//       const item = cartData?.cart.items.find((item) => item._id === itemId);
//       if (!item) return;

//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.filter((cartItem) => cartItem._id !== itemId),
//           },
//         };
//       });

//       setSelectedItems((prev) => prev.filter((item) => item._id !== itemId));

//       await removeFromCart({ userId, serviceId: item.serviceId, technicianId: item.technicianId });
//     } catch (err: any) {
//       console.error("Error removing item:", err);
//       setError("Failed to remove item");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleCheckboxChange = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;

//       const updatedItems = prev.cart.items.map((item) => {
//         if (item._id === itemId) {
//           const newSelectedState = !item.isSelected;

//           setSelectedItems((prev) => {
//             const exists = prev.some((selected) => selected._id === itemId);
//             if (newSelectedState && !exists) {
//               return [...prev, { ...item, isSelected: true }];
//             } else if (!newSelectedState) {
//               return prev.filter((selected) => selected._id !== itemId);
//             }
//             return prev;
//           });

//           return { ...item, isSelected: newSelectedState };
//         }
//         return item;
//       });

//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: updatedItems,
//         },
//       };
//     });
//   };

//   const handleBookNow = async () => {
//     try {
//       setIsBooking(true);
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }

//       if (selectedItems.length === 0) {
//         setError("No items selected for booking");
//         return;
//       }

//       const prnvTotal = selectedItems.reduce(
//         (acc, item) => acc + (item.servicePrice || item.price || 0) * item.quantity,
//         0
//       );
//       const otherBaseTotal = prnvTotal * 1.3;
//       const otherGst = Math.round(otherBaseTotal * 0.18);
//       const otherTotal = Math.round(otherBaseTotal) + otherGst;
//       const savings = otherTotal - prnvTotal;

//       const bookings = selectedItems.map((item) => ({
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: item.quantity.toString(),
//         bookingDate: item.bookingDate,
//         servicePrice: ((item.servicePrice || item.price || 0) * item.quantity).toString(),
//         gst: "0",
//         totalPrice: ((item.servicePrice || item.price || 0) * item.quantity).toString(),
//       }));

//       const response = await createBookService(bookings);

//       if (response.success) {
//         await fetchCartData();
//         setSavingsData({ prnvTotal: Math.round(prnvTotal), otherTotal, savings });
//         setShowSavingsModal(true);
//       } else {
//         setError(response.message || "Booking failed");
//       }
//     } catch (err: any) {
//       console.error("Error creating bookings:", err);
//       setError(err?.message || "Failed to create bookings");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const getMaxDate = () => {
//     const today = new Date();
//     const maxDate = new Date();
//     maxDate.setDate(today.getDate() + 7);
//     return maxDate.toISOString().split("T")[0];
//   };

//   const calculateItemTotal = (item: CartItem) => {
//     const price = item.servicePrice || item.price || 0;
//     const subtotal = price * item.quantity;
//     const gst = 0;
//     const total = subtotal + gst;
//     return { subtotal, gst, total };
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 flex justify-center items-center min-h-screen">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-4xl mx-auto p-6"
//       >
//         <p className="text-red-500 text-center text-lg font-semibold">{error}</p>
//         <div className="flex justify-center gap-4 mt-4">
//           {error.includes("log in") && (
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/login")}
//               className="bg-fuchsia-500 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
//             >
//               Log In
//             </motion.button>
//           )}
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={fetchCartData}
//             className="bg-fuchsia-500 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
//           >
//             Try Again
//           </motion.button>
//         </div>
//       </motion.div>
//     );
//   }

//   if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-4xl mx-auto p-6"
//       >
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
//         <div className="items-center flex flex-col">
//           <p className="text-gray-500 text-lg">Your cart is empty</p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => navigate("/categories")}
//             className="mt-4 bg-fuchsia-500 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
//           >
//             Browse Services
//           </motion.button>
//         </div>
//       </motion.div>
//     );
//   }

//   const isBookingDisabled = selectedItems.length === 0 || selectedItems.some((item) => !item.bookingDate);

//   return (
//     <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full py-6">
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6"
//       >
//         Your Cart
//       </motion.h1>

//       <div className="space-y-4">
//         {cartData.cart?.items?.map((item) => {
//           const isProcessing = processingItems[item._id];
//           return (
//             <motion.div
//               key={item._id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.3 }}
//               className={`flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow ${
//                 isProcessing ? "opacity-70" : ""
//               }`}
//             >
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={item.isSelected}
//                   onChange={() => handleCheckboxChange(item._id)}
//                   className="h-5 w-5 text-fuchsia-500 focus:ring-fuchsia-400 mr-3 sm:mr-4 rounded"
//                   disabled={isProcessing}
//                 />
//                 <img
//                   src={item?.serviceImg}
//                   alt={item?.serviceName}
//                   className="rounded-xl w-16 h-16 object-cover border border-gray-200"
//                 />
//                 <div className="ml-4">
//                   <p className="text-lg font-semibold text-gray-800">{item?.serviceName}</p>
//                   <p className="text-gray-600">
//                     ₹ <span className="text-fuchsia-600">{item?.servicePrice}</span> per unit
//                   </p>
//                   {item?.ratings && (
//                     <div className="flex items-center gap-1 mt-1">
//                       <span className="text-sm text-yellow-500">★</span>
//                       <span className="text-sm text-gray-600">{item.ratings}</span>
//                       <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-2 bg-fuchsia-50 rounded-lg px-2 py-1 border border-fuchsia-200">
//                   {item.quantity === 1 ? (
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => !isProcessing && handleRemove(item._id)}
//                       className="p-1 rounded-full hover:bg-fuchsia-100"
//                       disabled={isProcessing}
//                       aria-label={`Remove ${item?.serviceName}`}
//                     >
//                       <Trash2 size={16} className="text-red-500 hover:text-red-700" />
//                     </motion.button>
//                   ) : (
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => !isProcessing && handleQuantityChange(item._id, -1)}
//                       className="p-1 rounded-full hover:bg-fuchsia-100 text-fuchsia-600"
//                       disabled={isProcessing}
//                       aria-label={`Decrease quantity of ${item?.serviceName}`}
//                     >
//                       <Minus size={12} />
//                     </motion.button>
//                   )}
//                   <span className="text-sm text-gray-800 w-8 text-center font-mono">
//                     {isProcessing ? "..." : item.quantity}
//                   </span>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => !isProcessing && handleQuantityChange(item._id, 1)}
//                     className="p-1 rounded-full hover:bg-fuchsia-100 text-fuchsia-600"
//                     disabled={isProcessing}
//                     aria-label={`Increase quantity of ${item?.serviceName}`}
//                   >
//                     <GoPlus size={16} />
//                   </motion.button>
//                 </div>

//                 <div className="font-semibold text-gray-800">
//                   ₹ {(item?.servicePrice || 0) * item.quantity}
//                 </div>

//                 <div className="relative flex items-center space-x-2">
//                   {item.bookingDate ? (
//                     <div className="flex items-center space-x-2">
//                       <motion.span
//                         whileHover={{ scale: 1.05 }}
//                         className="text-sm text-fuchsia-600 cursor-pointer hover:underline"
//                         onClick={() => handleCalendarClick(item._id)}
//                         aria-label={`Edit date for ${item?.serviceName}`}
//                       >
//                         📅 {item.bookingDate}
//                       </motion.span>
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => handleClearDate(item._id)}
//                         className="p-1 rounded-full hover:bg-gray-100"
//                         aria-label={`Clear date for ${item?.serviceName}`}
//                       >
//                         <X size={16} className="text-gray-500 hover:text-gray-700" />
//                       </motion.button>
//                     </div>
//                   ) : (
//                     <motion.label
//                       whileHover={{ scale: 1.1 }}
//                       htmlFor={`date-picker-${item._id}`}
//                       className="cursor-pointer"
//                       onClick={() => handleCalendarClick(item._id)}
//                     >
//                       <FaRegCalendarAlt size={20} className="text-fuchsia-600" />
//                     </motion.label>
//                   )}
//                   <input
//                     id={`date-picker-${item._id}`}
//                     ref={(el) => (dateInputRefs.current[item._id] = el)}
//                     type="date"
//                     onChange={(e) => handleDateChange(e, item._id)}
//                     value={item.bookingDate}
//                     className="absolute opacity-0 w-0 h-0"
//                     min={new Date().toISOString().split("T")[0]}
//                     max={getMaxDate()}
//                   />
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {selectedItems.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mt-6 border-t pt-4"
//         >
//           <h2 className="text-lg font-semibold mb-4">Selected Items</h2>
//           {selectedItems.map((item) => {
//             const { subtotal, gst, total } = calculateItemTotal(item);
//             return (
//               <motion.div
//                 key={item._id}
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="mb-4 px-4 py-3 border rounded-lg bg-white shadow-sm"
//               >
//                 <div className="flex justify-between">
//                   <span className="font-medium">{item.serviceName} ({item.quantity})</span>
//                   <span className="font-mono">₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Booking Date</span>
//                   <span>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</span>
//                 </div>
//                 <div className="flex justify-between font-semibold mt-1">
//                   <span>Total</span>
//                   <span className="font-mono">₹{total}</span>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </motion.div>
//       )}

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm sm:text-base font-medium mt-4 sm:mt-6"
//       >
//         <span className="text-gray-800 mb-2 sm:mb-0">Missed Something?</span>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="bg-red-600 flex items-center text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
//           onClick={() => navigate("/categories")}
//         >
//           <GoPlus size={23} className="font-bold me-1" />
//           Add More Items
//         </motion.button>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mt-6 border-t pt-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className={`w-full mt-4 sm:mt-6 py-3 rounded-xl text-sm sm:text-lg font-semibold transition-all ${
//             isBookingDisabled
//               ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//               : "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:from-fuchsia-600 hover:to-purple-700"
//           } ${isBooking ? "opacity-70" : ""}`}
//           disabled={isBookingDisabled || isBooking}
//           onClick={handleBookNow}
//         >
//           {isBooking
//             ? "Processing..."
//             : isBookingDisabled
//             ? selectedItems.length === 0
//               ? "Select at least one item"
//               : "Select dates for all selected items"
//             : "Book Now"}
//         </motion.button>
//       </motion.div>

//       <AnimatePresence>
//         {showSavingsModal && savingsData && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.5 }}
//             transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
//             className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
//           >
//             <motion.div
//               initial={{ y: 50 }}
//               animate={{ y: 0 }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className="bg-gradient-to-br from-white to-fuchsia-50 p-6 rounded-2xl max-w-lg w-full shadow-2xl border border-fuchsia-100"
//             >
//               {/* Enhanced Celebration Animation */}
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.2, duration: 0.3 }}
//                 className="text-center mb-6 relative"
//               >
//                 <motion.div
//                   initial={{ scale: 0, rotate: -30 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
//                   className="text-5xl mb-2 inline-block"
//                 >
//                   🎉
//                 </motion.div>
//                 <motion.div
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.4, duration: 0.5 }}
//                   className="text-2xl font-bold text-fuchsia-700 mb-1"
//                 >
//                   Congratulations on Your Booking!
//                 </motion.div>
//                 <motion.p
//                   initial={{ y: 10, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.5, duration: 0.5 }}
//                   className="text-fuchsia-500"
//                 >
//                   You've made a smart choice with PRNV
//                 </motion.p>
//               </motion.div>

//               {/* Enhanced Savings Table */}
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3, duration: 0.4 }}
//                 className="bg-white rounded-xl p-4 shadow-md mb-5 border border-fuchsia-100"
//               >
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-fuchsia-200">
//                       <th className="text-left pb-2 text-fuchsia-600 font-semibold">Description</th>
//                       <th className="text-right pb-2 text-fuchsia-600 font-semibold">Amount (₹)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <motion.tr
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.4, duration: 0.3 }}
//                       className="border-b border-fuchsia-100"
//                     >
//                       <td className="py-3">
//                         <span className="mr-2">📦</span> PRNV Service (No GST)
//                       </td>
//                       <td className="text-right font-mono">{savingsData.prnvTotal}</td>
//                     </motion.tr>
//                     <motion.tr
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.5, duration: 0.3 }}
//                       className="border-b border-fuchsia-100"
//                     >
//                       <td className="py-3">
//                         <span className="mr-2">🏷️</span> Other Services (30% higher + 18% GST)
//                       </td>
//                       <td className="text-right font-mono">{savingsData.otherTotal}</td>
//                     </motion.tr>
//                     <motion.tr
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: 0.6, duration: 0.4 }}
//                       className="bg-fuchsia-50 font-bold"
//                     >
//                       <td className="py-3">
//                         <span className="mr-2">💰</span> Your Total Savings
//                       </td>
//                       <td className="text-right text-green-600 font-mono">₹{savingsData.savings}</td>
//                     </motion.tr>
//                   </tbody>
//                 </table>
//               </motion.div>

//               {/* Enhanced Savings Explanation */}
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.4, duration: 0.4 }}
//                 className="bg-fuchsia-50 rounded-xl p-4 mb-6 text-sm border border-fuchsia-100"
//               >
//                 <div className="flex items-start mb-2">
//                   <motion.span
//                     animate={{
//                       rotate: [0, 10, -10, 0],
//                       scale: [1, 1.2, 1]
//                     }}
//                     transition={{ repeat: Infinity, duration: 2 }}
//                     className="text-fuchsia-500 mr-2 text-lg"
//                   >
//                     💡
//                   </motion.span>
//                   <p className="text-fuchsia-700">
//                     Our PRNV service saves you money by offering competitive pricing at{" "}
//                     <span className="font-semibold">30% lower base rates</span> than competitors and{" "}
//                     <span className="font-semibold">without applying GST</span>.
//                   </p>
//                 </div>
//               </motion.div>

//               {/* Enhanced Action Button */}
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => {
//                   setShowSavingsModal(false);
//                   navigate("/transactions");
//                 }}
//                 className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
//               >
//                 <motion.span
//                   initial={{ x: -20, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   transition={{ delay: 0.7, duration: 0.4 }}
//                   className="relative z-10"
//                 >
//                   View Transaction Details 🚀
//                 </motion.span>
//                 <motion.div
//                   initial={{ scale: 0, opacity: 0 }}
//                   animate={{ scale: 25, opacity: 0 }}
//                   transition={{ delay: 0.2, duration: 0.8 }}
//                   className="absolute inset-0 bg-white opacity-10 rounded-full"
//                 />
//               </motion.button>

//               {/* Floating Emojis Animation */}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CartPage;

// import React, { useEffect, useState, useRef } from "react";
// import { FileMinus, Minus, Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { GoPlus } from "react-icons/go";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods";
// import { motion, AnimatePresence } from "framer-motion";

// interface CartItem {
//   _id: string;
//   technicianId: string;
//   serviceId: string;
//   serviceName: string;
//   serviceImg?: string;
//   servicePrice?: number;
//   price?: number;
//   quantity: number;
//   bookingDate: string;
//   otp?: number;
//   isSelected: boolean;
// }

// interface CartData {
//   user: {
//     _id: string;
//     username: string;
//     phoneNumber: string;
//     role: string;
//     buildingName: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//   };
//   cart: {
//     _id: string;
//     userId: string;
//     items: CartItem[];
//   };
// }

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
//   const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
//   const [isBooking, setIsBooking] = useState(false);
//   const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
//   const [showSavingsModal, setShowSavingsModal] = useState(false);
//   const [savingsData, setSavingsData] = useState<{ prnvTotal: number; otherTotal: number; savings: number } | null>(null);
//   const dateInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }
//       const response = await getCartItems(userId);
//       if (response.success && response.result.cart) {
//         const formattedItems = response.result.cart.map((item: any) => ({
//           _id: item?._id,
//           serviceId: item?.serviceId,
//           serviceName: item?.serviceName,
//           serviceImg: item?.serviceImg,
//           servicePrice: item?.servicePrice,
//           quantity: item.quantity,
//           technicianId: item.technicianId,
//           bookingDate: item.bookingDate,
//           isSelected: false,
//         }));
//         const updatedCartData = {
//           user: response.result.user,
//           cart: {
//             ...response.result.cart,
//             items: formattedItems,
//           },
//         };

//         setCartData(updatedCartData);
//         setSelectedItems([]);
//       } else {
//         setError("Failed to fetch cart data");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to fetch cart data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCalendarClick = (itemId: string) => {
//     setSelectedItemId(itemId);
//     if (dateInputRefs.current[itemId]) {
//       dateInputRefs.current[itemId]?.showPicker?.();
//       dateInputRefs.current[itemId]?.focus();
//     }
//   };

//   const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
//     const selectedDate = e.target.value;
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items?.map((item) =>
//             item._id === itemId ? { ...item, bookingDate: selectedDate } : item
//           ),
//         },
//       };
//     });

//     setSelectedItems((prev) =>
//       prev.map((item) => (item._id === itemId ? { ...item, bookingDate: selectedDate } : item))
//     );
//   };

//   const handleClearDate = async (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map((item) =>
//             item._id === itemId ? { ...item, bookingDate: "" } : item
//           ),
//         },
//       };
//     });

//     setSelectedItems((prev) =>
//       prev.map((item) => (item._id === itemId ? { ...item, bookingDate: "" } : item))
//     );
//   };

//   const handleQuantityChange = async (itemId: string, delta: number) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));

//       const userId = localStorage.getItem("userId");
//       if (!userId) return;

//       const item = cartData?.cart.items.find((item) => item._id === itemId);
//       if (!item) return;

//       const newQuantity = Math.max(1, item.quantity + delta);

//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.map((cartItem) =>
//               cartItem._id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
//             ),
//           },
//         };
//       });

//       setSelectedItems((prev) =>
//         prev.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item))
//       );
//       const payload = {
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: newQuantity,
//       };

//       await addToCart(payload);
//     } catch (err: any) {
//       setError("Failed to update quantity");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleRemove = async (itemId: string) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));

//       const userId = localStorage.getItem("userId");
//       if (!userId) return;

//       const item = cartData?.cart.items.find((item) => item._id === itemId);
//       if (!item) return;

//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.filter((cartItem) => cartItem._id !== itemId),
//           },
//         };
//       });

//       setSelectedItems((prev) => prev.filter((item) => item._id !== itemId));

//       await removeFromCart({ userId, serviceId: item.serviceId, technicianId: item.technicianId });
//     } catch (err: any) {
//       console.error("Error removing item:", err);
//       setError("Failed to remove item");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleCheckboxChange = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;

//       const updatedItems = prev.cart.items.map((item) => {
//         if (item._id === itemId) {
//           const newSelectedState = !item.isSelected;

//           setSelectedItems((prev) => {
//             const exists = prev.some((selected) => selected._id === itemId);
//             if (newSelectedState && !exists) {
//               return [...prev, { ...item, isSelected: true }];
//             } else if (!newSelectedState) {
//               return prev.filter((selected) => selected._id !== itemId);
//             }
//             return prev;
//           });

//           return { ...item, isSelected: newSelectedState };
//         }
//         return item;
//       });

//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: updatedItems,
//         },
//       };
//     });
//   };

//   const handleBookNow = async () => {
//     try {
//       setIsBooking(true);
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }

//       if (selectedItems.length === 0) {
//         setError("No items selected for booking");
//         return;
//       }

//       const prnvTotal = selectedItems.reduce(
//         (acc, item) => acc + (item.servicePrice || item.price || 0) * item.quantity,
//         0
//       );
//       const otherBaseTotal = prnvTotal * 1.3;
//       const otherGst = Math.round(otherBaseTotal * 0.18);
//       const otherTotal = Math.round(otherBaseTotal) + otherGst;
//       const savings = otherTotal - prnvTotal;

//       const bookings = selectedItems.map((item) => ({
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: item.quantity.toString(),
//         bookingDate: item.bookingDate,
//         servicePrice: ((item.servicePrice || item.price || 0) * item.quantity).toString(),
//         gst: "0",
//         totalPrice: ((item.servicePrice || item.price || 0) * item.quantity).toString(),
//       }));

//       const response = await createBookService(bookings);

//       if (response.success) {
//         await fetchCartData();
//         setSavingsData({ prnvTotal: Math.round(prnvTotal), otherTotal, savings });
//         setShowSavingsModal(true);
//       } else {
//         setError(response.message || "Booking failed");
//       }
//     } catch (err: any) {
//       console.error("Error creating bookings:", err);
//       setError(err?.message || "Failed to create bookings");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const getMaxDate = () => {
//     const today = new Date();
//     const maxDate = new Date();
//     maxDate.setDate(today.getDate() + 7);
//     return maxDate.toISOString().split("T")[0];
//   };

//   const calculateItemTotal = (item: CartItem) => {
//     const price = item.servicePrice || item.price || 0;
//     const subtotal = price * item.quantity;
//     const gst = 0;
//     const total = subtotal + gst;
//     return { subtotal, gst, total };
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 flex justify-center items-center min-h-screen">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-4xl mx-auto p-6"
//       >
//         <p className="text-red-500 text-center text-lg font-semibold">{error}</p>
//         <div className="flex justify-center gap-4 mt-4">
//           {error.includes("log in") && (
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/login")}
//               className="bg-fuchsia-500 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
//             >
//               Log In
//             </motion.button>
//           )}
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={fetchCartData}
//             className="bg-fuchsia-500 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
//           >
//             Try Again
//           </motion.button>
//         </div>
//       </motion.div>
//     );
//   }

//   if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-4xl mx-auto p-6"
//       >
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
//         <div className="items-center flex flex-col">
//           <p className="text-gray-500 text-lg">Your cart is empty</p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => navigate("/categories")}
//             className="mt-4 bg-fuchsia-500 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
//           >
//             Browse Services
//           </motion.button>
//         </div>
//       </motion.div>
//     );
//   }

//   const isBookingDisabled = selectedItems.length === 0 || selectedItems.some((item) => !item.bookingDate);

//   return (
//     <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full py-6">
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6"
//       >
//         Your Cart
//       </motion.h1>

//       <div className="space-y-4">
//         {cartData.cart?.items?.map((item) => {
//           const isProcessing = processingItems[item._id];
//           return (
//             <motion.div
//               key={item._id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.3 }}
//               className={`flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow ${
//                 isProcessing ? "opacity-70" : ""
//               }`}
//             >
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={item.isSelected}
//                   onChange={() => handleCheckboxChange(item._id)}
//                   className="h-5 w-5 text-fuchsia-500 focus:ring-fuchsia-400 mr-3 sm:mr-4 rounded"
//                   disabled={isProcessing}
//                 />
//                 <img
//                   src={item?.serviceImg}
//                   alt={item?.serviceName}
//                   className="rounded-xl w-16 h-16 object-cover border border-gray-200"
//                 />
//                 <div className="ml-4">
//                   <p className="text-lg font-semibold text-gray-800">{item?.serviceName}</p>
//                   <p className="text-gray-600">
//                     ₹ <span className="text-fuchsia-600">{item?.servicePrice}</span> per unit
//                   </p>
//                   {item?.ratings && (
//                     <div className="flex items-center gap-1 mt-1">
//                       <span className="text-sm text-yellow-500">★</span>
//                       <span className="text-sm text-gray-600">{item.ratings}</span>
//                       <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-2 bg-fuchsia-50 rounded-lg px-2 py-1 border border-fuchsia-200">
//                   {item.quantity === 1 ? (
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => !isProcessing && handleRemove(item._id)}
//                       className="p-1 rounded-full hover:bg-fuchsia-100"
//                       disabled={isProcessing}
//                       aria-label={`Remove ${item?.serviceName}`}
//                     >
//                       <Trash2 size={16} className="text-red-500 hover:text-red-700" />
//                     </motion.button>
//                   ) : (
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => !isProcessing && handleQuantityChange(item._id, -1)}
//                       className="p-1 rounded-full hover:bg-fuchsia-100 text-fuchsia-600"
//                       disabled={isProcessing}
//                       aria-label={`Decrease quantity of ${item?.serviceName}`}
//                     >
//                       <Minus size={12} />
//                     </motion.button>
//                   )}
//                   <span className="text-sm text-gray-800 w-8 text-center font-mono">
//                     {isProcessing ? "..." : item.quantity}
//                   </span>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => !isProcessing && handleQuantityChange(item._id, 1)}
//                     className="p-1 rounded-full hover:bg-fuchsia-100 text-fuchsia-600"
//                     disabled={isProcessing}
//                     aria-label={`Increase quantity of ${item?.serviceName}`}
//                   >
//                     <GoPlus size={16} />
//                   </motion.button>
//                 </div>

//                 <div className="font-semibold text-gray-800">
//                   ₹ {(item?.servicePrice || 0) * item.quantity}
//                 </div>

//                 <div className="relative flex items-center space-x-2">
//                   {item.bookingDate ? (
//                     <div className="flex items-center space-x-2">
//                       <motion.span
//                         whileHover={{ scale: 1.05 }}
//                         className="text-sm text-fuchsia-600 cursor-pointer hover:underline"
//                         onClick={() => handleCalendarClick(item._id)}
//                         aria-label={`Edit date for ${item?.serviceName}`}
//                       >
//                         📅 {item.bookingDate}
//                       </motion.span>
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => handleClearDate(item._id)}
//                         className="p-1 rounded-full hover:bg-gray-100"
//                         aria-label={`Clear date for ${item?.serviceName}`}
//                       >
//                         <X size={16} className="text-gray-500 hover:text-gray-700" />
//                       </motion.button>
//                     </div>
//                   ) : (
//                     <motion.label
//                       whileHover={{ scale: 1.1 }}
//                       htmlFor={`date-picker-${item._id}`}
//                       className="cursor-pointer"
//                       onClick={() => handleCalendarClick(item._id)}
//                     >
//                       <FaRegCalendarAlt size={20} className="text-fuchsia-600" />
//                     </motion.label>
//                   )}
//                   <input
//                     id={`date-picker-${item._id}`}
//                     ref={(el) => (dateInputRefs.current[item._id] = el)}
//                     type="date"
//                     onChange={(e) => handleDateChange(e, item._id)}
//                     value={item.bookingDate}
//                     className="absolute opacity-0 w-0 h-0"
//                     min={new Date().toISOString().split("T")[0]}
//                     max={getMaxDate()}
//                   />
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {selectedItems.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mt-6 border-t pt-4"
//         >
//           <h2 className="text-lg font-semibold mb-4">Selected Items</h2>
//           {selectedItems.map((item) => {
//             const { subtotal, gst, total } = calculateItemTotal(item);
//             return (
//               <motion.div
//                 key={item._id}
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="mb-4 px-4 py-3 border rounded-lg bg-white shadow-sm"
//               >
//                 <div className="flex justify-between">
//                   <span className="font-medium">{item.serviceName} ({item.quantity})</span>
//                   <span className="font-mono">₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Booking Date</span>
//                   <span>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</span>
//                 </div>
//                 <div className="flex justify-between font-semibold mt-1">
//                   <span>Total</span>
//                   <span className="font-mono">₹{total}</span>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </motion.div>
//       )}

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm sm:text-base font-medium mt-4 sm:mt-6"
//       >
//         <span className="text-gray-800 mb-2 sm:mb-0">Missed Something?</span>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="bg-red-600 flex items-center text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
//           onClick={() => navigate("/categories")}
//         >
//           <GoPlus size={23} className="font-bold me-1" />
//           Add More Items
//         </motion.button>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mt-6 border-t pt-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className={`w-full mt-4 sm:mt-6 py-3 rounded-xl text-sm sm:text-lg font-semibold transition-all ${
//             isBookingDisabled
//               ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//               : "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:from-fuchsia-600 hover:to-purple-700"
//           } ${isBooking ? "opacity-70" : ""}`}
//           disabled={isBookingDisabled || isBooking}
//           onClick={handleBookNow}
//         >
//           {isBooking
//             ? "Processing..."
//             : isBookingDisabled
//             ? selectedItems.length === 0
//               ? "Select at least one item"
//               : "Select dates for all selected items"
//             : "Book Now"}
//         </motion.button>
//       </motion.div>

//       <AnimatePresence>
//         {showSavingsModal && savingsData && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.5 }}
//             transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
//             className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
//           >
//             <motion.div
//               initial={{ y: 50 }}
//               animate={{ y: 0 }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className="bg-gradient-to-br from-white to-fuchsia-50 p-6 rounded-2xl max-w-lg w-full shadow-2xl border border-fuchsia-100"
//             >
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.2, duration: 0.3 }}
//                 className="text-center mb-6"
//               >
//                 <div className="text-4xl mb-2">🎉</div>
//                 <h2 className="text-2xl font-bold text-fuchsia-700 mb-1">Congratulations on Your Booking!</h2>
//                 <p className="text-fuchsia-500">You've made a smart choice with PRNV</p>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3, duration: 0.4 }}
//                 className="bg-white rounded-xl p-4 shadow-md mb-5 border border-fuchsia-100"
//               >
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-fuchsia-200">
//                       <th className="text-left pb-2 text-fuchsia-600 font-semibold">Description</th>
//                       <th className="text-right pb-2 text-fuchsia-600 font-semibold">Amount (₹)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr className="border-b border-fuchsia-100">
//                       <td className="py-3">
//                         <span className="mr-2">📦</span> PRNV Service (No GST)
//                       </td>
//                       <td className="text-right font-mono">{savingsData.prnvTotal}</td>
//                     </tr>
//                     <tr className="border-b border-fuchsia-100">
//                       <td className="py-3">
//                         <span className="mr-2">🏷️</span> Other Services (30% higher + 18% GST)
//                       </td>
//                       <td className="text-right font-mono">{savingsData.otherTotal}</td>
//                     </tr>
//                     <tr className="bg-fuchsia-50 font-bold">
//                       <td className="py-3">
//                         <span className="mr-2">💰</span> Your Total Savings
//                       </td>
//                       <td className="text-right text-green-600 font-mono">₹{savingsData.savings}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.4, duration: 0.4 }}
//                 className="bg-fuchsia-50 rounded-xl p-4 mb-6 text-sm border border-fuchsia-100"
//               >
//                 <div className="flex items-start mb-2">
//                   <span className="text-fuchsia-500 mr-2">💡</span>
//                   <p className="text-fuchsia-700">
//                     Our PRNV service saves you money by offering competitive pricing at{" "}
//                     <span className="font-semibold">30% lower base rates</span> than competitors and{" "}
//                     <span className="font-semibold">without applying GST</span>.
//                   </p>
//                 </div>
//               </motion.div>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => {
//                   setShowSavingsModal(false);
//                   navigate("/transactions");
//                 }}
//                 className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
//               >
//                 View Transaction Details 🚀
//               </motion.button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CartPage;

// import React, { useEffect, useState, useRef } from "react";
// import { FileMinus, Minus, Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { GoPlus } from "react-icons/go";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods";

// interface CartItem {
//   _id: string;
//   // serviceId: {
//   //   _id: string;
//   //   technicianId: string;
//   //   serviceName: string;
//   //   serviceImg?: string;
//   //   servicePrice?: number;
//   //   price?: number;
//   //   image?: string;
//   //   ratings?: number;
//   //   reviews?: number;
//   // };
//   technicianId: string;
//   serviceId : string;
//   serviceName: string;
//   serviceImg?: string;
//   servicePrice?: number;
//   price?: number;
//   quantity: number;
//   bookingDate: string;
//   otp?: number;
//   isSelected: boolean;
// }

// interface CartData {
//   user: {
//     _id: string;
//     username: string;
//     phoneNumber: string;
//     role: string;
//     buildingName: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//   };
//   cart: {
//     _id: string;
//     userId: string;
//     items: CartItem[];
//   };
// }

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
//   const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
//   const [isBooking, setIsBooking] = useState(false);
//   const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
//   const dateInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       const userId = localStorage.getItem('userId');
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }
//       const response = await getCartItems(userId);
//       if (response.success && response.result.cart) {

//         const formattedItems = response.result.cart.map((item: any) => ({
//           _id: item?._id,
//           serviceId: item?.serviceId,
//           serviceName: item?.serviceName,
//           serviceImg: item?.serviceImg,
//           servicePrice: item?.servicePrice,
//           quantity: item.quantity,
//           technicianId: item.technicianId,
//           bookingDate: item.bookingDate,
//           isSelected: false,
//         }));
//         const updatedCartData = {
//           user: response.result.user,
//           cart: {
//             ...response.result.cart,
//             items: formattedItems,
//           },
//         };

//         setCartData(updatedCartData);
//         setSelectedItems([]);
//       } else {
//         setError("Failed to fetch cart data");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to fetch cart data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCalendarClick = (itemId: string) => {
//     setSelectedItemId(itemId);
//     if (dateInputRefs.current[itemId]) {
//       dateInputRefs.current[itemId]?.showPicker?.();
//       dateInputRefs.current[itemId]?.focus();
//     }
//   };

//   const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
//     const selectedDate = e.target.value;
//     setCartData(prev => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items?.map(item =>
//             item._id === itemId ? { ...item, bookingDate: selectedDate } : item
//           )
//         }
//       };
//     });

//     setSelectedItems(prev =>
//       prev.map(item =>
//         item._id === itemId ? { ...item, bookingDate: selectedDate } : item
//       )
//     );
//   };

//   const handleClearDate = async (itemId: string) => {
//     setCartData(prev => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map(item =>
//             item._id === itemId ? { ...item, bookingDate: "" } : item
//           )
//         }
//       };
//     });

//     setSelectedItems(prev =>
//       prev.map(item =>
//         item._id === itemId ? { ...item, bookingDate: "" } : item
//       )
//     );
//   };

//   const handleQuantityChange = async (itemId: string, delta: number) => {
//     try {
//       setProcessingItems(prev => ({ ...prev, [itemId]: true }));

//       const userId = localStorage.getItem('userId');
//       if (!userId) return;

//       const item = cartData?.cart.items.find((item) => item._id === itemId);
//       if (!item) return;

//       const newQuantity = Math.max(1, item.quantity + delta);

//       setCartData(prev => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.map(cartItem =>
//               cartItem._id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
//             )
//           }
//         };
//       });

//       setSelectedItems(prev =>
//         prev.map(item =>
//           item._id === itemId ? { ...item, quantity: newQuantity } : item
//         )
//       );
//       const payload = {
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: newQuantity
//       };

//       await addToCart(payload);
//     } catch (err: any) {
//       setError("Failed to update quantity");
//       await fetchCartData();
//     } finally {
//       setProcessingItems(prev => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleRemove = async (itemId: string) => {
//     try {
//       setProcessingItems(prev => ({ ...prev, [itemId]: true }));

//       const userId = localStorage.getItem('userId');
//       if (!userId) return;

//       const item = cartData?.cart.items.find((item) => item._id === itemId);
//       if (!item) return;

//       setCartData(prev => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.filter(cartItem => cartItem._id !== itemId)
//           }
//         };
//       });

//       setSelectedItems(prev => prev.filter(item => item._id !== itemId));

//       await removeFromCart({ userId, serviceId: item.serviceId, technicianId: item.technicianId });
//     } catch (err: any) {
//       console.error("Error removing item:", err);
//       setError("Failed to remove item");
//       await fetchCartData();
//     } finally {
//       setProcessingItems(prev => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleCheckboxChange = (itemId: string) => {
//     setCartData(prev => {
//       if (!prev) return null;

//       const updatedItems = prev.cart.items.map(item => {
//         if (item._id === itemId) {
//           const newSelectedState = !item.isSelected;

//           setSelectedItems(prev => {
//             const exists = prev.some(selected => selected._id === itemId);
//             if (newSelectedState && !exists) {
//               return [...prev, { ...item, isSelected: true }];
//             } else if (!newSelectedState) {
//               return prev.filter(selected => selected._id !== itemId);
//             }
//             return prev;
//           });

//           return { ...item, isSelected: newSelectedState };
//         }
//         return item;
//       });

//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: updatedItems,
//         },
//       };
//     });
//   };

//   const handleBookNow = async () => {
//     try {
//       setIsBooking(true);
//       const userId = localStorage.getItem('userId');
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }
//       console.log("selectedItems", selectedItems)

//       if (selectedItems.length === 0) {
//         setError("No items selected for booking");
//         return;
//       }

//       const bookings = selectedItems.map(item => ({
//         userId,
//         serviceId: item.serviceId,
//         // serviceId: item.serviceId._id,
//         technicianId: item.technicianId,
//         quantity: item.quantity.toString(),
//         bookingDate: item.bookingDate,
//         servicePrice: ((item.servicePrice || item.price || 0) * item.quantity).toString(),
//         gst: Math.round((item.servicePrice || item.price || 0) * item.quantity * 0.18).toString(),
//         totalPrice: Math.round((item.servicePrice || item.price || 0) * item.quantity * 1.18).toString()
//       }));

//       const response = await createBookService(bookings);

//       if (response.success) {
//         await fetchCartData();
//         navigate("/transactions")
//       } else {
//         setError(response.message || "Booking failed");
//       }
//     } catch (err: any) {
//       console.error("Error creating bookings:", err);
//       setError(err?.message || "Failed to create bookings");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const getMaxDate = (unit = 'week') => {
//     const today = new Date();
//     const maxDate = new Date();
//     maxDate.setDate(today.getDate() + 7);
//     return maxDate.toISOString().split("T")[0];
//   };

//   const calculateItemTotal = (item: CartItem) => {
//     const price = item.servicePrice || item.price || 0;
//     const subtotal = price * item.quantity;
//     const gst = Math.round(subtotal * 0.18);
//     const total = subtotal + gst;
//     return { subtotal, gst, total };
//   };

//   if (loading) {
//     return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
//   }

// if (error) {
//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <p className="text-red-500 text-center">{error}</p>
//       <div className="flex justify-center gap-4 mt-4">
//         {error.includes("log in") && (
//           <button
//             onClick={() => navigate("/login")}
//             className="bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
//           >
//             Log In
//           </button>
//         )}
//         <button
//           onClick={() => setError(null)}
//           className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
//         >
//           Try Again
//         </button>
//       </div>
//     </div>
//   );
// }

//   if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

//         <div className="items-center flex flex-col">
//           <p className="text-gray-500">Your cart is empty</p>
//           <button
//             onClick={() => navigate("/categories")}
//             className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
//           >
//             Browse Services
//           </button>

//         </div>
//       </div>
//     );
//   }

//   const isBookingDisabled = selectedItems.length === 0 ||
//     selectedItems.some((item) => !item.bookingDate);

//   return (
//     <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full py-6">
//       <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Your Cart</h1>

//       <div className="space-y-4">
//         {cartData.cart?.items?.map((item) => {

//           const isProcessing = processingItems[item._id];
//           return (
//             <div
//               key={item._id}
//               className={`flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow ${isProcessing ? "opacity-70" : ""
//                 }`}
//             >
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={item.isSelected}
//                   onChange={() => handleCheckboxChange(item._id)}
//                   className="h-5 w-5 text-fuchsia-500 focus:ring-fuchsia-400 mr-3 sm:mr-4"
//                   disabled={isProcessing}
//                 />
//                 <img
//                   src={item?.serviceImg }
//                   alt={item?.serviceName}
//                   className="rounded-xl w-16 h-16 object-cover"
//                 />
//                 <div className="ml-4">
//                   <p className="text-lg font-semibold">{item?.serviceName}</p>
//                   <p className="text-gray-600">
//                     ₹ <span className="clr-blue">{item?.servicePrice}</span> per unit
//                   </p>
//                   {item?.ratings && (
//                     <div className="flex items-center gap-1 mt-1">
//                       <span className="text-sm text-yellow-500">★</span>
//                       <span className="text-sm text-gray-600">{item.ratings}</span>
//                       <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-2 bg-fuchsia-100 rounded-lg px-2 border border-fuchsia-400">
//                   {item.quantity === 1 ? (
//                     <button
//                       onClick={() => !isProcessing && handleRemove(item._id)}
//                       className="p-1 rounded-full hover:bg-gray-200"
//                       disabled={isProcessing}
//                       aria-label={`Remove ${item?.serviceName}`}
//                     >
//                       <Trash2 size={16} className="text-red-500 hover:text-red-700" />
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => !isProcessing && handleQuantityChange(item._id, -1)}
//                       className="p-1 rounded-full hover:bg-gray-200 clr-purple"
//                       disabled={isProcessing}
//                       aria-label={`Decrease quantity of ${item?.serviceName}`}
//                     >
//                       <Minus size={12} />
//                     </button>
//                   )}
//                   <span className="text-sm text-black w-8 text-center">
//                     {isProcessing ? "..." : item.quantity}
//                   </span>
//                   <button
//                     onClick={() => !isProcessing && handleQuantityChange(item._id, 1)}
//                     className="p-1 rounded-full hover:bg-gray-200 clr-purple"
//                     disabled={isProcessing}
//                     aria-label={`Increase quantity of ${item?.serviceName}`}
//                   >
//                     <GoPlus size={16} />
//                   </button>
//                 </div>

//                 <div className="font-semibold text-gray-800">
//                   ₹ {(item?.servicePrice || 0) * item.quantity}
//                 </div>

//                 <div className="relative flex items-center space-x-2">
//                   {item.bookingDate ? (
//                     <div className="flex items-center space-x-2">
//                       <span
//                         className="text-sm text-blue-600 cursor-pointer hover:underline"
//                         onClick={() => handleCalendarClick(item._id)}
//                         aria-label={`Edit date for ${item?.serviceName}`}
//                       >
//                         📅 {item.bookingDate}
//                       </span>
//                       <button
//                         onClick={() => handleClearDate(item._id)}
//                         className="p-1 rounded-full hover:bg-gray-200"
//                         aria-label={`Clear date for ${item?.serviceName}`}
//                       >
//                         <X size={16} className="text-gray-500 hover:text-gray-700" />
//                       </button>
//                     </div>
//                   ) : (
//                     // <FaRegCalendarAlt
//                     //   size={20}
//                     //   className="cursor-pointer clr-blue"
//                     //   onClick={() => handleCalendarClick(item._id)}
//                     //   aria-label={`Select date for ${item.serviceId.serviceName}`}
//                     // />
//                     <label htmlFor={`date-picker-${item._id}`} className="cursor-pointer" onClick={() => handleCalendarClick(item._id)}>
//                       <FaRegCalendarAlt size={20} className="clr-blue" />
//                     </label>
//                   )}
//                   <input
//                     id={`date-picker-${item._id}`}
//                     ref={(el) => (dateInputRefs.current[item._id] = el)}
//                     type="date"
//                     onChange={(e) => handleDateChange(e, item._id)}
//                     value={item.bookingDate}
//                     className="absolute opacity-0 w-0 h-0"
//                     min={new Date().toISOString().split("T")[0]}
//                     max={getMaxDate()}
//                   />

//                   {/* <input
//                     id={`date-picker-${item._id}`}
//                     ref={(el) => (dateInputRefs.current[item._id] = el)}
//                     type="date"
//                     onChange={(e) => handleDateChange(e, item._id)}
//                     value={item.bookingDate}
//                     className="absolute hidden "
//                     min={new Date().toISOString().split("T")[0]}
//                     max={getMaxDate()} */}
//                   {/* /> */}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {selectedItems.length > 0 && (
//         <div className="mt-6 border-t pt-4">
//           <h2 className="text-lg font-semibold mb-4">Selected Items</h2>
//           {selectedItems.map((item) => {
//             const { subtotal, gst, total } = calculateItemTotal(item);
//             return (
//               <div key={item._id} className="mb-4 px-4 py-3 border rounded-lg space-y-1">
//                 <div className="flex justify-between">
//                   <span>{item.serviceName} ({item.quantity})</span>
//                   <span>₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Booking Date</span>
//                   <span>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>GST (18%)</span>
//                   <span>₹{gst}</span>
//                 </div>
//                 <div className="flex justify-between font-semibold mt-1">
//                   <span>Total</span>
//                   <span>₹{total}</span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm sm:text-base font-medium mt-4 sm:mt-6">
//         <span className="text-gray-800 mb-2 sm:mb-0">Missed Something?</span>
//         <button
//           className="bg-red-600 flex items-center text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
//           onClick={() => navigate("/categories")}
//         >
//           <GoPlus size={23} className="font-bold me-1"/>
//           Add More Items
//         </button>
//       </div>

//       <div className="mt-6 border-t pt-4">
//         <button
//           className={`w-full mt-4 sm:mt-6 py-3 rounded-xl text-sm sm:text-lg font-semibold transition-all ${isBookingDisabled
//             ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//             : "bg-fuchsia-500 text-white hover:bg-fuchsia-600"
//             } ${isBooking ? "opacity-70" : ""}`}
//           disabled={isBookingDisabled || isBooking}
//           onClick={handleBookNow}
//         >
//           {isBooking ? "Processing..." :
//             isBookingDisabled
//               ? selectedItems.length === 0
//                 ? "Select at least one item"
//                 : "Select dates for all selected items"
//               : "Book Now"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
