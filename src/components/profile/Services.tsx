import { Pencil, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BsCartDash } from "react-icons/bs";
import { FaCartPlus, FaTrash } from "react-icons/fa6";
import { MdOutlineStar } from "react-icons/md";

const Services = () => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [role, setRole] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [services, setServices] = useState([
    {
      id: 1,
      serv: "Ac Installations & Replacement",
      ratings: "4.8",
      reviews: "376",
      price: "199",
      image:
        "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
    },
    { id: 2, serv: "Ac Repairs", ratings: "4.0", reviews: "572", price: "99" },
    { id: 3, serv: "Ac Fitting", ratings: "3.8", reviews: "276", price: "199" },
    {
      id: 4,
      serv: "Ac Cleaning",
      ratings: "4.8",
      reviews: "376",
      price: "149",
      image:
        "https://media.istockphoto.com/id/501277671/photo/since-opportunity-didnt-knock-he-decided-to-build-a-door.jpg?b=1&s=612x612&w=0&k=20&c=DbvBeDdGaIPjC6citMpjlV51-KIBub5ujg-tSectBek=",
    },
    {
      id: 5,
      serv: "Ac Parts Fixings",
      ratings: "4.8",
      reviews: "326",
      price: "299",
      image:
        "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
    },
    {
      id: 6,
      serv: "Ac Installations",
      ratings: "5.0",
      reviews: "376",
      price: "149",
      image:
        "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
    },
  ]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    serv: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleCartToggle = (serviceId: number) => {
    setCartItems((prev) => {
      const isAlreadyInCart = prev.find((item) => item.id === serviceId);
      if (isAlreadyInCart) {
        return prev.filter((item) => item.id !== serviceId);
      } else {
        const serviceToAdd = services.find((s) => s.id === serviceId);
        return [...prev, { ...serviceToAdd }];
      }
    });
  };

  const handleEdit = (serviceId: number) => {
    const service = services.find((s) => s.id === serviceId);
    setEditService({ ...service });
    setEditModalOpen(true);
  };

  const handleDelete = (serviceId: number) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    setEditModalOpen(false);
  };

  // Only allow editing name, price, and image
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditService((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditService((prev: any) => ({
          ...prev,
          image: ev.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = () => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === editService.id
          ? { ...s, serv: editService.serv, price: editService.price, image: editService.image }
          : s
      )
    );
    setEditModalOpen(false);
  };

  // Add new service handlers
  const handleAddServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewService((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewService((prev) => ({
          ...prev,
          image: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddService = () => {
    if (!newService.serv || !newService.price || !newService.image) return;
    setServices((prev) => [
      ...prev,
      {
        id: Date.now(),
        serv: newService.serv,
        price: newService.price,
        image: newService.image,
        ratings: "0.0",
        reviews: "0",
      },
    ]);
    setAddModalOpen(false);
    setNewService({ serv: "", price: "", image: "" });
  };

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4 my-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight">
          Services
        </div>
        {role === "technician" && (
          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>

        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {services?.map((item, index) => {
          const isInCart = cartItems.some(
            (cartItem) => cartItem.id === item.id
          );

          return (
            <div
              className="flex justify-between items-center border border-gray-300 rounded-xl py-4 px-6 shadow"
              key={index}
            >
              <div>
                <div className="text-sm sm:text-md md:text-lg lg:text-lg xl:text-xl">
                  {item?.serv}
                </div>
                <div className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
                  ₹ <span className="clr-blue">{item?.price}</span> per Unit
                </div>
                <div className="flex items-center text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
                  <MdOutlineStar size={18} color="#ffc71b" />
                  <div className="clr-black ms-1 ">
                    {item?.ratings}
                    <span className="text-gray-500 ms-2">
                      ({item?.reviews} Reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-t-lg object-cover w-20 sm:w-28 md:w-36 lg:w-40 xl:w-45 h-30"
                />
                {role === "technician" ? (
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                      onClick={() => handleEdit(item.id)}
                    >
                     <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                ) : (
                  <div
                    className={`rounded-b-lg px-2 py-1 flex cursor-pointer items-center justify-center 
                      ${isInCart
                        ? "text-red-600 border border-red-600"
                        : " bg-red-600 border-b text-white hover:bg-red-700"
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
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Service Modal */}
      {editModalOpen && editService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setEditModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Service</h2>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">
                Service Name
                <input
                  type="text"
                  name="serv"
                  value={editService.serv}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="text-sm font-medium">
                Price
                <input
                  type="text"
                  name="price"
                  value={editService.price}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="text-sm font-medium">
                Image
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleEditImageChange}
                  className="border rounded px-2 py-1 w-full mt-1"
                />
              </label>
              {editService.image && (
                <img
                  src={editService.image}
                  alt="Preview"
                  className="w-32 h-24 object-cover rounded mt-2 border"
                />
              )}
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleEditSave}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Service Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setAddModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">
                Service Name
                <input
                  type="text"
                  name="serv"
                  value={newService.serv}
                  onChange={handleAddServiceChange}
                  className="border rounded px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="text-sm font-medium">
                Price
                <input
                  type="text"
                  name="price"
                  value={newService.price}
                  onChange={handleAddServiceChange}
                  className="border rounded px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="text-sm font-medium">
                Image
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleAddServiceImageChange}
                  className="border rounded px-2 py-1 w-full mt-1"
                />
              </label>
              {newService.image && (
                <img
                  src={newService.image}
                  alt="Preview"
                  className="w-32 h-24 object-cover rounded mt-2 border"
                />
              )}
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={handleAddService}
                >
                  Add Service
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;

// import React, { useEffect, useState } from "react";
// import { BsCartDash } from "react-icons/bs";
// import { FaCartPlus } from "react-icons/fa6";
// import { MdOutlineStar } from "react-icons/md";

// const Services = () => {
//   const [cartItems, setCartItems] = useState(() => {
//     const stored = localStorage.getItem("cartItems");
//     return stored ? JSON.parse(stored) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const services = [
//     {
//       id: 1,
//       serv: "Ac Installations & Replacement",
//       ratings: "4.8",
//       reviews: "376",
//       price: "199",
//       image: "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
//     },
//     { id: 2, serv: "Ac Repairs", ratings: "4.0", reviews: "572", price: "99" },
//     { id: 3, serv: "Ac Fitting", ratings: "3.8", reviews: "276", price: "199" },
//     {
//       id: 4,
//       serv: "Ac Cleaning",
//       ratings: "4.8",
//       reviews: "376",
//       price: "149",
//       image: "https://media.istockphoto.com/id/501277671/photo/since-opportunity-didnt-knock-he-decided-to-build-a-door.jpg?b=1&s=612x612&w=0&k=20&c=DbvBeDdGaIPjC6citMpjlV51-KIBub5ujg-tSectBek=",
//     },
//     {
//       id: 5,
//       serv: "Ac Parts Fixings",
//       ratings: "4.8",
//       reviews: "326",
//       price: "299",
//        image: "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
//     },
//     {
//       id: 6,
//       serv: "Ac Installations",
//       ratings: "5.0",
//       reviews: "376",
//       price: "149",
//        image: "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
//     },
//   ];

//   // const handleCartToggle = (serviceId) => {
//   //   setCartItems((prev) =>
//   //     prev.includes(serviceId)
//   //       ? prev.filter((id) => id !== serviceId)
//   //       : [...prev, serviceId]
//   //   );
//   // };

//   const handleCartToggle = (serviceId) => {
//   setCartItems((prev) => {
//     const isAlreadyInCart = prev.find((item) => item.id === serviceId);
//     if (isAlreadyInCart) {
//       return prev.filter((item) => item.id !== serviceId);
//     } else {
//       const serviceToAdd = services.find((s) => s.id === serviceId);
//       return [...prev, { ...serviceToAdd},];
//     }
//   });
// };

//   return (
//     <div className="border border-gray-200 shadow-md rounded-xl p-4 my-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)]">
//       <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight mb-3">
//         Services
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
//         {services?.map((item, index) => {
//           const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

//           return (
//             <div
//               className="flex justify-between items-center border border-gray-300 rounded-xl py-4 px-6 shadow"
//               key={index}
//             >
//               <div>
//                 <div className="text-sm sm:text-md md:text-lg lg:text-lg xl:text-xl">
//                   {item?.serv}
//                 </div>

//                 <div className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
//                   ₹ <span className="clr-blue">{item?.price}</span> per Unit
//                 </div>
//                 <div className="flex items-center text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
//                   <MdOutlineStar size={18} color="#ffc71b" />
//                   <div className="clr-black ms-1 ">
//                     {item?.ratings}
//                     <span className="text-gray-500 ms-2">
//                       ({item?.reviews} Reviews)
//                     </span>
//                   </div>
//                 </div>
//               </div>
// <div className="">
//   <img src={item?.image} alt={item?.name} className="rounded-t-lg object-cover w-20 sm:w-28 md:w-36 lg:w-40 xl:w-45 h-30"/>
//               <div
//                 className={` rounded-b-lg px-2 py-1 flex cursor-pointer items-center justify-center
//                       ${
//                         isInCart
//                           ? "text-red-600 border border-red-600"
//                           : " bg-red-600 border-b text-white hover:bg-red-700"
//                       }
//                       `}
//                 onClick={() => handleCartToggle(item.id)}
//               >
//                 {isInCart ? (
//                   <BsCartDash size={16} className="flex" />
//                 ) : (
//                   <FaCartPlus size={18} className="flex" />
//                 )}
//                 <div className="text-sm sm:text-sm md:text-sm lg:text-lg xl:text-lg font-extralight ms-2 whitespace-nowrap">
//                   {isInCart ? "Remove" : "Add to Cart"}
//                 </div>
//               </div>
//               </div>

//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Services;
