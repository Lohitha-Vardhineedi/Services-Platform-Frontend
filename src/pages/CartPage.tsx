import React, { useEffect, useState, useRef } from "react";
import { FileMinus, Minus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FaRegCalendarAlt } from "react-icons/fa";
import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods";

interface CartItem {
  _id: string;
  // serviceId: {
  //   _id: string;
  //   technicianId: string;
  //   serviceName: string;  
  //   serviceImg?: string;
  //   servicePrice?: number;
  //   price?: number;
  //   image?: string;
  //   ratings?: number;
  //   reviews?: number;
  // };
  technicianId: string;
  serviceId : string;
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

        const formattedItems = response.result.cart.map((item: any) => ({
          _id: item?._id,
          serviceId: item?.serviceId,
          serviceName: item?.serviceName,
          serviceImg: item?.serviceImg,
          servicePrice: item?.servicePrice,
          quantity: item.quantity,
          technicianId: item.technicianId,
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
          items: prev.cart.items?.map(item =>
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
        serviceId: item.serviceId,
        technicianId: item.technicianId,
        quantity: newQuantity
      };

      await addToCart(payload);
    } catch (err: any) {
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

      await removeFromCart({ userId, serviceId: item.serviceId, technicianId: item.technicianId });
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
        serviceId: item._id,
        // serviceId: item.serviceId._id,
        technicianId: item.technicianId,
        quantity: item.quantity.toString(),
        bookingDate: item.bookingDate,
        servicePrice: ((item.servicePrice || item.price || 0) * item.quantity).toString(),
        gst: Math.round((item.servicePrice || item.price || 0) * item.quantity * 0.18).toString(),
        totalPrice: Math.round((item.servicePrice || item.price || 0) * item.quantity * 1.18).toString()
      }));

      const response = await createBookService(bookings);

      if (response.success) {
        await fetchCartData();
        navigate("/transactions")
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

  const getMaxDate = (unit = 'week') => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7); 
    return maxDate.toISOString().split("T")[0];
  };

  const calculateItemTotal = (item: CartItem) => {
    const price = item.servicePrice || item.price || 0;
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
      <div className="flex justify-center gap-4 mt-4">
        {error.includes("log in") && (
          <button
            onClick={() => navigate("/login")}
            className="bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
          >
            Log In
          </button>
        )}
        <button
          onClick={() => setError(null)}
          className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

  if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
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
        {cartData.cart?.items?.map((item) => {
        
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
                  src={item?.serviceImg || "https://via.placeholder.com/64"}
                  alt={item?.serviceName}
                  className="rounded-xl w-16 h-16 object-cover"
                />
                <div className="ml-4">
                  <p className="text-lg font-semibold">{item?.serviceName}</p>
                  <p className="text-gray-600">
                    ₹ <span className="clr-blue">{item?.servicePrice}</span> per unit
                  </p>
                  {item?.ratings && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">{item.ratings}</span>
                      <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
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
                      aria-label={`Remove ${item?.serviceName}`}
                    >
                      <Trash2 size={16} className="text-red-500 hover:text-red-700" />
                    </button>
                  ) : (
                    <button
                      onClick={() => !isProcessing && handleQuantityChange(item._id, -1)}
                      className="p-1 rounded-full hover:bg-gray-200 clr-purple"
                      disabled={isProcessing}
                      aria-label={`Decrease quantity of ${item?.serviceName}`}
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
                    aria-label={`Increase quantity of ${item?.serviceName}`}
                  >
                    <GoPlus size={16} />
                  </button>
                </div>

                <div className="font-semibold text-gray-800">
                  ₹ {(item?.servicePrice || 0) * item.quantity}
                </div>

                <div className="relative flex items-center space-x-2">
                  {item.bookingDate ? (
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-sm text-blue-600 cursor-pointer hover:underline"
                        onClick={() => handleCalendarClick(item._id)}
                        aria-label={`Edit date for ${item?.serviceName}`}
                      >
                        📅 {item.bookingDate}
                      </span>
                      <button
                        onClick={() => handleClearDate(item._id)}
                        className="p-1 rounded-full hover:bg-gray-200"
                        aria-label={`Clear date for ${item?.serviceName}`}
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
                  <span>{item.serviceName} ({item.quantity})</span>
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
          className="bg-red-600 flex items-center text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
          onClick={() => navigate("/categories")}
        >
          <GoPlus size={23} className="font-bold me-1"/>
          Add More Items
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <button
          className={`w-full mt-4 sm:mt-6 py-3 rounded-xl text-sm sm:text-lg font-semibold transition-all ${isBookingDisabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
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