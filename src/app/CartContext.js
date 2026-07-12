"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("heirloom_cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Could not load cart", e);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("heirloom_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    // Check if pet is already in cart
    if (item.type === "pet" && cartItems.some((i) => i.id === item.id && i.type === "pet")) {
      setIsCartOpen(true);
      return;
    }
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (uniqueId) => {
    setCartItems((prev) => prev.filter((i) => i.uniqueId !== uniqueId));
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      isCartOpen,
      toggleCart,
      openCart,
      closeCart,
      clearCart,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
