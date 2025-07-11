import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";

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

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      let userId = localStorage.getItem("userId");
      userId = "686f37ca7e3a2d2d4c3be95b"
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/cart/getCart/${userId}`);
      
      if (response.data.success) {
        setCartData(response.data.result);
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
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const selectedDate = e.target.value;
    // TODO: Implement API call to update booking date
    console.log("Update booking date for item:", itemId, "to:", selectedDate);
    setSelectedItemId(null);
  };

  const handleQuantityChange = async (itemId: string, delta: number) => {
    // TODO: Implement API call to update quantity
    console.log("Update quantity for item:", itemId, "delta:", delta);
  };

  const handleRemove = async (itemId: string) => {
    // TODO: Implement API call to remove item
    console.log("Remove item:", itemId);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (!cartData || !cartData.cart.items || cartData.cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  const subtotal = cartData.cart.items.reduce(
    (sum, item) => sum + ((item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity),
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartData.cart.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow"
          >
            <div className="flex">
              <img
                src={item.serviceId.serviceImg || item.serviceId.image || "https://via.placeholder.com/64"}
                alt={item.serviceId.serviceName}
                className="rounded-xl w-16 h-16 object-cover"
              />
              <div className="ms-4">
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
                  <button onClick={() => handleRemove(item._id)}>
                    <Trash2
                      size={16}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => handleQuantityChange(item._id, -1)}
                    className="p-1 rounded-full hover:bg-gray-200 clr-purple"
                  >
                    <FiMinus size={10} />
                  </button>
                )}
                <span className="text-sm text-black">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, 1)}
                  className="p-1 rounded-full hover:bg-gray-200 clr-purple"
                >
                  <GoPlus size={15} />
                </button>
              </div>

              <div className="font-semibold text-gray-800">
                ₹ {(item.serviceId.servicePrice || item.serviceId.price || 0) * item.quantity}
              </div>

              {/* Date Picker */}
              <div className="relative">
                {item.bookingDate ? (
                  <span className="text-sm text-blue-600">
                    📅 {new Date(item.bookingDate).toLocaleDateString()}
                  </span>
                ) : (
                  <FaRegCalendarAlt
                    size={20}
                    className="cursor-pointer clr-blue"
                    onClick={() => handleCalendarClick(item._id)}
                  />
                )}

                {selectedItemId === item._id && (
                  <input
                    type="date"
                    onChange={(e) => handleDateChange(e, item._id)}
                    className="absolute top-full mt-1 right-0 z-10 border rounded px-2 py-1 text-sm shadow bg-white"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm sm:text-sm md:text-md lg:text-md xl:text-lg font-medium mt-3">
        <span className="text-black">Missed Something?</span>
        <div
          className="bg-red-600 text-white hover:bg-red-700 px-2 py-1 rounded-lg cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          Add More Items
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span>GST (18%)</span>
          <span>₹{tax}</span>
        </div>
        <div className="flex justify-between text-xl font-bold mt-4 text-gray-800">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button className="w-full mt-6 bg-fuchsia-500 text-white py-2 rounded-xl text-lg font-semibold hover:bg-fuchsia-600 transition-all">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default CartPage;
