"use client";

import Link from "next/link";
import { useCart } from "../app/CartContext";

export default function Navbar() {
  const { cartItems, openCart } = useCart();
  const itemCount = cartItems.length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-8 md:px-16 py-5 flex justify-between items-center border-b border-gray-100 shadow-sm">
      <Link href="/" className="text-2xl md:text-3xl font-playfair font-bold tracking-widest text-[#3d4b43]">
        HEIRLOOM PETS
      </Link>
      
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex space-x-10 text-sm font-semibold text-gray-500 uppercase tracking-wider">
          <Link href="/pets" className="hover:text-[#4a6659] transition-colors pb-1">Our Bulldogs</Link>
          <Link href="/about" className="hover:text-[#4a6659] transition-colors pb-1">About</Link>
          <Link href="/philosophy" className="hover:text-[#4a6659] transition-colors pb-1">Philosophy</Link>
          <Link href="/contact" className="hover:text-[#4a6659] transition-colors pb-1">Contact</Link>
        </nav>

        {/* Cart Icon */}
        <button 
          onClick={openCart} 
          className="relative text-gray-800 hover:text-[#4a6659] transition-colors focus:outline-none p-2"
          aria-label="Open Cart"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#4a6659] rounded-full min-w-[1.25rem]">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
