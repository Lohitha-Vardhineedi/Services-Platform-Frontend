import React, { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed.map(item => ({ ...item, quantity: item.quantity ?? 1 }));
  });

  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleCalendarClick = (itemId) => {
    setSelectedItemId(itemId);
  };

  const handleDateChange = (e, itemId) => {
    const selectedDate = e.target.value;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selectedDate } : item
      )
    );
    setSelectedItemId(null); // Hide date input
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow"
              >
                <div className="flex">
                  <img
                    src={item.image}
                    alt={item.serv}
                    className="rounded-xl w-16 h-16 object-cover"
                  />
                  <div className="ms-4">
                    <p className="text-lg font-semibold">{item.serv}</p>
                    <p className="text-gray-600">
                      ₹ <span className="clr-blue">{item.price}</span> per unit
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center space-y-2">
                  <div className="flex items-center space-x-2 bg-fuchsia-100 rounded-lg px-2 border border-fuchsia-400">
                    {item.quantity === 1 ? (
                      <button onClick={() => handleRemove(item.id)}>
                        <Trash2
                          size={20}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="p-1 rounded-full hover:bg-gray-200 clr-purple"
                      >
                        <FiMinus size={10} />
                      </button>
                    )}
                    <span className="text-sm text-black">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1 rounded-full hover:bg-gray-200 clr-purple"
                    >
                      <GoPlus size={15} />
                    </button>
                  </div>

                  {/* <div className="flex items-center space-x-4 relative"> */}
                  <div className="font-semibold text-gray-800 mx-3">₹ {item.price * item.quantity}</div>

                  {/* Date display or calendar */}
                  {item.selectedDate ? (
                    <span className="text-sm text-blue-600">
                      📅 {item.selectedDate}
                    </span>
                  ) : (
                    <FaRegCalendarAlt
                      size={20}
                      className="cursor-pointer clr-blue"
                      onClick={() => handleCalendarClick(item.id)}
                    />
                  )}

                  {selectedItemId === item.id && (
                    <input
                      type="date"
                      onChange={(e) => handleDateChange(e, item.id)}
                      className="absolute top-full mt-1 right-0 z-10 border rounded px-2 py-1 text-sm shadow bg-white"
                    />
                  )}
                  {/* </div> */}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm sm:text-sm md:text-md lg:text-md xl:text-lg font-medium mt-3">
            <span className="text-black ">Missed Something ?</span>
            <div
              className="bg-red-600 text-white hover:bg-red-700 px-2 py-1 rounded-sm cursor-pointer"
              onClick={() => navigate("/categories")}
            >
              Add More Items
            </button>
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
        </>
      )}
    </div>
  );
};

export default CartPage;
