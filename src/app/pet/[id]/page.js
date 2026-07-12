"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../utils/supabase";

export default function PetDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [pet, setPet] = useState(null);
  const [essentials, setEssentials] = useState([]);
  const [selectedEssentials, setSelectedEssentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetailData = async () => {
      // 1. Fetch Pet Details
      const { data: petData, error: petError } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

      if (petError || !petData) {
        console.error("Error fetching pet details:", petError?.message);
      } else {
        setPet(petData);
      }

      // 2. Fetch Dynamic Essentials from Supabase
      const { data: essentialsData, error: essentialsError } = await supabase
        .from("essentials")
        .select("*")
        .order("created_at", { ascending: true });

      if (essentialsError) {
        console.error("Error fetching essentials:", essentialsError.message);
      } else {
        setEssentials(essentialsData || []);
      }

      setLoading(false);
    };

    fetchDetailData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a6659]"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] text-center p-8">
        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">Puppy Not Found</h2>
        <Link href="/pets" className="px-6 py-3 bg-[#4a6659] text-white rounded-full font-medium hover:bg-[#3d4b43]">
          Return to Available Puppies
        </Link>
      </div>
    );
  }

  const toggleEssential = (essentialId) => {
    if (selectedEssentials.includes(essentialId)) {
      setSelectedEssentials(selectedEssentials.filter((i) => i !== essentialId));
    } else {
      setSelectedEssentials([...selectedEssentials, essentialId]);
    }
  };

  const basePrice = parseFloat(pet.price) || 0;
  const essentialsTotal = selectedEssentials.reduce((acc, currentId) => {
    const item = essentials.find((e) => e.id === currentId);
    return acc + (item ? parseFloat(item.price) : 0);
  }, 0);
  const totalAdoptPrice = basePrice + essentialsTotal;

  // Build the checkout URL with selected essentials as a query param
  const checkoutUrl = `/checkout/${pet.id}${
    selectedEssentials.length > 0 ? `?essentials=${selectedEssentials.join(",")}` : ""
  }`;

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-8 md:px-16 py-5 flex justify-between items-center border-b border-gray-100 shadow-sm">
        <Link href="/" className="text-2xl font-playfair font-bold tracking-widest text-[#3d4b43]">
          HEIRLOOM PETS
        </Link>
        <nav className="hidden md:flex space-x-10 text-sm font-semibold text-gray-500 uppercase tracking-wider">
          <Link href="/pets" className="hover:text-[#4a6659] transition-colors pb-1">Our Bulldogs</Link>
          <Link href="/about" className="hover:text-[#4a6659] transition-colors pb-1">About</Link>
          <Link href="/philosophy" className="hover:text-[#4a6659] transition-colors pb-1">Philosophy</Link>
          <Link href="/contact" className="hover:text-[#4a6659] transition-colors pb-1">Contact</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full px-8 py-12 gap-16">
        
        {/* Left Column: Gallery & Details */}
        <div className="flex-1 space-y-12">
          {/* Main Gallery Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 flex items-center justify-center">
            {pet.image ? (
              <Image 
                src={pet.image} 
                alt={pet.name} 
                fill 
                sizes="(max-width: 1200px) 100vw, 50vw"
                className="object-cover"
                priority
                unoptimized={pet.image.includes("supabase.co")}
              />
            ) : (
              <span className="text-gray-400">No Image Available</span>
            )}
          </div>
          
          {/* About Section */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">About {pet.name}</h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">
              {pet.description || `Meet ${pet.name}, an incredibly beautiful ${pet.age} old English Bulldog puppy. ${pet.gender === 'Male' ? 'He' : 'She'} is currently ${pet.status.toLowerCase()} and looking for a loving home.`}
            </p>
          </section>

          {/* Health Records Accordion */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-playfair font-bold text-gray-800 mb-6">Health & Wellness Clearances</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/50">
                <span className="font-medium text-gray-800 flex items-center gap-3 text-sm md:text-base">
                  <svg className="w-5 h-5 text-[#4a6659]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Vaccinations & Vet Check
                </span>
                <span className="text-xs font-bold text-[#4a6659] bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">Verified</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/50">
                <span className="font-medium text-gray-800 flex items-center gap-3 text-sm md:text-base">
                  <svg className="w-5 h-5 text-[#4a6659]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Genetic DNA & Joint Testing
                </span>
                <span className="text-xs font-bold text-[#4a6659] bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">Clear</span>
              </div>
              {pet.document_name && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/50">
                  <span className="font-medium text-gray-800 flex items-center gap-3 text-sm md:text-base">
                    <svg className="w-5 h-5 text-[#4a6659]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Heritage Pedigree Certificate
                  </span>
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded border border-gray-200">{pet.document_name}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Checkout & Add-ons */}
        <aside className="w-full lg:w-[460px] flex-shrink-0">
          <div className="sticky top-28 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 space-y-8">
            <div>
              <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-3">{pet.name}</h1>
              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
                <span className="px-3 py-1.5 bg-gray-100 rounded-full">English Bulldog</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-full">{pet.gender}</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-full">{pet.age}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
                <p className="text-4xl font-playfair font-bold text-[#4a6659]">${totalAdoptPrice.toLocaleString()}</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Dynamic Add Essentials Carousel / Selection */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Add Essentials</h3>
              {essentials.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No essentials configured. Use dashboard to add them.</p>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {essentials.map((item) => {
                    const isSelected = selectedEssentials.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleEssential(item.id)}
                        className={`snap-start flex-shrink-0 w-36 border-2 rounded-2xl p-3 cursor-pointer transition-all relative group select-none ${
                          isSelected
                            ? "border-[#4a6659] bg-[#4a6659]/5 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {/* Checkmark overlay for selection */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#4a6659] text-white w-5 h-5 rounded-full flex items-center justify-center z-10 shadow">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}

                        <div className="aspect-square relative rounded-xl overflow-hidden mb-3 bg-gray-50">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="object-cover w-full h-full opacity-90 group-hover:opacity-100" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug min-h-[2rem]">
                          {item.name}
                        </p>
                        <p className="text-xs font-bold text-[#4a6659] mt-1.5">+${parseFloat(item.price).toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Link 
                href={checkoutUrl} 
                className="block w-full text-center py-4 bg-[#1f2937] hover:bg-[#4a6659] text-white rounded-2xl font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
              >
                PROCEED TO ADOPTION
              </Link>
              <p className="text-xs text-center text-gray-400">
                You will choose your payment option (Full or 20% Deposit) in the next step.
              </p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
