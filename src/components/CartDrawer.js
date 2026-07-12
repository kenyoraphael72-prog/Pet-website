"use client";

import { useCart } from "../app/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
  const { cartItems, isCartOpen, closeCart, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={closeCart} 
      />
      
      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-playfair font-bold text-gray-900">Your Selection</h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-gray-800 transition-colors focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <p className="text-lg font-light">Your cart is empty.</p>
              <button onClick={closeCart} className="text-[#4a6659] font-medium hover:underline">Continue Browsing</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.uniqueId} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 relative overflow-hidden shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-playfair font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.uniqueId)} 
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                    {item.type === "pet" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded mt-1 inline-block">
                        Companion
                      </span>
                    )}
                    {item.type === "essential" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded mt-1 inline-block">
                        Essential
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-[#4a6659] mt-2">
                    ${parseFloat(item.price || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-playfair font-bold text-[#4a6659]">${cartTotal.toLocaleString()}</span>
            </div>
            <Link 
              href="/checkout" 
              onClick={closeCart}
              className="block w-full text-center py-4 bg-[#1f2937] hover:bg-[#4a6659] text-white rounded-xl font-semibold tracking-wide shadow-lg transition-colors"
            >
              PROCEED TO SECURE CHECKOUT
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
