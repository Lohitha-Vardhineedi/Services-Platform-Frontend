import React, { useEffect, useRef, useState } from "react";
import { Calendar1Icon, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";

const CartPage = () => {
  const dateInputRef = useRef(null);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

   const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker(); 
      dateInputRef.current.focus();     
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    console.log("Selected date:", selectedDate);
    // You can store this in state or send it to the backend
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
        <p className="text-gray-500  ">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow"
              >
                <div className="flex">
                  <img src={item?.image} alt={item?.serv} className="rounded-xl w-10 sm:w-10 md:w-15 lg:w-20 xl:w-25 h-10"/>
                <div className="flex-1 ms-4">
                  <p className="text-lg font-semibold">{item.serv}</p>
                  <p className="text-gray-600 items-center">
                    ₹ <span className="clr-blue">{item.price}</span> per unit
                  </p>
                </div>
                </div>

 <div className="flex items-center space-x-2 bg-fuchsia-100 rounded-lg px-1 border border-fuchsia-400">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="p-1  rounded-full  hover:bg-gray-200 clr-purple"
                    >
                     <FiMinus size={10}/>
                    </button>
                    <span className="text-sm text-black">{item.quantity} 3</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1  rounded-full  hover:bg-gray-200 clr-purple"
                    >
                    <GoPlus size={15}/>
                    </button>
                  </div>

                <div className="flex items-center space-x-4">
                  <div className="font-semibold text-gray-800">₹ {item.price}</div>
                  {/* <button onClick={() => handleRemove(item.id)}>
                    <Trash2 size={20} className="text-red-500 hover:text-red-700 flex cursor-pointer" />
                  </button> */}
                  <div className="relative">
<FaRegCalendarAlt size={20} className="flex clr-blue cursor-pointer "  onClick={handleCalendarClick}/>
                  <input
        type="date"
        ref={dateInputRef}
        onChange={handleDateChange}
        className="hidden absolute right-0 bottom-0"
      />
                </div>
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
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-3 border-t pt-4">
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

            <button
              className="w-full mt-6 bg-fuchsia-500 text-white py-2 rounded-xl text-lg font-semibold hover:bg-fuchsia-600 transition-all cursor-pointer"
              // onClick={() => alert("Proceeding to payment...")}
            >
              Book Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

// import React, { useState } from "react";
// import { Trash2 } from "lucide-react";

// const initialCartItems = [
//   {
//     id: 1,
//     service: "AC Servicing",
//     price: 499,
//     quantity: 1,
//   },
//   {
//     id: 2,
//     service: "Pest Control",
//     price: 799,
//     quantity: 1,
//   },
// ];

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState(initialCartItems);

//   const handleQuantityChange = (id, delta) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   };

//   const handleRemove = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const tax = Math.round(subtotal * 0.18); // 18% GST
//   const total = subtotal + tax;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

//       {cartItems.length === 0 ? (
//         <p className="text-gray-500">Your cart is empty.</p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {cartItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex items-center justify-between border p-4 rounded-xl bg-white shadow-sm"
//               >
//                 <div>
//                   <p className="text-lg font-semibold">{item.service}</p>
//                   <p className="text-gray-600">₹{item.price} per unit</p>
//                 </div>

//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={() => handleQuantityChange(item.id, -1)}
//                     className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                   >
//                     -
//                   </button>
//                   <span>{item.quantity}</span>
//                   <button
//                     onClick={() => handleQuantityChange(item.id, 1)}
//                     className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                   >
//                     +
//                   </button>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <p className="font-semibold text-gray-800">
//                     ₹{item.price * item.quantity}
//                   </p>
//                   <button onClick={() => handleRemove(item.id)}>
//                     <Trash2 className="text-red-500 hover:text-red-700" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Summary Section */}
//           <div className="mt-8 border-t pt-6">
//             <div className="flex justify-between text-gray-700 mb-2">
//               <span>Subtotal</span>
//               <span>₹{subtotal}</span>
//             </div>
//             <div className="flex justify-between text-gray-700 mb-2">
//               <span>GST (18%)</span>
//               <span>₹{tax}</span>
//             </div>
//             <div className="flex justify-between text-xl font-bold mt-4 text-gray-800">
//               <span>Total</span>
//               <span>₹{total}</span>
//             </div>

//             <button
//               className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all"
//               onClick={() => alert("Proceeding to payment...")}
//             >
//               Proceed to Payment
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CartPage;
