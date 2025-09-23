// context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCartItems } from "../api/apiMethods";

interface CartContextProps {
  cartCount: number;
  fetchCartCount: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState<number>(0);

  const fetchCartCount = async () => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem('role')
    if(role == 'technician'){
      console.log("your are technician")
      return;
    }
    if (!userId ) {
      setCartCount(0);
      return;
    }

    try {
      const res = await getCartItems(userId);
      const items = res?.result?.cart || [];
      setCartCount(items.length);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };
useEffect(() => {
  fetchCartCount();
  window.dispatchEvent(new Event("cartUpdated"));
}, []);

//   useEffect(() => {
//     fetchCartCount(); // fetch on initial load
//     // Listen for manual refresh triggers
//     window.addEventListener("cartUpdated", fetchCartCount);
//     return () => {
//       window.removeEventListener("cartUpdated", fetchCartCount);
//     };
//   }, []);


  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
