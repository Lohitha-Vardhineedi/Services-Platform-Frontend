import React, { useEffect, useState } from "react";
import { BsCartDash } from "react-icons/bs";
import { FaCartPlus } from "react-icons/fa6";
import { MdOutlineStar } from "react-icons/md";

const Services = () => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const services = [
    {
      id: 1,
      serv: "Ac Installations & Replacement",
      ratings: "4.8",
      reviews: "376",
      price: "199",
      image: "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
    },
    { id: 2, serv: "Ac Repairs", ratings: "4.0", reviews: "572", price: "99" },
    { id: 3, serv: "Ac Fitting", ratings: "3.8", reviews: "276", price: "199" },
    {
      id: 4,
      serv: "Ac Cleaning",
      ratings: "4.8",
      reviews: "376",
      price: "149",
      image: "https://media.istockphoto.com/id/501277671/photo/since-opportunity-didnt-knock-he-decided-to-build-a-door.jpg?b=1&s=612x612&w=0&k=20&c=DbvBeDdGaIPjC6citMpjlV51-KIBub5ujg-tSectBek=",
    },
    {
      id: 5,
      serv: "Ac Parts Fixings",
      ratings: "4.8",
      reviews: "326",
      price: "299",
       image: "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
    },
    {
      id: 6,
      serv: "Ac Installations",
      ratings: "5.0",
      reviews: "376",
      price: "149",
       image: "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
    },
  ];

  // const handleCartToggle = (serviceId) => {
  //   setCartItems((prev) =>
  //     prev.includes(serviceId)
  //       ? prev.filter((id) => id !== serviceId)
  //       : [...prev, serviceId]
  //   );
  // };

  const handleCartToggle = (serviceId) => {
  setCartItems((prev) => {
    const isAlreadyInCart = prev.find((item) => item.id === serviceId);
    if (isAlreadyInCart) {
      return prev.filter((item) => item.id !== serviceId);
    } else {
      const serviceToAdd = services.find((s) => s.id === serviceId);
      return [...prev, { ...serviceToAdd},];
    }
  });
};

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4 my-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)]">
      <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight mb-3">
        Services
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {services?.map((item, index) => {
          const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);;
          
          return (
            <div
              className="flex justify-between items-center border border-gray-300 rounded-xl p-4 shadow"
              key={index}
            >
              <div>
                <div className="text-sm sm:text-md md:text-lg lg:text-lg xl:text-lg">
                  {item?.serv}
                </div>

                <div className="text-sm sm:text-sm md:text-md lg:text-md xl:text-md">
                  ₹ <span className="clr-blue">{item?.price}</span> per Unit
                </div>
                <div className="flex text-sm sm:text-sm md:text-md lg:text-md xl:text-md">
                  <MdOutlineStar size={18} color="#ffc71b" />
                  <div className="clr-black ms-1 ">
                    {item?.ratings}
                    <span className="text-gray-500 ms-2">
                      ({item?.reviews} Reviews)
                    </span>
                  </div>
                </div>
              </div>
<div className="">
  <img src={item?.image} alt={item?.name} className="rounded-lg object-cover w-20 sm:w-28 md:w-36 lg:w-40 xl:w-45 h-30"/>
              <div
                className={` rounded-sm px-2 py-1 flex cursor-pointer items-center justify-center 
                      ${
                        isInCart
                          ? "text-red-600 border border-red-600"
                          : " bg-red-600 text-white hover:bg-red-700"
                      }
                      `}
                onClick={() => handleCartToggle(item.id)}
              >
                {isInCart ? (
                  <BsCartDash size={16} className="flex" />
                ) : (
                  <FaCartPlus size={18} className="flex" />
                )}
                <div className="text-sm sm:text-sm md:text-sm lg:text-lg xl:text-lg font-extralight ms-2 whitespace-nowrap">
                  {isInCart ? "Remove" : "Add to Cart"}
                </div>
              </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
