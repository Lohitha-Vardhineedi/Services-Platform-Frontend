import React, { useEffect, useState, useRef } from "react";
import { Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";

interface CartItem {
  id: string;
  serv: string;
  price: number;
  image: string;
  quantity: number;
  selectedDate: string;
  isSelected: boolean;
}

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cartItems");
    const parsed = stored ? JSON.parse(stored) : [
      {
        id: "1",
        serv: "Plumbing Service",
        price: 1500,
        image: "https://via.placeholder.com/150?text=Plumbing",
        quantity: 2,
        selectedDate: "2025-07-15",
        isSelected: true,
      },
      {
        id: "2",
        serv: "Electrical Repair",
        price: 2000,
        image: "https://via.placeholder.com/150?text=Electrical",
        quantity: 1,
        selectedDate: "",
        isSelected: false,
      },
      {
        id: "3",
        serv: "AC Maintenance",
        price: 3000,
        image: "https://via.placeholder.com/150?text=AC",
        quantity: 3,
        selectedDate: "2025-07-20",
        isSelected: true,
      },
    ];
    return parsed.map((item: any) => ({
      ...item,
      quantity: item.quantity ?? 1,
      selectedDate: item.selectedDate ?? "",
      isSelected: item.isSelected ?? true,
    }));
  });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const dateInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleCalendarClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleIconClick = (id: string) => {
    handleCalendarClick(id);
    if (dateInputRefs.current[id]) {
      dateInputRefs.current[id].showPicker?.(); // Modern browsers
      dateInputRefs.current[id].focus(); // Fallback
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const selectedDate = e.target.value;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selectedDate } : item
      )
    );
    setSelectedItemId(null);
  };

  const handleClearDate = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selectedDate: "" } : item
      )
    );
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckboxChange = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const getMaxDate = () => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    return nextMonth.toISOString().split("T")[0];
  };

  const selectedItems = cartItems.filter((item) => item.isSelected);
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const isBookingDisabled = selectedItems.length === 0 || selectedItems.some((item) => !item.selectedDate);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full py-6">
      <style>
        {`
          .calendar-container {
            display: block;
            position: relative;
          }
          .calendar-container .hidden-input {
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 4px;
            opacity: 0;
            width: 0;
            height: 0;
            padding: 0;
            border: none;
            z-index: -1;
          }
          .calendar-container:focus-within .hidden-input {
            opacity: 0; /* Keep hidden but focusable */
          }
          @media (min-width: 640px) {
            .calendar-container .hidden-input {
              margin-top: 6px;
            }
          }
        `}
      </style>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-sm sm:text-base">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-xl bg-white shadow-sm border-gray-300`}
              >
                <div className="flex items-center mb-4 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={item.isSelected}
                    onChange={() => handleCheckboxChange(item.id)}
                    className="h-5 w-5 text-fuchsia-500 focus:ring-fuchsia-400 mr-3 sm:mr-4"
                    aria-label={`Select ${item.serv}`}
                  />
                  <img
                    src={item.image}
                    alt={item.serv}
                    className="rounded-xl w-12 h-12 sm:w-16 sm:h-16 object-cover"
                  />
                  <div className="ml-3 sm:ml-4">
                    <p className="text-base sm:text-lg font-semibold text-gray-800">{item.serv}</p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      ₹ <span className="clr-blue">{item.price}</span> per unit
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                  <div className="flex items-center space-x-2 bg-fuchsia-100 rounded-lg px-2 py-1 border border-fuchsia-400">
                    {item.quantity === 1 ? (
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1 sm:p-2 rounded-full hover:bg-gray-200"
                        aria-label={`Remove ${item.serv}`}
                      >
                        <Trash2 size={16} className="text-red-500 hover:text-red-700" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="p-1 sm:p-2 rounded-full hover:bg-gray-200 clr-purple"
                        aria-label={`Decrease quantity of ${item.serv}`}
                      >
                        <FiMinus size={12} />
                      </button>
                    )}
                    <span className="text-sm sm:text-base text-black w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1 sm:p-2 rounded-full hover:bg-gray-200 clr-purple"
                      aria-label={`Increase quantity of ${item.serv}`}
                    >
                      <GoPlus size={16} />
                    </button>
                  </div>

                  <div className="font-semibold text-gray-800 text-sm sm:text-base">
                    ₹ {item.price * item.quantity}
                  </div>

                  <div className="calendar-container">
                    {item.selectedDate ? (
                      <div className="flex items-center space-x-2">
                        <span
                          className="text-sm text-blue-600 cursor-pointer hover:underline"
                          onClick={() => handleIconClick(item.id)}
                          aria-label={`Edit date for ${item.serv}`}
                        >
                          📅 {item.selectedDate}
                        </span>
                        <button
                          onClick={() => handleClearDate(item.id)}
                          className="p-1 rounded-full hover:bg-gray-200"
                          aria-label={`Clear date for ${item.serv}`}
                        >
                          <X size={16} className="text-gray-500 hover:text-gray-700" />
                        </button>
                      </div>
                    ) : (
                      <FaRegCalendarAlt
                        size={20}
                        className="cursor-pointer clr-blue"
                        onClick={() => handleIconClick(item.id)}
                        aria-label={`Select date for ${item.serv}`}
                      />
                    )}

                    {/* Hidden input that triggers the native calendar */}
                    <input
                      id={`date-picker-${item.id}`}
                      ref={(el) => (dateInputRefs.current[item.id] = el)}
                      type="date"
                      onChange={(e) => handleDateChange(e, item.id)}
                      value={item.selectedDate}
                      className="hidden-input"
                      min={new Date().toISOString().split("T")[0]}
                      max={getMaxDate()}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm sm:text-base font-medium mt-4 sm:mt-6">
            <span className="text-gray-800 mb-2 sm:mb-0">Missed Something?</span>
            <div
              className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer text-sm sm:text-base"
              onClick={() => navigate("/technicianById")}
            >
              Add More Items
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-gray-700 mb-2 text-sm sm:text-base">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2 text-sm sm:text-base">
              <span>GST (18%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between text-lg sm:text-xl font-bold mt-4 text-gray-800">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className={`w-full mt-4 sm:mt-6 py-2 rounded-xl text-sm sm:text-lg font-semibold transition-all ${isBookingDisabled
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-fuchsia-500 text-white hover:bg-fuchsia-600"
                }`}
              disabled={isBookingDisabled}
            >
              {isBookingDisabled
                ? selectedItems.length === 0
                  ? "Select at least one item"
                  : "Select dates for all selected items"
                : "Book Now"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
// import React, { useEffect, useState, useRef } from "react";
// import { Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { GoPlus } from "react-icons/go";
// import { FiMinus } from "react-icons/fi";
// import { FaRegCalendarAlt } from "react-icons/fa";

// interface CartItem {
//   id: string;
//   serv: string;
//   price: number;
//   image: string;
//   quantity: number;
//   selectedDate: string;
//   isSelected: boolean;
// }

// const CartPage: React.FC = () => {
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState<CartItem[]>(() => {
//     const stored = localStorage.getItem("cartItems");
//     const parsed = stored ? JSON.parse(stored) : [
//       {
//         id: "1",
//         serv: "Plumbing Service",
//         price: 1500,
//         image: "https://via.placeholder.com/150?text=Plumbing",
//         quantity: 2,
//         selectedDate: "2025-07-15",
//         isSelected: true,
//       },
//       {
//         id: "2",
//         serv: "Electrical Repair",
//         price: 2000,
//         image: "https://via.placeholder.com/150?text=Electrical",
//         quantity: 1,
//         selectedDate: "",
//         isSelected: false,
//       },
//       {
//         id: "3",
//         serv: "AC Maintenance",
//         price: 3000,
//         image: "https://via.placeholder.com/150?text=AC",
//         quantity: 3,
//         selectedDate: "2025-07-20",
//         isSelected: true,
//       },
//     ];
//     return parsed.map((item: any) => ({
//       ...item,
//       quantity: item.quantity ?? 1,
//       selectedDate: item.selectedDate ?? "",
//       isSelected: item.isSelected ?? true,
//     }));
//   });

//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
//   const dateRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const handleCalendarClick = (itemId: string, clear: boolean = false) => {
//     if (clear) {
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.id === itemId ? { ...item, selectedDate: "" } : item
//         )
//       );
//     } else {
//       setSelectedItemId(itemId);
//       if (dateRefs.current[itemId]) {
//         dateRefs.current[itemId]?.click(); // Trigger native date picker
//       }
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

//   const handleQuantityChange = (id: string, delta: number) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   };

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

//   const selectedItems = cartItems.filter((item) => item.isSelected);
//   const subtotal = selectedItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   const tax = Math.round(subtotal * 0.18);
//   const total = subtotal + tax;

//   const isBookingDisabled = selectedItems.length === 0 || selectedItems.some((item) => !item.selectedDate);

//   return (
//     <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full py-6">
//       <style>
//         {`
//           .custom-date-input {
//             position: relative;
//             width: 100%;
//             max-width: 160px;
//           }
//           .custom-date-input::-webkit-calendar-picker-indicator {
//             opacity: 0;
//             position: absolute;
//             right: 8px;
//             width: 20px;
//             height: 20px;
//             cursor: pointer;
//             z-index: 1;
//           }
//           .custom-date-input-container::after {
//             content: "📅";
//             position: absolute;
//             right: 8px;
//             top: 50%;
//             transform: translateY(-50%);
//             pointer-events: none;
//             font-size: 16px;
//             color: #2563EB; /* Matches clr-blue */
//             z-index: 0;
//           }
//           @media (min-width: 640px) {
//             .custom-date-input {
//               max-width: 192px;
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
//                 className={`flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-xl bg-white shadow-sm ${
//                   item.isSelected && !item.selectedDate ? "border-red-400" : "border-gray-300"
//                 }`}
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

//                   <div className="relative flex items-center">
//                     {item.selectedDate ? (
//                       <span
//                         className="text-sm text-blue-600 cursor-pointer hover:underline flex items-center space-x-2"
//                         onClick={() => handleCalendarClick(item.id)}
//                         onDoubleClick={() => handleCalendarClick(item.id, true)}
//                         aria-label={`Edit or clear date for ${item.serv}`}
//                       >
//                         📅 {item.selectedDate}
//                       </span>
//                     ) : (
//                       <span
//                         className="cursor-pointer text-blue-600"
//                         onClick={() => handleCalendarClick(item.id)}
//                         aria-label={`Select date for ${item.serv}`}
//                       >
//                         📅
//                       </span>
//                     )}
//                     {selectedItemId === item.id && (
//                       <div className="custom-date-input-container absolute top-full mt-1 right-0 z-10">
//                         <input
//                           ref={(el) => (dateRefs.current[item.id] = el)}
//                           id={`date-picker-${item.id}`}
//                           type="date"
//                           onChange={(e) => handleDateChange(e, item.id)}
//                           value={item.selectedDate}
//                           className="custom-date-input border border-gray-300 rounded-lg px-2 py-1 text-sm shadow-sm bg-white focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 w-40 sm:w-48"
//                           min={new Date("2025-07-11").toISOString().split("T")[0]}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

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
//               className={`w-full mt-4 sm:mt-6 py-2 rounded-xl text-sm sm:text-lg font-semibold transition-all ${
//                 isBookingDisabled
//                   ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//                   : "bg-fuchsia-500 text-white hover:bg-fuchsia-600"
//               }`}
//               disabled={isBookingDisabled}
//             >
//               {isBookingDisabled
//                 ? selectedItems.length === 0
//                   ? "Select at least one item"
//                   : "Select dates for all selected items"
//                 : "Book Now"}
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CartPage;