import React, { useEffect, useState } from "react";
import { BsCartDash } from "react-icons/bs";
import { FaCartPlus } from "react-icons/fa6";
import { MdOutlineStar } from "react-icons/md";
import { addToCart, removeFromCart, getCartItems } from "../../api/apiMethods";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

interface TechnicianService {
  categoryServiceId: string;
  status: boolean;
  _id: string;
  details: {
    _id: string;
    categoryId: string;
    serviceName: string;
    serviceImg: string;
    servicePrice: number;
  };
}

interface Technician {
  _id: string;
  username: string;
  categoryServices: TechnicianService[];
}

interface ServicesProps {
  services: TechnicianService[];
  technician: Technician;
}

interface CartItem {
  id: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceImg: string;
  quantity: number;
  technicianId: string;
}

interface ApiError {
  statusCode: number;
  errors: string[];
}

const Services: React.FC<ServicesProps> = ({ services, technician }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to view your cart.");
        return;
      }

      const response = await getCartItems(userId);
      if (response.success && response.result.cart) {
        const formattedItems = response.result.cart.map((item: any) => ({
          id: item.serviceId,   
          serviceName: item.serviceName,
          servicePrice: item.servicePrice,
          serviceImg: item.serviceImg,
          quantity: item.quantity,
          technicianId: item.technicianId,
        }));
        setCartItems(formattedItems);
        setError(null);
      }
    } catch (error: any) {
      console.error("Error fetching cart items:", error);
      setError("Failed to fetch cart items. Please try again.");
    }
  };
  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleCartToggle = async (categoryServiceId: string) => {
    try {
      const userId = localStorage.getItem("userId");
      const technicianId = technician?._id
      if (!userId) return;

      setLoading((prev) => ({ ...prev, [categoryServiceId]: true }));
      const isInCart = cartItems.some((item) => item.id === categoryServiceId);

      if (isInCart) {
        const response = await removeFromCart({ userId, serviceId: categoryServiceId });
        if (response.success) {
          setCartItems((prev) => prev.filter((item) => item.id !== categoryServiceId));
        }
      } else {
        const payload = { technicianId, userId, serviceId: categoryServiceId, quantity: 1 };
        const response = await addToCart(payload);

        if (response.success) {
          const service = technician?.categoryServices?.find(
            (s) => s.categoryServiceId === categoryServiceId && s.status === true
          );

          if (service) {
            setCartItems((prev) => [
              ...prev,
              {
                id: service.categoryServiceId,
                serviceName: service.details.serviceName,
                servicePrice: service.details.servicePrice,
                serviceImg: service.details.serviceImg,
                quantity: 1,
              },
            ]);
          }
        }
      }
    } catch (error: any) {
      console.error("Error toggling cart item:", error);
      setError(error.message || "An error occurred while updating the cart.");
    } finally {
      setLoading((prev) => ({ ...prev, [categoryServiceId]: false }));
    }
  };

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4 my-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)]">
      {error && (
        <div className="mb-3 text-red-600 text-sm">
          {error}
          {error.includes("log in") && (
            <button
              className="ml-2 text-blue-600 underline"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          )}
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight">
          Services
        </div>
        <button
          className="flex text-sm items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded me-1"
          onClick={() => navigate("/cart")}
        >
          <Eye className="me-2" size={18} /> View Cart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {technician?.categoryServices?.filter((service) => service.status === true && service.details).length > 0 ? (
          technician.categoryServices
            .filter((service) => service.status === true && service.details)
            .map((service) => {
              const isInCart = cartItems?.some(
                (item) => item.id === service.categoryServiceId
              );

              const isLoading = loading[service.categoryServiceId];

              return (
                <div
                  key={service.categoryServiceId}
                  className="flex justify-between items-center border border-gray-300 rounded-xl py-4 px-6 shadow"
                >
                  <div>
                    <h3 className="text-md md:text-lg">
                      {service.details?.serviceName}
                    </h3>
                    <p className="text-sm text-gray-700">
                      ₹{" "}
                      <span className="text-blue-600">
                        {service.details?.servicePrice}
                      </span>{" "}
                      per Unit
                    </p>
                    <div className="flex items-center text-sm mt-1">
                      <MdOutlineStar size={18} color="#ffc71b" />
                      <span className="ms-1 text-gray-700">
                        4.5 <span className="text-gray-400">(25 Reviews)</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={service.details?.serviceImg || "/fallback-image.jpg"}
                      alt={service.details?.serviceName || "Service"}
                      className="w-28 h-28 object-cover rounded-md"
                      onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                    />
                    <button
                      className={`rounded-md px-3 py-1 flex items-center justify-center text-sm font-medium
                        ${isInCart
                          ? "text-red-600 border border-red-600"
                          : "bg-red-600 text-white hover:bg-red-700"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() =>
                        !isLoading && handleCartToggle(service.categoryServiceId)
                      }
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span>Processing...</span>
                      ) : isInCart ? (
                        <>
                          <BsCartDash size={16} />
                          <span className="ml-2">Remove</span>
                        </>
                      ) : (
                        <>
                          <FaCartPlus size={16} />
                          <span className="ml-2">Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="text-gray-700">No services available</div>
        )}
      </div>
    </div>
  );
};

export default Services;
