import { Pencil, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BsCartDash } from "react-icons/bs";
import { FaCartPlus, FaTrash } from "react-icons/fa6";
import { MdOutlineStar } from "react-icons/md";
import { getServicesByTechId, updateServiceControl, createServiceControl, deleteServiceById } from '../../api/apiMethods';

const TechnicianServices = () => {
  const [cartItems, setCartItems] = useState<any[]>(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [role, setRole] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newService, setNewService] = useState<{ serv: string; price: string; image: string | File }>({
    serv: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    let id = localStorage.getItem("userId");
    console.log("valuex : ",id)
 //   id = "686a65eb4551a5e01e71afb6"
  //  id=      "686a65f24551a5e01e71afb9"
    if (id) {
      getServicesByTechId(id)
        .then((data: any) => {
          if (data?.result && Array.isArray(data.result)) {
            setServices(data.result.map((service: any) => ({
              id: service._id,
              serv: service.serviceName,
              price: service.servicePrice,
              image: service.serviceImg,
              ratings: "0.0",
              reviews: "0"
            })));
          }
        })
        .catch((err: any) => {
          console.error('Failed to fetch technician services:', err);
        });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleCartToggle = (serviceId: number) => {
    setCartItems((prev: any[]) => {
      const isAlreadyInCart = prev.find((item: any) => item.id === serviceId);
      if (isAlreadyInCart) {
        return prev.filter((item: any) => item.id !== serviceId);
      } else {
        const serviceToAdd = services.find((s: any) => s.id === serviceId);
        return [...prev, { ...serviceToAdd }];
      }
    });
  };

  const handleEdit = (serviceId: number) => {
    const service = services.find((s: any) => s.id === serviceId);
    setEditService({ ...service });
    setEditModalOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    console.log("Deleting service with id:", serviceId);
    await deleteServiceById(serviceId);
    setServices((prev: any[]) => prev.filter((s: any) => s.id !== serviceId));
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

  const handleEditSave = async () => {
    const formData = new FormData();
    formData.append("serviceName", editService.serv);
    formData.append("serviceId", editService.id);
    formData.append("servicePrice", editService.price);
    if (editService.image && typeof editService.image !== 'string') {
      formData.append("serviceImage", editService.image);
    }
    await updateServiceControl(formData);
    setServices((prev: any[]) =>
      prev.map((s: any) =>
        s.id === editService.id
          ? { ...s, serv: editService.serv, price: editService.price, image: editService.image }
          : s
      )
    );
    setEditModalOpen(false);
  };

  const handleAddServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewService((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewService((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleAddService = async () => {
    if (!newService.serv || !newService.price || !newService.image) return;
    const id = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("technicianId", id || "");
    formData.append("serviceName", newService.serv);
    formData.append("servicePrice", newService.price);
    if (newService.image && newService.image instanceof File) {
      formData.append("serviceImg", newService.image);
    }
    for (let pair of formData.entries()) {
      console.log("debug : ",pair[0]+ ':', pair[1]);
    }
    await createServiceControl(formData);
    setAddModalOpen(false);
    setNewService({ serv: "", price: "", image: "" });
  };

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4 my-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight">
          Services
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {services?.map((item: any, index: number) => {
          const isInCart = cartItems.some(
            (cartItem: any) => cartItem.id === item.id
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
                  src={item?.image}
                  alt={item?.serv}
                  className="rounded-t-lg object-cover w-20 sm:w-28 md:w-36 lg:w-40 xl:w-45 h-30"
                />
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
                  type="number"
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
                  required
                />
              </label>
              <label className="text-sm font-medium">
                Price
                <input
                  type="number"
                  name="price"
                  value={newService.price}
                  onChange={handleAddServiceChange}
                  className="border rounded px-2 py-1 w-full mt-1"
                  required
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
                  required
                />
              </label>
              {typeof newService.image === 'string' && newService.image && (
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
                  disabled={
                    !newService.serv ||
                    !newService.price ||
                    !newService.image
                  }
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

export default TechnicianServices;