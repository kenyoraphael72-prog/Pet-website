"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import { useCart } from "../CartContext";
import Navbar from "../../components/Navbar";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [paymentOption, setPaymentOption] = useState("full");
  const [shippingPref, setShippingPref] = useState("pickup");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "", email: "", phone: "", address: "", lifestyle: ""
  });

  useEffect(() => {
    // Just a small delay to allow cart to hydrate from localStorage
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a6659]"></div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div>
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <h2 className="text-3xl font-playfair mb-4 text-gray-900">Your cart is empty</h2>
            <Link href="/pets" className="inline-block mt-4 px-8 py-4 bg-[#4a6659] text-white rounded-xl font-medium hover:bg-[#3d4b43] transition-colors shadow-lg">
              Browse Available Pets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const baseTotal = cartTotal;
  const depositAmount = baseTotal * 0.20;
  const transportFee = shippingPref === "transport" ? 450 : 0;
  const totalDueToday = (paymentOption === "full" ? baseTotal : depositAmount) + transportFee;
  const balanceRemaining = paymentOption === "deposit" ? (baseTotal - depositAmount) : 0;

  const handlePlaceOrder = async () => {
    if (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone) {
      alert("Please fill in your name, email, and phone number before placing an order.");
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    const petsInCart = cartItems.filter(item => item.type === "pet");
    const mainPetId = petsInCart.length > 0 ? petsInCart[0].id : null;
    
    // Compile items string for the location/notes field since orders table is limited
    const itemsList = cartItems.map(i => `${i.name} (${i.type})`).join(", ");

    const orderPayload = {
      buyer_name: buyerInfo.name,
      buyer_location: `${buyerInfo.address || 'No Address'} | ${buyerInfo.email} | ${buyerInfo.phone} | Items: ${itemsList}`,
      pet_id: mainPetId,
      payment_type: paymentOption === "full" ? "Full Payment" : "20% Deposit",
      balance: balanceRemaining,
      logistics_status: shippingPref === "transport" ? "Awaiting Balance - Transport Arranged" : "Awaiting Balance - Local Pickup",
    };

    const { error: orderError } = await supabase.from("orders").insert([orderPayload]);

    if (orderError) {
      alert("There was an error placing your order: " + orderError.message);
      setIsSubmitting(false);
      return;
    }

    // Mark all pets in the cart as RESERVED
    for (const pet of petsInCart) {
      const { error: petUpdateError } = await supabase
        .from("pets")
        .update({ status: "RESERVED" })
        .eq("id", pet.id);

      if (petUpdateError) {
        console.error(`Could not update pet status for ${pet.id}:`, petUpdateError.message);
      }
    }

    setIsSubmitting(false);
    setOrderSuccess(true);
    clearCart(); // Empty the cart after successful purchase
  };

  // Order success screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl p-16 shadow-2xl border border-gray-100 text-center max-w-lg w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-playfair font-semibold text-[#1f2937] mb-4">Order Placed!</h1>
            <p className="text-gray-500 font-light mb-3 text-lg">
              Thank you, <span className="font-medium text-[#1f2937]">{buyerInfo.name}</span>!
            </p>
            <p className="text-gray-500 font-light mb-8">
              Your items have been reserved. Our concierge team will contact you at <strong>{buyerInfo.email}</strong> within 24 hours with the next steps.
            </p>
            <div className="bg-[#f4f6f8] rounded-2xl p-6 text-left space-y-2 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Type</span>
                <span className="font-medium">{paymentOption === "full" ? "Full Payment" : "20% Deposit"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Due Today</span>
                <span className="font-semibold text-[#4a6659]">${totalDueToday.toLocaleString()}</span>
              </div>
              {balanceRemaining > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Remaining Balance</span>
                  <span className="font-medium">${balanceRemaining.toLocaleString()}</span>
                </div>
              )}
            </div>
            <Link href="/pets" className="w-full block text-center py-4 bg-[#4a6659] text-white rounded-xl font-medium hover:bg-[#3d4b43] transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-12 flex flex-col md:flex-row gap-12">
        {/* Checkout Wizard */}
        <div className="flex-1">
          {/* Progress Indicator */}
          <div className="flex gap-4 mb-12">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? "bg-[#4a6659]" : "bg-gray-200"}`} />
              </div>
            ))}
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">

            {/* ── STEP 1: Buyer Info ── */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-playfair font-bold text-[#1f2937] mb-8">1. Your Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input type="text" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a6659] transition" placeholder="Jane Doe" value={buyerInfo.name} onChange={e => setBuyerInfo({...buyerInfo, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input type="email" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a6659] transition" placeholder="jane@example.com" value={buyerInfo.email} onChange={e => setBuyerInfo({...buyerInfo, email: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a6659] transition" placeholder="+1 (555) 123-4567" value={buyerInfo.phone} onChange={e => setBuyerInfo({...buyerInfo, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a6659] transition" placeholder="123 Luxury Lane, Beverly Hills, CA" value={buyerInfo.address} onChange={e => setBuyerInfo({...buyerInfo, address: e.target.value})} />
                  </div>
                  <button
                    onClick={() => {
                      if (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone) {
                        alert("Please fill in your Name, Email, and Phone to continue.");
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full py-4 bg-[#1f2937] text-white rounded-xl font-medium mt-4 hover:bg-[#4a6659] transition-colors"
                  >
                    CONTINUE TO SHIPPING
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Shipping ── */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-playfair font-bold text-[#1f2937] mb-8">2. Delivery Preferences</h2>
                <div className="space-y-4">
                  <label className={`block border-2 ${shippingPref === "pickup" ? "border-[#4a6659] bg-[#4a6659]/5" : "border-gray-200"} rounded-xl p-6 cursor-pointer hover:border-[#4a6659] transition-all`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="shipping" checked={shippingPref === "pickup"} onChange={() => setShippingPref("pickup")} className="w-5 h-5 text-[#4a6659]" />
                        <div>
                          <p className="font-bold text-[#1f2937]">Local Pickup</p>
                          <p className="text-sm text-gray-500">Pick up your companion at our private estate location.</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600">Free</span>
                    </div>
                  </label>
                  <label className={`block border-2 ${shippingPref === "transport" ? "border-[#4a6659] bg-[#4a6659]/5" : "border-gray-200"} rounded-xl p-6 cursor-pointer hover:border-[#4a6659] transition-all`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="shipping" checked={shippingPref === "transport"} onChange={() => setShippingPref("transport")} className="w-5 h-5 text-[#4a6659]" />
                        <div>
                          <p className="font-bold text-[#1f2937]">Insured Pet Transport (Flight Nanny)</p>
                          <p className="text-sm text-gray-500">Hand-delivered safely to your nearest major airport.</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#1f2937]">+$450</span>
                    </div>
                  </label>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(1)} className="px-6 py-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">BACK</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-4 bg-[#1f2937] text-white rounded-xl font-medium hover:bg-[#4a6659] transition-colors">CONTINUE TO PAYMENT</button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Payment ── */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-playfair font-bold text-[#1f2937] mb-8">3. Payment Method</h2>

                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Select Payment Option</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentOption("full")}
                      className={`border-2 rounded-xl p-6 text-left transition-all ${paymentOption === "full" ? "border-[#4a6659] bg-[#4a6659]/5 shadow-md" : "border-gray-200 hover:border-[#4a6659]"}`}
                    >
                      <p className="font-bold text-[#1f2937] mb-1">Pay in Full</p>
                      <p className="text-3xl font-playfair font-bold text-[#4a6659]">${baseTotal.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-2 font-medium">No remaining balance.</p>
                    </button>
                    <button
                      onClick={() => setPaymentOption("deposit")}
                      className={`border-2 rounded-xl p-6 text-left transition-all ${paymentOption === "deposit" ? "border-[#4a6659] bg-[#4a6659]/5 shadow-md" : "border-gray-200 hover:border-[#4a6659]"}`}
                    >
                      <p className="font-bold text-[#1f2937] mb-1">20% Deposit</p>
                      <p className="text-3xl font-playfair font-bold text-[#4a6659]">${depositAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Balance: ${(baseTotal - depositAmount).toLocaleString()} due later.</p>
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-4">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm text-amber-800 leading-relaxed font-medium">
                    After placing your order, our concierge team will contact you within 24 hours with secure payment instructions. Your items will be reserved immediately.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="px-6 py-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">BACK</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-[#4a6659] text-white rounded-xl font-bold tracking-wide hover:bg-[#3d4b43] transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white/40 border-t-white rounded-full"></div>
                        Placing Order...
                      </>
                    ) : (
                      <>✓ PLACE ORDER — ${totalDueToday.toLocaleString()}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="w-full md:w-[400px] flex-shrink-0">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
            <h3 className="text-xl font-playfair font-bold text-[#1f2937] mb-6">Order Summary</h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
              {cartItems.map(item => (
                <div key={item.uniqueId} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative bg-gray-100 flex items-center justify-center shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    ) : (
                      <span className="text-xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1f2937] leading-tight line-clamp-1">{item.name}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.type}</span>
                    <p className="text-sm font-semibold text-[#4a6659] mt-1">${parseFloat(item.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm mb-6 border-t border-gray-100 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-bold text-gray-900">${baseTotal.toLocaleString()}</span>
              </div>
              {paymentOption === "deposit" && (
                <div className="flex justify-between text-[#4a6659]">
                  <span className="font-medium">20% Deposit (today)</span>
                  <span className="font-bold">${depositAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Delivery & Shipping</span>
                <span className="font-bold text-gray-900">{transportFee > 0 ? `$${transportFee}` : "Free"}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 flex justify-between items-end">
              <span className="font-bold text-[#1f2937] text-lg">Due Today</span>
              <span className="text-3xl font-playfair font-bold text-[#4a6659]">${totalDueToday.toLocaleString()}</span>
            </div>

            {paymentOption === "deposit" && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-center text-gray-500 font-medium border border-gray-100">
                Remaining balance of <span className="text-gray-900 font-bold">${balanceRemaining.toLocaleString()}</span> is due prior to final delivery.
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
