import React, { useEffect, useState, useRef } from "react";
import { FileMinus, Minus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods";

interface CartItem {
  _id: string;
  serviceId: {
    _id: string;
    technicianId: string;
    serviceName: string;
    serviceImg?: string;
    servicePrice?: number;
    price?: number;
    image?: string;
    ratings?: number;
    reviews?: number;
  };
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
  const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
  const [isBooking, setIsBooking] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const dateInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError("User not logged in");
        return;
      }

      const response = await getCartItems(userId);

      if (response.success && response.result.cart) {
        console.log(response)
        const formattedItems = response.result.cart.items.map((item: any) => ({
          _id: item?._id,
          serviceId: {
            _id: item?.serviceId?._id,
            technicianId: item.serviceId?.technicianId,
            serviceName: item.serviceId?.serviceName,
            serviceImg: item.serviceId?.serviceImg,
            servicePrice: item.serviceId?.servicePrice,
            price: item.serviceId?.price,
            image: item.serviceId?.image,
            ratings: item.serviceId?.ratings,
            reviews: item.serviceId?.reviews,
          },
          quantity: item.quantity,
          bookingDate: item.bookingDate,
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
        setSelectedItems([]);
      } else {
        setError("Failed to fetch cart data");
      }
    } catch (err: any) {
      console.error("Error fetching cart:", err);
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

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const selectedDate = e.target.value;
    setCartData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: prev.cart.items.map(item =>
            item._id === itemId ? { ...item, bookingDate: selectedDate } : item
          )
        }
      };
    });

    setSelectedItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, bookingDate: selectedDate } : item
      )
    );
  };

  const handleClearDate = async (itemId: string) => {
    setCartData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: prev.cart.items.map(item =>
            item._id === itemId ? { ...item, bookingDate: "" } : item
          )
        }
      };
    });

    setSelectedItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, bookingDate: "" } : item
      )
    );
  };

  const handleQuantityChange = async (itemId: string, delta: number) => {
    try {
      setProcessingItems(prev => ({ ...prev, [itemId]: true }));

      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const item = cartData?.cart.items.find((item) => item._id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);

      setCartData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          cart: {
            ...prev.cart,
            items: prev.cart.items.map(cartItem =>
              cartItem._id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
            )
          }
        };
      });

      setSelectedItems(prev =>
        prev.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      const payload = {
        userId,
        serviceId: item.serviceId._id,
        quantity: newQuantity
      };

      await addToCart(payload);
    } catch (err: any) {
      console.error("Error changing quantity:", err);
      setError("Failed to update quantity");
      await fetchCartData();
    } finally {
      setProcessingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      setProcessingItems(prev => ({ ...prev, [itemId]: true }));

      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const item = cartData?.cart.items.find((item) => item._id === itemId);
      if (!item) return;

      setCartData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          cart: {
            ...prev.cart,
            items: prev.cart.items.filter(cartItem => cartItem._id !== itemId)
          }
        };
      });

      setSelectedItems(prev => prev.filter(item => item._id !== itemId));

      await removeFromCart({ userId, serviceId: item.serviceId._id });
    } catch (err: any) {
      console.error("Error removing item:", err);
      setError("Failed to remove item");
      await fetchCartData();
    } finally {
      setProcessingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCheckboxChange = (itemId: string) => {
    setCartData(prev => {
      if (!prev) return null;

      const updatedItems = prev.cart.items.map(item => {
        if (item._id === itemId) {
          const newSelectedState = !item.isSelected;

          setSelectedItems(prev => {
            const exists = prev.some(selected => selected._id === itemId);
            if (newSelectedState && !exists) {
              return [...prev, { ...item, isSelected: true }];
            } else if (!newSelectedState) {
              return prev.filter(selected => selected._id !== itemId);
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

  const handleBookNow = async () => {
    try {
      setIsBooking(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError("User not logged in");
        return;
      }

      if (selectedItems.length === 0) {
        setError("No items selected for booking");
        return;
      }

      const bookings = selectedItems.map(item => ({
        userId,
        serviceId: item.serviceId._id,
        technicianId: item.serviceId.technicianId,
        quantity: item.quantity.toString(),
        bookingDate: item.bookingDate,
        servicePrice: ((item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity).toString(),
        gst: Math.round((item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity * 0.18).toString(),
        totalPrice: Math.round((item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity * 1.18).toString()
      }));

      const response = await createBookService(bookings);

      if (response.success) {
        await fetchCartData();
      } else {
        setError(response.message || "Booking failed");
      }
    } catch (err: any) {
      console.error("Error creating bookings:", err);
      setError(err?.message || "Failed to create bookings");
    } finally {
      setIsBooking(false);
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    return nextMonth.toISOString().split("T")[0];
  };

  const calculateItemTotal = (item: CartItem) => {
    const price = item.serviceId.servicePrice || item.serviceId.price || 0;
    const subtotal = price * item.quantity;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-500 text-center">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!cartData || !cartData.cart.items || cartData.cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

        <div className="items-center flex flex-col">
          <p className="text-gray-500">Your cart is empty</p>
          <button
            onClick={() => navigate("/categories")}
            className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
          >
            Browse Services
          </button>

        </div>
      </div>
    );
  }

  const isBookingDisabled = selectedItems.length === 0 ||
    selectedItems.some((item) => !item.bookingDate);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full py-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartData.cart.items.map((item) => {
          const isProcessing = processingItems[item._id];
          return (
            <div
              key={item._id}
              className={`flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow ${isProcessing ? "opacity-70" : ""
                }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.isSelected}
                  onChange={() => handleCheckboxChange(item._id)}
                  className="h-5 w-5 text-fuchsia-500 focus:ring-fuchsia-400 mr-3 sm:mr-4"
                  disabled={isProcessing}
                />
                <img
                  src={item.serviceId.serviceImg || item.serviceId.image || "https://via.placeholder.com/64"}
                  alt={item.serviceId.serviceName}
                  className="rounded-xl w-16 h-16 object-cover"
                />
                <div className="ml-4">
                  <p className="text-lg font-semibold">{item.serviceId.serviceName}</p>
                  <p className="text-gray-600">
                    ₹ <span className="clr-blue">{item.serviceId.servicePrice || item.serviceId.price}</span> per unit
                  </p>
                  {item.serviceId.ratings && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">{item.serviceId.ratings}</span>
                      <span className="text-sm text-gray-500">({item.serviceId.reviews} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-fuchsia-100 rounded-lg px-2 border border-fuchsia-400">
                  {item.quantity === 1 ? (
                    <button
                      onClick={() => !isProcessing && handleRemove(item._id)}
                      className="p-1 rounded-full hover:bg-gray-200"
                      disabled={isProcessing}
                      aria-label={`Remove ${item.serviceId.serviceName}`}
                    >
                      <Trash2 size={16} className="text-red-500 hover:text-red-700" />
                    </button>
                  ) : (
                    <button
                      onClick={() => !isProcessing && handleQuantityChange(item._id, -1)}
                      className="p-1 rounded-full hover:bg-gray-200 clr-purple"
                      disabled={isProcessing}
                      aria-label={`Decrease quantity of ${item.serviceId.serviceName}`}
                    >
                      <Minus size={12} />
                    </button>
                  )}
                  <span className="text-sm text-black w-8 text-center">
                    {isProcessing ? "..." : item.quantity}
                  </span>
                  <button
                    onClick={() => !isProcessing && handleQuantityChange(item._id, 1)}
                    className="p-1 rounded-full hover:bg-gray-200 clr-purple"
                    disabled={isProcessing}
                    aria-label={`Increase quantity of ${item.serviceId.serviceName}`}
                  >
                    <GoPlus size={16} />
                  </button>
                </div>

                <div className="font-semibold text-gray-800">
                  ₹ {(item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity}
                </div>

                <div className="relative flex items-center space-x-2">
                  {item.bookingDate ? (
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-sm text-blue-600 cursor-pointer hover:underline"
                        onClick={() => handleCalendarClick(item._id)}
                        aria-label={`Edit date for ${item.serviceId.serviceName}`}
                      >
                        📅 {item.bookingDate}
                      </span>
                      <button
                        onClick={() => handleClearDate(item._id)}
                        className="p-1 rounded-full hover:bg-gray-200"
                        aria-label={`Clear date for ${item.serviceId.serviceName}`}
                      >
                        <X size={16} className="text-gray-500 hover:text-gray-700" />
                      </button>
                    </div>
                  ) : (
                    // <FaRegCalendarAlt
                    //   size={20}
                    //   className="cursor-pointer clr-blue"
                    //   onClick={() => handleCalendarClick(item._id)}
                    //   aria-label={`Select date for ${item.serviceId.serviceName}`}
                    // />
                    <label htmlFor={`date-picker-${item._id}`} className="cursor-pointer" onClick={() => handleCalendarClick(item._id)}>
                      <FaRegCalendarAlt size={20} className="clr-blue" />
                    </label>
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

                  {/* <input
                    id={`date-picker-${item._id}`}
                    ref={(el) => (dateInputRefs.current[item._id] = el)}
                    type="date"
                    onChange={(e) => handleDateChange(e, item._id)}
                    value={item.bookingDate}
                    className="absolute hidden "
                    min={new Date().toISOString().split("T")[0]}
                    max={getMaxDate()} */}
                  {/* /> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">Selected Items</h2>
          {selectedItems.map((item) => {
            const { subtotal, gst, total } = calculateItemTotal(item);
            return (
              <div key={item._id} className="mb-4 px-4 py-3 border rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span>{item.serviceId.serviceName} ({item.quantity})</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Booking Date</span>
                  <span>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between font-semibold mt-1">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm sm:text-base font-medium mt-4 sm:mt-6">
        <span className="text-gray-800 mb-2 sm:mb-0">Missed Something?</span>
        <button
          className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
          onClick={() => navigate("/categories")}
        >
          Add More Items
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <button
          className={`w-full mt-4 sm:mt-6 py-2 rounded-xl text-sm sm:text-lg font-semibold transition-all ${isBookingDisabled
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-fuchsia-500 text-white hover:bg-fuchsia-600"
            } ${isBooking ? "opacity-70" : ""}`}
          disabled={isBookingDisabled || isBooking}
          onClick={handleBookNow}
        >
          {isBooking ? "Processing..." :
            isBookingDisabled
              ? selectedItems.length === 0
                ? "Select at least one item"
                : "Select dates for all selected items"
              : "Book Now"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;

// import React, { useEffect, useState, useRef } from "react";
// import { FileMinus, Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { GoPlus } from "react-icons/go";
// import { FiMinus } from "react-icons/fi";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import axios from "axios";
// import {
//   removeFromCart,
//   addToCart,
//   getCartItems,
//   createBookService,
// } from "../api/apiMethods";

// interface CartItem {
//   _id: string;
//   serviceId: {
//     _id: string;
//     technicianId: string;
//     serviceName: string;
//     serviceImg?: string;
//     servicePrice?: number;
//     price?: number;
//     image?: string;
//     ratings?: number;
//     reviews?: number;
//   };
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
//   const [processingItems, setProcessingItems] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [isBooking, setIsBooking] = useState(false);
//   const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
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

//       if (response?.success && response?.result.cart) {
//         console.log(response);
//         const formattedItems = response?.result.cart.items.map((item: any) => ({
//           _id: item?._id,
//           serviceId: {
//             _id: item?.serviceId?._id,
//             technicianId: item.serviceId?.technicianId,
//             serviceName: item.serviceId?.serviceName,
//             serviceImg: item.serviceId?.serviceImg,
//             servicePrice: item.serviceId?.servicePrice,
//             price: item.serviceId?.price,
//             image: item.serviceId?.image,
//             ratings: item.serviceId?.ratings,
//             reviews: item.serviceId?.reviews,
//           },
//           quantity: item.quantity,
//           bookingDate: item.bookingDate,
//           isSelected: false,
//         }));

//         const updatedCartData = {
//           user: response?.result.user,
//           cart: {
//             ...response?.result.cart,
//             items: formattedItems,
//           },
//         };

//         setCartData(updatedCartData);
//         setSelectedItems([]);
//       } else {
//         setError("Failed to fetch cart data");
//       }
//     } catch (err: any) {
//       console.error("Error fetching cart:", err);
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

//   const handleDateChange = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//     itemId: string
//   ) => {
//     const selectedDate = e.target.value;
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map((item) =>
//             item._id === itemId ? { ...item, bookingDate: selectedDate } : item
//           ),
//         },
//       };
//     });

//     setSelectedItems((prev) =>
//       prev.map((item) =>
//         item._id === itemId ? { ...item, bookingDate: selectedDate } : item
//       )
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
//       prev.map((item) =>
//         item._id === itemId ? { ...item, bookingDate: "" } : item
//       )
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
//               cartItem._id === itemId
//                 ? { ...cartItem, quantity: newQuantity }
//                 : cartItem
//             ),
//           },
//         };
//       });

//       setSelectedItems((prev) =>
//         prev.map((item) =>
//           item._id === itemId ? { ...item, quantity: newQuantity } : item
//         )
//       );

//       const payload = {
//         userId,
//         serviceId: item.serviceId._id,
//         quantity: newQuantity,
//       };

//       await addToCart(payload);
//     } catch (err: any) {
//       console.error("Error changing quantity:", err);
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
//             items: prev.cart.items.filter(
//               (cartItem) => cartItem._id !== itemId
//             ),
//           },
//         };
//       });

//       setSelectedItems((prev) => prev.filter((item) => item._id !== itemId));

//       await removeFromCart({ userId, serviceId: item.serviceId._id });
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

//       const bookings = selectedItems.map((item) => ({
//         userId,
//         serviceId: item.serviceId._id,
//         technicianId: item.serviceId.technicianId,
//         quantity: item.quantity.toString(),
//         bookingDate: item.bookingDate,
//         servicePrice: (
//           (item.serviceId.servicePrice || item.serviceId.price || 0) *
//           item.quantity
//         ).toString(),
//         gst: Math.round(
//           (item.serviceId.servicePrice || item.serviceId.price || 0) *
//             item.quantity *
//             0.18
//         ).toString(),
//         totalPrice: Math.round(
//           (item.serviceId.servicePrice || item.serviceId.price || 0) *
//             item.quantity *
//             1.18
//         ).toString(),
//       }));

//       const response = await createBookService(bookings);

//       if (response?.success) {
//         await fetchCartData();
//       } else {
//         setError(response?.message || "Booking failed");
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
//     const nextMonth = new Date();
//     nextMonth.setMonth(today.getMonth() + 1);
//     return nextMonth.toISOString().split("T")[0];
//   };

//   const calculateItemTotal = (item: CartItem) => {
//     const price = item.serviceId.servicePrice || item.serviceId.price || 0;
//     const subtotal = price * item.quantity;
//     const gst = Math.round(subtotal * 0.18);
//     const total = subtotal + gst;
//     return { subtotal, gst, total };
//   };

//   if (loading) {
//     return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => setError(null)}
//           className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!cartData || !cartData.cart.items || cartData.cart.items.length === 0) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
//         <p className="text-gray-500">Your cart is empty.</p>
//         <button
//           onClick={() => navigate("/technicianById")}
//           className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
//         >
//           Browse Services
//         </button>
//       </div>
//     );
//   }

//   const isBookingDisabled =
//     selectedItems.length === 0 ||
//     selectedItems.some((item) => !item.bookingDate);

//   return (
//     <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full py-6">
//       <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
//         Your Cart
//       </h1>

//       <div className="space-y-4">
//         {cartData.cart.items.map((item) => {
//           const isProcessing = processingItems[item._id];
//           return (
//             <div
//               key={item._id}
//               className={`flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow ${
//                 isProcessing ? "opacity-70" : ""
//               }`}
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
//                   src={
//                     item.serviceId.serviceImg ||
//                     item.serviceId.image ||
//                     "https://via.placeholder.com/64"
//                   }
//                   alt={item.serviceId.serviceName}
//                   className="rounded-xl w-16 h-16 object-cover"
//                 />
//                 <div className="ml-4">
//                   <p className="text-lg font-semibold">
//                     {item.serviceId.serviceName}
//                   </p>
//                   <p className="text-gray-600">
//                     ₹{" "}
//                     <span className="clr-blue">
//                       {item.serviceId.servicePrice || item.serviceId.price}
//                     </span>{" "}
//                     per unit
//                   </p>
//                   {item.serviceId.ratings && (
//                     <div className="flex items-center gap-1 mt-1">
//                       <span className="text-sm text-yellow-500">★</span>
//                       <span className="text-sm text-gray-600">
//                         {item.serviceId.ratings}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         ({item.serviceId.reviews} reviews)
//                       </span>
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
//                       aria-label={`Remove ${item.serviceId.serviceName}`}
//                     >
//                       <Trash2
//                         size={16}
//                         className="text-red-500 hover:text-red-700"
//                       />
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() =>
//                         !isProcessing && handleQuantityChange(item._id, -1)
//                       }
//                       className="p-1 rounded-full hover:bg-gray-200 clr-purple"
//                       disabled={isProcessing}
//                       aria-label={`Decrease quantity of ${item.serviceId.serviceName}`}
//                     >
//                       <FileMinus size={12} />
//                     </button>
//                   )}
//                   <span className="text-sm text-black w-8 text-center">
//                     {isProcessing ? "..." : item.quantity}
//                   </span>
//                   <button
//                     onClick={() =>
//                       !isProcessing && handleQuantityChange(item._id, 1)
//                     }
//                     className="p-1 rounded-full hover:bg-gray-200 clr-purple"
//                     disabled={isProcessing}
//                     aria-label={`Increase quantity of ${item.serviceId.serviceName}`}
//                   >
//                     <GoPlus size={16} />
//                   </button>
//                 </div>

//                 <div className="font-semibold text-gray-800">
//                   ₹{" "}
//                   {(item.serviceId.servicePrice || item.serviceId.price || 0) *
//                     item.quantity}
//                 </div>

//                 <div className="relative flex items-center space-x-2">
//                   {item.bookingDate ? (
//                     <div className="flex items-center space-x-2">
//                       <span
//                         className="text-sm text-blue-600 cursor-pointer hover:underline"
//                         onClick={() => handleCalendarClick(item._id)}
//                         aria-label={`Edit date for ${item.serviceId.serviceName}`}
//                       >
//                         📅 {item.bookingDate}
//                       </span>
//                       <button
//                         onClick={() => handleClearDate(item._id)}
//                         className="p-1 rounded-full hover:bg-gray-200"
//                         aria-label={`Clear date for ${item.serviceId.serviceName}`}
//                       >
//                         <X
//                           size={16}
//                           className="text-gray-500 hover:text-gray-700"
//                         />
//                       </button>
//                     </div>
//                   ) : (
//                     <FaRegCalendarAlt
//                       size={20}
//                       className="cursor-pointer clr-blue"
//                       onClick={() => handleCalendarClick(item._id)}
//                       aria-label={`Select date for ${item.serviceId.serviceName}`}
//                     />
//                   )}

//                   {/* <input
//                     id={`date-picker-${item._id}`}
//                     ref={(el) => (dateInputRefs.current[item._id] = el)}
//                     type="date"
//                     onChange={(e) => handleDateChange(e, item._id)}
//                     value={item.bookingDate}
//                     className="hidden"
//                     min={new Date().toISOString().split("T")[0]}
//                   /> */}
//                   <input
//                     id={`date-picker-${item._id}`}
//                     ref={(el) => (dateInputRefs.current[item._id] = el)}
//                     type="date"
//                     onChange={(e) => handleDateChange(e, item._id)}
//                     value={item.bookingDate}
//                     className="hidden"
//                     min={new Date().toISOString().split("T")[0]}
//                     max={getMaxDate()}
//                   />
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
//               <div key={item._id} className="mb-4 p-3 border rounded-lg">
//                 <div className="flex justify-between">
//                   <span>
//                     {item.serviceId.serviceName} (x{item.quantity})
//                   </span>
//                   <span>₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Booking Date:</span>
//                   <span>
//                     {item.bookingDate
//                       ? new Date(item.bookingDate).toLocaleDateString()
//                       : "Not set"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>GST (18%):</span>
//                   <span>₹{gst}</span>
//                 </div>
//                 <div className="flex justify-between font-medium mt-1">
//                   <span>Total:</span>
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
//           className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
//           onClick={() => navigate("/categories")}
//         >
//           Add More Items
//         </button>
//       </div>

//       <div className="mt-6 border-t pt-4">
//         <button
//           className={`w-full mt-4 sm:mt-6 py-2 rounded-xl text-sm sm:text-lg font-semibold transition-all ${
//             isBookingDisabled
//               ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//               : "bg-fuchsia-500 text-white hover:bg-fuchsia-600"
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
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
// import React, { useEffect, useState, useRef } from "react";
// import { FileMinus, Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { GoPlus } from "react-icons/go";
// import { FiMinus } from "react-icons/fi";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import axios from "axios";
// import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods";

// interface CartItem {
//   _id: string;
//   serviceId: {
//     _id: string ;
//     technicianId: string;
//     serviceName: string;
//     serviceImg?: string;
//     servicePrice?: number;
//     price?: number;
//     image?: string;
//     ratings?: number;
//     reviews?: number;
//   };
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
//         console.log(response)
//         const formattedItems = response.result.cart.items.map((item: any) => ({
//           _id: item?._id,
//           serviceId: {
//             _id: item?.serviceId?._id,
//             technicianId: item.serviceId?.technicianId,
//             serviceName: item.serviceId?.serviceName,
//             serviceImg: item.serviceId?.serviceImg,
//             servicePrice: item.serviceId?.servicePrice,
//             price: item.serviceId?.price,
//             image: item.serviceId?.image,
//             ratings: item.serviceId?.ratings,
//             reviews: item.serviceId?.reviews,
//           },
//           quantity: item.quantity,
//           bookingDate: item.bookingDate,
//           isSelected: false, // Initialize all as not selected
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
//       console.error("Error fetching cart:", err);
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
//           items: prev.cart.items.map(item =>
//             item._id === itemId ? { ...item, bookingDate: selectedDate } : item
//           )
//         }
//       };
//     });

//     // Update selected items if this item is selected
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

//     // Update selected items if this item is selected
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

//       // Update local state
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

//       // Update selected items if this item is selected
//       setSelectedItems(prev =>
//         prev.map(item =>
//           item._id === itemId ? { ...item, quantity: newQuantity } : item
//         )
//       );

//       const payload = {
//         userId,
//         serviceId: item.serviceId._id,
//         quantity: newQuantity
//       };

//       await addToCart(payload);
//     } catch (err: any) {
//       console.error("Error changing quantity:", err);
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

//       // Remove from cart data
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

//       // Remove from selected items if present
//       setSelectedItems(prev => prev.filter(item => item._id !== itemId));

//       await removeFromCart({ userId, serviceId: item.serviceId._id });
//     } catch (err: any) {
//       console.error("Error removing item:", err);
//       setError("Failed to remove item");
//       await fetchCartData();
//     } finally {
//       setProcessingItems(prev => ({ ...prev, [itemId]: false }));
//     }
//   };

// const handleCheckboxChange = (itemId: string) => {
//   setCartData(prev => {
//     if (!prev) return null;

//     const updatedItems = prev.cart.items.map(item => {
//       if (item._id === itemId) {
//         const newSelectedState = !item.isSelected;

//         setSelectedItems(prev => {
//           const exists = prev.some(selected => selected._id === itemId);
//           if (newSelectedState && !exists) {
//             return [...prev, { ...item, isSelected: true }];
//           } else if (!newSelectedState) {
//             return prev.filter(selected => selected._id !== itemId);
//           }
//           return prev;
//         });

//         return { ...item, isSelected: newSelectedState };
//       }
//       return item;
//     });

//     return {
//       ...prev,
//       cart: {
//         ...prev.cart,
//         items: updatedItems,
//       },
//     };
//   });
// };

//   const handleBookNow = async () => {
//   try {
//     setIsBooking(true);
//     const userId = localStorage.getItem('userId');
//     if (!userId) {
//       setError("User not logged in");
//       return;
//     }

//     if (selectedItems.length === 0) {
//       setError("No items selected for booking");
//       return;
//     }

//     // Prepare all bookings as an array of objects
//     const bookings = selectedItems.map(item => ({
//       userId,
//       serviceId: item.serviceId._id,
//       technicianId: item.serviceId.technicianId,
//       quantity: item.quantity.toString(),
//       bookingDate: item.bookingDate,
//       servicePrice: ((item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity).toString(),
//       gst: Math.round((item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity * 0.18).toString(),
//       totalPrice: Math.round((item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity * 1.18).toString()
//     }));

//     // Send all bookings in a single request
//     const response = await createBookService(bookings);

//     if (response.success) {
//       // alert(`Successfully booked ${response.result.length} services!`);
//       await fetchCartData(); // Refresh cart after successful booking
//     } else {
//       setError(response.message || "Booking failed");
//     }
//   } catch (err: any) {
//     console.error("Error creating bookings:", err);
//     setError(err?.message || "Failed to create bookings");
//   } finally {
//     setIsBooking(false);
//   }
// };

//   const getMaxDate = () => {
//     const today = new Date();
//     const nextMonth = new Date();
//     nextMonth.setMonth(today.getMonth() + 1);
//     return nextMonth.toISOString().split("T")[0];
//   };

//   // Calculate totals for display
//   const calculateItemTotal = (item: CartItem) => {
//     const price = item.serviceId.servicePrice || item.serviceId.price || 0;
//     const subtotal = price * item.quantity;
//     const gst = Math.round(subtotal * 0.18);
//     const total = subtotal + gst;
//     return { subtotal, gst, total };
//   };

//   if (loading) {
//     return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => setError(null)}
//           className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!cartData || !cartData.cart.items || cartData.cart.items.length === 0) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
//         <p className="text-gray-500">Your cart is empty.</p>
//         <button
//           onClick={() => navigate("/technicianById")}
//           className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
//         >
//           Browse Services
//         </button>
//       </div>
//     );
//   }

//   const isBookingDisabled = selectedItems.length === 0 ||
//     selectedItems.some((item) => !item.bookingDate);

//   return (
//     <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full py-6">
//       <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Your Cart</h1>

//       <div className="space-y-4">
//         {cartData.cart.items.map((item) => {
//           const isProcessing = processingItems[item._id];
//           return (
//             <div
//               key={item._id}
//               className={`flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow ${
//                 isProcessing ? "opacity-70" : ""
//               }`}
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
//                   src={item.serviceId.serviceImg || item.serviceId.image || "https://via.placeholder.com/64"}
//                   alt={item.serviceId.serviceName}
//                   className="rounded-xl w-16 h-16 object-cover"
//                 />
//                 <div className="ml-4">
//                   <p className="text-lg font-semibold">{item.serviceId.serviceName}</p>
//                   <p className="text-gray-600">
//                     ₹ <span className="clr-blue">{item.serviceId.servicePrice || item.serviceId.price}</span> per unit
//                   </p>
//                   {item.serviceId.ratings && (
//                     <div className="flex items-center gap-1 mt-1">
//                       <span className="text-sm text-yellow-500">★</span>
//                       <span className="text-sm text-gray-600">{item.serviceId.ratings}</span>
//                       <span className="text-sm text-gray-500">({item.serviceId.reviews} reviews)</span>
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
//                       aria-label={`Remove ${item.serviceId.serviceName}`}
//                     >
//                       <Trash2 size={16} className="text-red-500 hover:text-red-700" />
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => !isProcessing && handleQuantityChange(item._id, -1)}
//                       className="p-1 rounded-full hover:bg-gray-200 clr-purple"
//                       disabled={isProcessing}
//                       aria-label={`Decrease quantity of ${item.serviceId.serviceName}`}
//                     >
//                       <FileMinus size={12} />
//                     </button>
//                   )}
//                   <span className="text-sm text-black w-8 text-center">
//                     {isProcessing ? "..." : item.quantity}
//                   </span>
//                   <button
//                     onClick={() => !isProcessing && handleQuantityChange(item._id, 1)}
//                     className="p-1 rounded-full hover:bg-gray-200 clr-purple"
//                     disabled={isProcessing}
//                     aria-label={`Increase quantity of ${item.serviceId.serviceName}`}
//                   >
//                     <GoPlus size={16} />
//                   </button>
//                 </div>

//                 <div className="font-semibold text-gray-800">
//                   ₹ {(item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity}
//                 </div>

//                 <div className="relative calendar-container">
//                 {item.bookingDate ? (
//                   <div className="flex items-center space-x-2">
//                     <span
//                       className="text-sm text-blue-600 cursor-pointer hover:underline"
//                       onClick={() => handleCalendarClick(item._id)}
//                       aria-label={`Edit date for ${item.serviceId.serviceName}`}
//                     >
//                       📅 {new Date(item.bookingDate).toLocaleDateString()}
//                     </span>
//                     <button
//                       onClick={() => handleDateChange(item?._id, "")}
//                       className="p-1 rounded-full hover:bg-gray-200"
//                       aria-label={`Clear date for ${item.serviceId.serviceName}`}
//                     >
//                       <X size={16} className="text-gray-500 hover:text-gray-700" />
//                     </button>
//                   </div>
//                 ) : (
//                   <FaRegCalendarAlt
//                     size={20}
//                     className="cursor-pointer text-blue-600"
//                     onClick={() => handleCalendarClick(item._id)}
//                     aria-label={`Select date for ${item.serviceId.serviceName}`}
//                   />
//                 )}
//                 <input
//                   ref={el => (dateInputRefs.current[item._id] = el)}
//                   type="date"
//                   onChange={e => handleDateChange(item._id, e.target.value)}
//                   value={item.bookingDate}
//                   className={`absolute top-full mt-1 right-0 z-10 border rounded px-2 py-1 text-sm shadow bg-white ${selectedItemId === item._id ? "block" : "hidden"}`}
//                   min={new Date().toISOString().split("T")[0]}
//                   max={getMaxDate()}
//                 />
//               </div>

//                 {/* <div className="calendar-container">
//                   {item.bookingDate ? (
//                     <div className="flex items-center space-x-2">
//                       <span
//                         className="text-sm text-blue-600 cursor-pointer hover:underline"
//                         onClick={() => !isProcessing && handleCalendarClick(item._id)}
//                         aria-label={`Edit date for ${item.serviceId.serviceName}`}
//                       >
//                         📅 {new Date(item.bookingDate).toLocaleDateString()}
//                       </span>
//                       <button
//                         onClick={() => !isProcessing && handleClearDate(item._id)}
//                         className="p-1 rounded-full hover:bg-gray-200"
//                         disabled={isProcessing}
//                         aria-label={`Clear date for ${item.serviceId.serviceName}`}
//                       >
//                         <X size={16} className="text-gray-500 hover:text-gray-700" />
//                       </button>
//                     </div>
//                   ) : (
//                     <FaRegCalendarAlt
//                       size={20}
//                       className="cursor-pointer clr-blue"
//                       onClick={() => !isProcessing && handleCalendarClick(item._id)}
//                       aria-label={`Select date for ${item.serviceId.serviceName}`}
//                     />
//                   )}

//                   <input
//                     id={`date-picker-${item._id}`}
//                     ref={(el) => (dateInputRefs.current[item._id] = el)}
//                     type="date"
//                     onChange={(e) => !isProcessing && handleDateChange(e, item._id)}
//                     value={item.bookingDate}
//                     className="hidden-input"
//                     min={new Date().toISOString().split("T")[0]}
//                     max={getMaxDate()}
//                     disabled={isProcessing}
//                   />
//                 </div> */}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Selected Items Summary */}
//       {selectedItems.length > 0 && (
//         <div className="mt-6 border-t pt-4">
//           <h2 className="text-lg font-semibold mb-4">Selected Items</h2>
//           {selectedItems.map((item) => {
//             const { subtotal, gst, total } = calculateItemTotal(item);
//             return (
//               <div key={item._id} className="mb-4 p-3 border rounded-lg">
//                 <div className="flex justify-between">
//                   <span>{item.serviceId.serviceName} (x{item.quantity})</span>
//                   <span>₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Booking Date:</span>
//                   <span>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>GST (18%):</span>
//                   <span>₹{gst}</span>
//                 </div>
//                 <div className="flex justify-between font-medium mt-1">
//                   <span>Total:</span>
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
//           className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
//           onClick={() => navigate("/categories")}
//         >
//           Add More Items
//         </button>
//       </div>

//       <div className="mt-6 border-t pt-4">
//         <button
//           className={`w-full mt-4 sm:mt-6 py-2 rounded-xl text-sm sm:text-lg font-semibold transition-all ${
//             isBookingDisabled
//               ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//               : "bg-fuchsia-500 text-white hover:bg-fuchsia-600"
//           } ${isBooking ? "opacity-70" : ""}`}
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
// import React, { useEffect, useState, useRef } from "react";
// import { Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { GoPlus } from "react-icons/go";
// import { FaMinus, FaRegCalendarAlt } from "react-icons/fa";
// import axios from "axios";

// interface CartItem {
//   _id: string;
//   serviceId: {
//     _id: string;
//     serviceName: string;
//     serviceImg?: string;
//     servicePrice?: number;
//     ratings?: number;
//     reviews?: number;
//   };
//   quantity: number;
//   bookingDate: string;
// }

// interface CartData {
//   user: {
//     _id: string;
//     username: string;
//     phoneNumber: string;
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

// const CartPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
//   const dateInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

//   useEffect(() => {
//     const fetchCartData = async () => {
//       try {
//         setLoading(true);
//         const userId = localStorage.getItem("userId") || "686f37ca7e3a2d2d4c3be95b";
//         if (!userId) {
//           setError("User not logged in");
//           return;
//         }

//         const response = await axios.get(`http://localhost:5000/api/cart/getCart/${userId}`);
//         if (response.data.success) {
//           setCartData(response.data.result);
//         } else {
//           setError("Failed to fetch cart data");
//         }
//       } catch (err: any) {
//         console.error("Error fetching cart:", err);
//         setError(err?.message || "Failed to fetch cart data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCartData();
//   }, []);

//   const handleQuantityChange = async (itemId: string, delta: number) => {
//     try {
//       const userId = localStorage.getItem("userId") || "686f37ca7e3a2d2d4c3be95b";
//       const updatedQuantity = Math.max(1, (cartData?.cart.items.find(item => item._id === itemId)?.quantity || 1) + delta);

//       await axios.put(`http://localhost:5000/api/cart/updateCart/${userId}`, {
//         itemId,
//         quantity: updatedQuantity,
//       });

//       setCartData(prev => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.map(item =>
//               item._id === itemId ? { ...item, quantity: updatedQuantity } : item
//             ),
//           },
//         };
//       });
//     } catch (err) {
//       console.error("Error updating quantity:", err);
//       setError("Failed to update cart");
//     }
//   };

//   const handleRemove = async (itemId: string) => {
//     try {
//       const userId = localStorage.getItem("userId") || "686f37ca7e3a2d2d4c3be95b";
//       await axios.delete(`http://localhost:5000/api/cart/removeItem/${userId}/${itemId}`);

//       setCartData(prev => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.filter(item => item._id !== itemId),
//           },
//         };
//       });
//     } catch (err) {
//       console.error("Error removing item:", err);
//       setError("Failed to remove item");
//     }
//   };

//   const handleDateChange = async (itemId: string, date: string) => {
//     try {
//       const userId = localStorage.getItem("userId") || "686f37ca7e3a2d2d4c3be95b";
//       await axios.put(`http://localhost:5000/api/cart/updateCart/${userId}`, {
//         itemId,
//         bookingDate: date,
//       });

//       setCartData(prev => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.map(item =>
//               item._id === itemId ? { ...item, bookingDate: date } : item
//             ),
//           },
//         };
//       });
//       setSelectedItemId(null);
//     } catch (err) {
//       console.error("Error updating date:", err);
//       setError("Failed to update date");
//     }
//   };

//   const handleCalendarClick = (itemId: string) => {
//     setSelectedItemId(itemId);
//     if (dateInputRefs.current[itemId]) {
//       dateInputRefs.current[itemId]?.showPicker?.();
//       dateInputRefs.current[itemId]?.focus();
//     }
//   };

//   const getMaxDate = () => {
//     const nextMonth = new Date();
//     nextMonth.setMonth(nextMonth.getMonth() + 1);
//     return nextMonth.toISOString().split("T")[0];
//   };

//   if (loading) {
//     return <div className="max-w-4xl mx-auto p-6 text-center">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 text-center text-red-500">{error}</div>
//     );
//   }

//   if (!cartData || !cartData.cart.items.length) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
//         <p className="text-gray-500">Your cart is empty.</p>
//       </div>
//     );
//   }

//   const subtotal = cartData.cart.items.reduce(
//     (sum, item) => sum + ((item.serviceId.servicePrice || 0) * item.quantity),
//     0
//   );
//   const tax = Math.round(subtotal * 0.18);
//   const total = subtotal + tax;

//   const isBookingDisabled = cartData.cart.items.length === 0 || cartData.cart.items.some(item => !item.bookingDate);

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
//       <div className="space-y-4">
//         {cartData.cart.items.map(item => (
//           <div
//             key={item._id}
//             className="flex flex-col sm:flex-row items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow-sm"
//           >
//             <div className="flex items-center mb-4 sm:mb-0">
//               <img
//                 src={item.serviceId.serviceImg || "https://via.placeholder.com/64"}
//                 alt={item.serviceId.serviceName}
//                 className="rounded-xl w-16 h-16 object-cover"
//               />
//               <div className="ml-4">
//                 <p className="text-lg font-semibold text-gray-800">{item.serviceId.serviceName}</p>
//                 <p className="text-gray-600">
//                   ₹ <span className="text-fuchsia-500">{item.serviceId.servicePrice || 0}</span> per unit
//                 </p>
//                 {item.serviceId.ratings && (
//                   <div className="flex items-center gap-1 mt-1">
//                     <span className="text-sm text-yellow-500">★</span>
//                     <span className="text-sm text-gray-600">{item.serviceId.ratings}</span>
//                     <span className="text-sm text-gray-500">({item.serviceId.reviews} reviews)</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2 bg-fuchsia-100 rounded-lg px-2 py-1 border border-fuchsia-400">
//                 {item.quantity === 1 ? (
//                   <button
//                     onClick={() => handleRemove(item._id)}
//                     className="p-2 rounded-full hover:bg-gray-200"
//                     aria-label={`Remove ${item.serviceId.serviceName}`}
//                   >
//                     <Trash2 size={16} className="text-red-500 hover:text-red-700" />
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleQuantityChange(item._id, -1)}
//                     className="p-2 rounded-full hover:bg-gray-200 text-fuchsia-500"
//                     aria-label={`Decrease quantity of ${item.serviceId.serviceName}`}
//                   >
//                     <FaMinus size={12} />
//                   </button>
//                 )}
//                 <span className="text-sm text-black w-8 text-center">{item.quantity}</span>
//                 <button
//                   onClick={() => handleQuantityChange(item._id, 1)}
//                   className="p-2 rounded-full hover:bg-gray-200 text-fuchsia-500"
//                   aria-label={`Increase quantity of ${item.serviceId.serviceName}`}
//                 >
//                   <GoPlus size={16} />
//                 </button>
//               </div>

//               <div className="font-semibold text-gray-800">
//                 ₹ {(item.serviceId.servicePrice || 0) * item.quantity}
//               </div>

// <div className="relative">
//   {item.bookingDate ? (
//     <div className="flex items-center space-x-2">
//       <span
//         className="text-sm text-blue-600 cursor-pointer hover:underline"
//         onClick={() => handleCalendarClick(item._id)}
//         aria-label={`Edit date for ${item.serviceId.serviceName}`}
//       >
//         📅 {new Date(item.bookingDate).toLocaleDateString()}
//       </span>
//       <button
//         onClick={() => handleDateChange(item._id, "")}
//         className="p-1 rounded-full hover:bg-gray-200"
//         aria-label={`Clear date for ${item.serviceId.serviceName}`}
//       >
//         <X size={16} className="text-gray-500 hover:text-gray-700" />
//       </button>
//     </div>
//   ) : (
//     <FaRegCalendarAlt
//       size={20}
//       className="cursor-pointer text-blue-600"
//       onClick={() => handleCalendarClick(item._id)}
//       aria-label={`Select date for ${item.serviceId.serviceName}`}
//     />
//   )}
//   <input
//     ref={el => (dateInputRefs.current[item._id] = el)}
//     type="date"
//     onChange={e => handleDateChange(item._id, e.target.value)}
//     value={item.bookingDate}
//     className={`absolute top-full mt-1 right-0 z-10 border rounded px-2 py-1 text-sm shadow bg-white ${selectedItemId === item._id ? "block" : "hidden"}`}
//     min={new Date().toISOString().split("T")[0]}
//     max={getMaxDate()}
//   />
// </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex flex-col sm:flex-row justify-between items-center text-sm font-medium mt-6">
//         <span className="text-gray-800 mb-2 sm:mb-0">Missed Something?</span>
//         <button
//           className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg"
//           onClick={() => navigate("/technicianById")}
//         >
//           Add More Items
//         </button>
//       </div>

//       <div className="mt-6 border-t pt-4">
//         <div className="flex justify-between text-gray-700 mb-2 text-sm">
//           <span>Subtotal</span>
//           <span>₹{subtotal}</span>
//         </div>
//         <div className="flex justify-between text-gray-700 mb-2 text-sm">
//           <span>GST (18%)</span>
//           <span>₹{tax}</span>
//         </div>
//         <div className="flex justify-between text-xl font-bold mt-4 text-gray-800">
//           <span>Total</span>
//           <span>₹{total}</span>
//         </div>

//         <button
//           className={`w-full mt-6 py-2 rounded-xl text-lg font-semibold transition-all ${
//             isBookingDisabled
//               ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//               : "bg-fuchsia-500 text-white hover:bg-fuchsia-600"
//           }`}
//           disabled={isBookingDisabled}
//         >
//           {isBookingDisabled ? "Select dates for all items" : "Book Now"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartPage;

// import React, { useEffect, useState, useRef } from "react";
// import { Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { GoPlus } from "react-icons/go";
// import { FiMinus } from "react-icons/fi";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import axios from "axios";

// interface CartItem {
//   _id: string;
//   serviceId: {
//     _id: string;
//     technicianId: string;
//     serviceName: string;
//     serviceImg?: string;
//     servicePrice?: number;
//     price?: number;
//     image?: string;
//     ratings?: number;
//     reviews?: number;
//   };
//   quantity: number;
//   bookingDate: string;
//   otp?: number;
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

// interface CartItem {
//   id: string;
//   serv: string;
//   price: number;
//   image: string;
//   quantity: number;
//   selectedDate: string;
//   isSelected: boolean;
// }

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       let userId = localStorage.getItem("userId");
//       userId = "686f37ca7e3a2d2d4c3be95b"
//       if (!userId) {
//         setError("User not logged in");
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(`http://localhost:5000/api/cart/getCart/${userId}`);

//       if (response.data.success) {
//         setCartData(response.data.result);
//       } else {
//         setError("Failed to fetch cart data");
//       }
//     } catch (err: any) {
//       console.error("Error fetching cart:", err);
//       setError(err?.message || "Failed to fetch cart data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCalendarClick = (itemId: string) => {
//     setSelectedItemId(itemId);
//   };

//   const handleIconClick = (id: string) => {
//     handleCalendarClick(id);
//     if (dateInputRefs.current[id]) {
//       dateInputRefs.current[id].showPicker?.();
//       dateInputRefs.current[id].focus();
//     }
//   };

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
//     const selectedDate = e.target.value;
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === itemId ? { ...item, selectedDate } : item
//       )
//     );
//     setSelectedItemId(null);
//   };

//   const handleClearDate = (itemId: string) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === itemId ? { ...item, selectedDate: "" } : item
//       )
//     );
//   };

//   const handleQuantityChange = (id: string, delta: number) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   }

//   const handleRemove = (id: string) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const handleCheckboxChange = (id: string) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, isSelected: !item.isSelected } : item
//       )
//     );
//   };

//   const getMaxDate = () => {
//     const today = new Date();
//     const nextMonth = new Date();
//     nextMonth.setMonth(today.getMonth() + 1);
//     return nextMonth.toISOString().split("T")[0];
//   };

//   const selectedItems = cartItems.filter((item) => item.isSelected);
//   if (error) {
//     return (
//       <div className="max-w-3xl mx-auto p-6">
//         <p className="text-red-500 text-center">{error}</p>
//       </div>
//     );
//   }

//   if (!cartData || !cartData.cart.items || cartData.cart.items.length === 0) {
//     return (
//       <div className="max-w-3xl mx-auto p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
//         <p className="text-gray-500">Your cart is empty.</p>
//       </div>
//     );
//   }

//   const subtotal = cartData.cart.items.reduce(
//     (sum, item) => sum + ((item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity),
//     0
//   );
//   const tax = Math.round(subtotal * 0.18);
//   const total = subtotal + tax;

//   const isBookingDisabled = selectedItems.length === 0 || selectedItems.some((item) => !item.selectedDate);

//   return (
//     <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full py-6">
//       <style>
//         {`
//           .calendar-container {
//             display: block;
//             position: relative;
//           }
//           .calendar-container .hidden-input {
//             position: absolute;
//             top: 100%;
//             left: 0;
//             margin-top: 4px;
//             opacity: 0;
//             width: 0;
//             height: 0;
//             padding: 0;
//             border: none;
//             z-index: -1;
//           }
//           .calendar-container:focus-within .hidden-input {
//             opacity: 0; /* Keep hidden but focusable */
//           }
//           @media (min-width: 640px) {
//             .calendar-container .hidden-input {
//               margin-top: 6px;
//             }
//           }
//         `}
//       </style>
//       <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Your Cart</h1>

//       {cartItems.length === 0 ? (
//         <p className="text-gray-500 text-sm sm:text-base">Your cart is empty.</p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {cartItems.map((item) => (
//               <div
//                 key={item.id}
//                 className={`flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-xl bg-white shadow-sm border-gray-300`}
//               >
//                 <div className="flex items-center mb-4 sm:mb-0">
//                   <input
//                     type="checkbox"
//                     checked={item.isSelected}
//                     onChange={() => handleCheckboxChange(item.id)}
//                     className="h-5 w-5 text-fuchsia-500 focus:ring-fuchsia-400 mr-3 sm:mr-4"
//                     aria-label={`Select ${item.serv}`}
//                   />
//                   <img
//                     src={item.image}
//                     alt={item.serv}
//                     className="rounded-xl w-12 h-12 sm:w-16 sm:h-16 object-cover"
//                   />
//                   <div className="ml-3 sm:ml-4">
//                     <p className="text-base sm:text-lg font-semibold text-gray-800">{item.serv}</p>
//                     <p className="text-gray-600 text-sm sm:text-base">
//                       ₹ <span className="clr-blue">{item.price}</span> per unit
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
//                   <div className="flex items-center space-x-2 bg-fuchsia-100 rounded-lg px-2 py-1 border border-fuchsia-400">
//                     {item.quantity === 1 ? (
//                       <button
//                         onClick={() => handleRemove(item.id)}
//                         className="p-1 sm:p-2 rounded-full hover:bg-gray-200"
//                         aria-label={`Remove ${item.serv}`}
//                       >
//                         <Trash2 size={16} className="text-red-500 hover:text-red-700" />
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleQuantityChange(item.id, -1)}
//                         className="p-1 sm:p-2 rounded-full hover:bg-gray-200 clr-purple"
//                         aria-label={`Decrease quantity of ${item.serv}`}
//                       >
//                         <FiMinus size={12} />
//                       </button>
//                     )}
//                     <span className="text-sm sm:text-base text-black w-8 text-center">{item.quantity}</span>
//                     <button
//                       onClick={() => handleQuantityChange(item.id, 1)}
//                       className="p-1 sm:p-2 rounded-full hover:bg-gray-200 clr-purple"
//                       aria-label={`Increase quantity of ${item.serv}`}
//                     >
//                       <GoPlus size={16} />
//                     </button>
//                   </div>

//                   <div className="font-semibold text-gray-800 text-sm sm:text-base">
//                     ₹ {item.price * item.quantity}
//                   </div>

//                   <div className="calendar-container">
//                     {item.selectedDate ? (
//                       <div className="flex items-center space-x-2">
//                         <span
//                           className="text-sm text-blue-600 cursor-pointer hover:underline"
//                           onClick={() => handleIconClick(item.id)}
//                           aria-label={`Edit date for ${item.serv}`}
//                         >
//                           📅 {item.selectedDate}
//                         </span>
//                         <button
//                           onClick={() => handleClearDate(item.id)}
//                           className="p-1 rounded-full hover:bg-gray-200"
//                           aria-label={`Clear date for ${item.serv}`}
//                         >
//                           <X size={16} className="text-gray-500 hover:text-gray-700" />
//                         </button>
//                       </div>
//                     ) : (
//                       <FaRegCalendarAlt
//                         size={20}
//                         className="cursor-pointer clr-blue"
//                         onClick={() => handleIconClick(item.id)}
//                         aria-label={`Select date for ${item.serv}`}
//                       />
//                     )}

//                     {/* Hidden input that triggers the native calendar */}
//                     <input
//                       id={`date-picker-${item.id}`}
//                       ref={(el) => (dateInputRefs.current[item.id] = el)}
//                       type="date"
//                       onChange={(e) => handleDateChange(e, item.id)}
//                       value={item.selectedDate}
//                       className="hidden-input"
//                       min={new Date().toISOString().split("T")[0]}
//                       max={getMaxDate()}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           </>
//       )}

//           <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm sm:text-base font-medium mt-4 sm:mt-6">
//             <span className="text-gray-800 mb-2 sm:mb-0">Missed Something?</span>
//             <div
//               className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
//               onClick={() => navigate("/technicianById")}
//             >
//               Add More Items
//             </div>
//           </div>

//           <div className="mt-6 border-t pt-4">
//             <div className="flex justify-between text-gray-700 mb-2 text-sm sm:text-base">
//               <span>Subtotal</span>
//               <span>₹{subtotal}</span>
//             </div>
//             <div className="flex justify-between text-gray-700 mb-2 text-sm sm:text-base">
//               <span>GST (18%)</span>
//               <span>₹{tax}</span>
//             </div>
//             <div className="flex justify-between text-lg sm:text-xl font-bold mt-4 text-gray-800">
//               <span>Total</span>
//               <span>₹{total}</span>
//             </div>

//             <button
//               className={`w-full mt-4 sm:mt-6 py-2 rounded-xl text-sm sm:text-lg font-semibold transition-all ${isBookingDisabled
//                   ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//                   : "bg-fuchsia-500 text-white hover:bg-fuchsia-600"
//                 }`}
//               disabled={isBookingDisabled}
//             >
//               {isBookingDisabled
//                 ? selectedItems.length === 0
//                   ? "Select at least one item"
//                   : "Select dates for all selected items"
//                 : "Book Now"}
//             </button>

//       <div className="space-y-4">
//         {cartData.cart.items.map((item) => (
//           <div
//             key={item._id}
//             className="flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow"
//           >
//             <div className="flex">
//               <input
//                     type="checkbox"
//                     checked={item.isSelected}
//                     onChange={() => handleCheckboxChange(item.id)}
//                     className="h-5 w-5 text-fuchsia-500 focus:ring-fuchsia-400 mr-3 sm:mr-4"
//                     aria-label={`Select ${item.serv}`}
//                   />
//               <img
//                 src={item.serviceId.serviceImg || item.serviceId.image || "https://via.placeholder.com/64"}
//                 alt={item.serviceId.serviceName}
//                 className="rounded-xl w-16 h-16 object-cover"
//               />
//               <div className="ms-4">
//                 <p className="text-lg font-semibold">{item.serviceId.serviceName}</p>
//                 <p className="text-gray-600">
//                   ₹ <span className="clr-blue">{item.serviceId.servicePrice || item.serviceId.price}</span> per unit
//                 </p>
//                 {item.serviceId.ratings && (
//                   <div className="flex items-center gap-1 mt-1">
//                     <span className="text-sm text-yellow-500">★</span>
//                     <span className="text-sm text-gray-600">{item.serviceId.ratings}</span>
//                     <span className="text-sm text-gray-500">({item.serviceId.reviews} reviews)</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2 bg-fuchsia-100 rounded-lg px-2 border border-fuchsia-400">
//                 {item.quantity === 1 ? (
//                   <button onClick={() => handleRemove(item._id)}>
//                     <Trash2
//                       size={16}
//                       className="text-red-500 hover:text-red-700 cursor-pointer"
//                     />
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleQuantityChange(item._id, -1)}
//                     className="p-1 rounded-full hover:bg-gray-200 clr-purple"
//                   >
//                     <FiMinus size={10} />
//                   </button>
//                 )}
//                 <span className="text-sm text-black">{item.quantity}</span>
//                 <button
//                   onClick={() => handleQuantityChange(item._id, 1)}
//                   className="p-1 rounded-full hover:bg-gray-200 clr-purple"
//                 >
//                   <GoPlus size={15} />
//                 </button>
//               </div>

//               <div className="font-semibold text-gray-800">
//                 ₹ {(item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity}
//               </div>

//               {/* Date Picker */}
//               <div className="relative">
//                 {item.bookingDate ? (
//                   <span className="text-sm text-blue-600">
//                     📅 {new Date(item.bookingDate).toLocaleDateString()}
//                   </span>
//                 ) : (
//                   <FaRegCalendarAlt
//                     size={20}
//                     className="cursor-pointer clr-blue"
//                     onClick={() => handleCalendarClick(item._id)}
//                   />
//                 )}

//                 {selectedItemId === item._id && (
//                   <input
//                     type="date"
//                     onChange={(e) => handleDateChange(e, item._id)}
//                     className="absolute top-full mt-1 right-0 z-10 border rounded px-2 py-1 text-sm shadow bg-white"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-between items-center text-sm sm:text-sm md:text-md lg:text-md xl:text-lg font-medium mt-3">
//         <span className="text-black">Missed Something?</span>
//         <div
//           className="bg-red-600 text-white hover:bg-red-700 px-2 py-1 rounded-lg cursor-pointer"
//           onClick={() => navigate("/profile")}
//         >
//           Add More Items
//         </div>
//       </div>

//       <div className="mt-6 border-t pt-4">
//         <div className="flex justify-between text-gray-700 mb-2">
//           <span>Subtotal</span>
//           <span>₹{subtotal}</span>
//         </div>
//         <div className="flex justify-between text-gray-700 mb-2">
//           <span>GST (18%)</span>
//           <span>₹{tax}</span>
//         </div>
//         <div className="flex justify-between text-xl font-bold mt-4 text-gray-800">
//           <span>Total</span>
//           <span>₹{total}</span>
//         </div>

//         <button className="w-full mt-6 bg-fuchsia-500 text-white py-2 rounded-xl text-lg font-semibold hover:bg-fuchsia-600 transition-all">
//           Book Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
