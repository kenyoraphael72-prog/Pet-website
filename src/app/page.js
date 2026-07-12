"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./utils/supabase";
import { REVIEWS } from "./data/reviews";

// Showcase bulldogs (displayed when database has no entries yet)
const SHOWCASE_BULLDOGS = [
  {
    id: "showcase-1",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop",
    name: "Winston",
    gender: "Male",
    age: "10 weeks",
    price: "4500",
    lineage: "Champion Bloodline",
    status: "AVAILABLE",
    isShowcase: true,
  },
  {
    id: "showcase-2",
    image: "https://images.unsplash.com/photo-1558929996-da64ba858215?q=80&w=800&auto=format&fit=crop",
    name: "Duchess",
    gender: "Female",
    age: "8 weeks",
    price: "4800",
    lineage: "Royal Heritage",
    status: "AVAILABLE",
    isShowcase: true,
  },
  {
    id: "showcase-3",
    image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=800&auto=format&fit=crop",
    name: "Churchill",
    gender: "Male",
    age: "12 weeks",
    price: "5200",
    lineage: "Elite Pedigree",
    status: "AVAILABLE",
    isShowcase: true,
  },
];

// ─────────────────────────────────────────────────────────
//  HERO SLIDESHOW COMPONENT
//  Slides: [Video 1, Video 2, Hero Image]  — 8s each, crossfade
// ─────────────────────────────────────────────────────────
const SLIDES = [
  { type: "video", src: "/bg_video1.mp4" },
  { type: "video", src: "/bg_video2.mp4" },
  { type: "image", src: "/bulldog_hero.png" },
];
const SLIDE_DURATION = 9000; // ms each slide stays visible
const FADE_DURATION  = 1800; // ms cinematic crossfade

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState(null);
  const [fading, setFading]   = useState(false);
  const timerRef  = useRef(null);
  const videoRefs = useRef([]);

  const goTo = useCallback((nextIdx) => {
    if (fading) return;
    setPrev(current);
    setFading(true);
    setTimeout(() => {
      setCurrent(nextIdx);
      setPrev(null);
      setFading(false);
      // Auto-play video if the new slide is a video
      const vid = videoRefs.current[nextIdx];
      if (vid) { vid.currentTime = 0; vid.play().catch(() => {}); }
    }, FADE_DURATION);
  }, [current, fading]);

  // Auto-advance timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      goTo((current + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [current, goTo]);

  // Start first video on mount
  useEffect(() => {
    const vid = videoRefs.current[0];
    if (vid) vid.play().catch(() => {});
  }, []);

  return (
    <section className="relative w-full h-[580px] overflow-hidden">
      {/* ── Slide layers (stacked, crossfade via opacity) ── */}
      {SLIDES.map((slide, idx) => {
        const isActive   = idx === current;
        const isPrev     = idx === prev;
        const opacity    = isActive ? 1 : (isPrev && fading ? 0 : 0);
        const transition = `opacity ${FADE_DURATION}ms cubic-bezier(0.45,0,0.2,1)`;
        // Cinematic Ken Burns: active slide slowly zooms in
        const scale      = isActive ? 1.06 : 1;
        const scaleTransition = isActive ? `transform ${SLIDE_DURATION + FADE_DURATION}ms cubic-bezier(0.25,0.1,0.25,1)` : 'none';

        return (
          <div
            key={idx}
            className="absolute inset-0"
            style={{ opacity, transition, zIndex: isActive ? 2 : (isPrev ? 1 : 0) }}
          >
            <div className="w-full h-full" style={{ transform: `scale(${scale})`, transition: scaleTransition, transformOrigin: 'center center' }}>
              {slide.type === "video" ? (
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={slide.src}
                  className="w-full h-full object-cover"
                  autoPlay={idx === 0}
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={slide.src}
                  alt="English Bulldog — Heirloom Pets"
                  fill
                  sizes="100vw"
                  className="object-cover object-[center_20%]"
                  priority
                />
              )}
            </div>
          </div>
        );
      })}

      {/* ── Gradient overlays (above all slides, z-10) ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/45 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* ── Hero Text ── */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-24 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#a8c5b8] mb-5 drop-shadow">
          Premium English Bulldog Breeder
        </span>
        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white leading-tight mb-5 drop-shadow-xl">
          Find Your<br />
          <span className="italic text-[#a8c5b8]">Forever</span> Companion.
        </h1>
        <p className="text-white/90 text-base md:text-lg font-light leading-relaxed max-w-lg mb-9 drop-shadow">
          Hand-raised English Bulldogs with champion bloodlines, certified health, and a lifetime of love — ready for their forever family.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#bulldogs"
            className="px-8 py-4 bg-[#4a6659] text-white rounded-full font-semibold hover:bg-[#3d4b43] transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-center"
          >
            Browse Available Bulldogs
          </a>
          <Link
            href="/contact"
            className="px-8 py-4 bg-black/40 backdrop-blur text-white rounded-full font-semibold hover:bg-black/60 transition-all border border-white/30 hover:border-white/60 text-center"
          >
            Join the Waitlist
          </Link>
        </div>
      </div>


    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function PetsPage() {
  const [pets, setPets]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [genderFilter, setGenderFilter] = useState("All");

  useEffect(() => {
    const fetchPets = async () => {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("status", "AVAILABLE")
        .order("created_at", { ascending: false });
      if (data) setPets(data);
      if (error) console.error("Error loading pets:", error.message);
      setLoading(false);
    };
    fetchPets();
  }, []);

  const displayPets  = pets.length > 0 ? pets : SHOWCASE_BULLDOGS;
  const filteredPets = genderFilter === "All"
    ? displayPets
    : displayPets.filter((p) => p.gender === genderFilter);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-8 md:px-16 py-5 flex justify-between items-center border-b border-gray-100 shadow-sm">
        <Link href="/" className="text-2xl font-playfair font-bold tracking-widest text-[#3d4b43]">
          HEIRLOOM PETS
        </Link>
        <nav className="hidden md:flex space-x-10 text-sm font-semibold text-gray-500 uppercase tracking-wider">
          <Link href="/pets" className="text-[#4a6659] border-b-2 border-[#4a6659] pb-1">Our Bulldogs</Link>
          <Link href="/about" className="hover:text-[#4a6659] transition-colors pb-1">About</Link>
          <Link href="/philosophy" className="hover:text-[#4a6659] transition-colors pb-1">Philosophy</Link>
          <Link href="/contact" className="hover:text-[#4a6659] transition-colors pb-1">Contact</Link>
        </nav>
      </header>

      {/* ── HERO SLIDESHOW ── */}
      <HeroSlideshow />

      {/* ── STATS BAR ── */}
      <div className="bg-[#2a3630] py-6 px-8 md:px-16 flex flex-wrap justify-center gap-10 md:gap-16">
        {[
          { label: "Years of Breeding", value: "30+" },
          { label: "Puppies Placed",    value: "500+" },
          { label: "Champion Lines",    value: "12" },
          { label: "Health Guarantee",  value: "2 Yrs" },
        ].map((stat) => (
          <div key={stat.label} className="text-center text-white min-w-[120px]">
            <p className="text-2xl md:text-3xl font-playfair font-bold text-[#a8c5b8]">{stat.value}</p>
            <p className="text-[10px] md:text-xs text-white/70 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-white py-12 px-8 md:px-16 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "🏆", title: "Champion Bloodlines", desc: "Every puppy comes from AKC-registered parents with verified pedigree." },
            { icon: "🩺", title: "Health Certified",    desc: "Full vet check, vaccinations, and genetic clearances before leaving." },
            { icon: "✈️", title: "Nationwide Delivery", desc: "Safe flight-nanny delivery to any major airport in the US." },
            { icon: "📞", title: "Lifetime Support",    desc: "We are always here to help with advice, nutrition, and care." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-playfair font-semibold text-[#1f2937] mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div id="bulldogs" className="bg-[#fafafa] border-b border-gray-100 px-8 md:px-16 py-5 flex flex-wrap items-center gap-4 sticky top-[74px] z-30">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Filter:</span>
        {["All", "Male", "Female"].map((g) => (
          <button
            key={g}
            onClick={() => setGenderFilter(g)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
              genderFilter === g
                ? "bg-[#4a6659] text-white shadow-md scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {g === "All" ? "🐾 All Bulldogs" : g === "Male" ? "♂ Males" : "♀ Females"}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400 font-medium">
          {loading ? "Loading..." : `${filteredPets.length} companion${filteredPets.length !== 1 ? "s" : ""} available`}
        </span>
      </div>

      {/* ── PET GRID ── */}
      <main className="flex-1 px-8 md:px-16 py-16 max-w-[1400px] mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#1f2937] mb-4">Available Companions</h2>
          <p className="text-gray-500 font-light max-w-xl mx-auto text-lg">
            Each puppy below is health-certified, lovingly raised, and ready to join your family.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#4a6659] border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {filteredPets.map((pet) => (
              <Link
                href={pet.isShowcase ? "/contact" : `/pet/${pet.id}`}
                key={pet.id}
                className="group shrink-0 w-[85vw] sm:w-[420px] snap-center flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
              >
                <div className="relative w-full h-[420px] overflow-hidden bg-gray-100">
                  {pet.image ? (
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      unoptimized={pet.image.includes("supabase.co") || pet.image.includes("unsplash")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <svg className="w-20 h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${pet.gender === "Male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
                      {pet.gender === "Male" ? "♂ Male" : "♀ Female"}
                    </span>
                    {pet.isShowcase && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md bg-amber-100 text-amber-700">Sample</span>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-3xl font-playfair font-bold text-white drop-shadow">{pet.name}</h3>
                        <p className="text-white/75 text-sm mt-1">English Bulldog · {pet.age}</p>
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-2.5 text-right shadow-xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Price</p>
                        <p className="text-xl font-playfair font-bold text-[#4a6659]">${parseFloat(pet.price).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 flex items-center justify-between bg-white">
                  <div>
                    <p className="text-sm text-gray-700 font-semibold">{pet.lineage || "Premium Lineage"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">AKC Registered · Health Certified</p>
                  </div>
                  <div className={`flex items-center gap-2 font-bold text-sm transition-all group-hover:gap-3 ${pet.isShowcase ? "text-amber-600" : "text-[#4a6659]"}`}>
                    <span>{pet.isShowcase ? "Inquire" : `Meet ${pet.name}`}</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#f3f4f6] text-[#1f2937] py-24 overflow-hidden border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto text-center mb-16 px-8 md:px-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Happy Families</h2>
          <p className="text-gray-500 font-light text-lg">What our customers say about their Heirloom Bulldogs</p>
        </div>
        
        {/* Continuous Marquee Reviews */}
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex gap-6 whitespace-nowrap hover:[animation-play-state:paused] active:[animation-play-state:paused] px-3">
            {[...REVIEWS, ...REVIEWS].map((t, idx) => (
              <div 
                key={`${t.id}-${idx}`} 
                className="shrink-0 w-[85vw] sm:w-[450px] bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col whitespace-normal cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-xl tracking-wider shadow-sm">
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0f172a] text-lg tracking-tight">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.location}</p>
                    </div>
                  </div>
                  <img src={t.flagUrl} alt="country flag" className="w-8 h-auto object-contain rounded-sm shadow-sm opacity-90" />
                </div>

                <div className="flex gap-1.5 mb-5">
                  {Array.from({length:5}).map((_,i) => (
                    <svg key={i} className="w-5 h-5 text-[#f97316] fill-current drop-shadow-sm" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>

                <p className="text-gray-600 font-light leading-relaxed text-[15px] italic">
                  "{t.quote}"
                </p>
                
              </div>
            ))}
          </div>
        </div>
        
        {/* CSS for marquee animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 120s linear infinite;
          }
        `}} />
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-[#4a6659] py-20 px-8 text-center">
        <span className="text-xs font-bold tracking-[0.3em] text-white/60 uppercase block mb-4">Ready to Find Your Companion?</span>
        <h3 className="text-4xl font-playfair font-bold text-white mb-5">Your Perfect Bulldog is Waiting</h3>
        <p className="text-white/75 font-light mb-10 max-w-lg mx-auto text-lg">
          Can't find the one? Join our waitlist and we'll notify you the moment a new English Bulldog puppy becomes available.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/contact" className="px-10 py-4 bg-white text-[#4a6659] rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl">
            Contact Our Concierge
          </Link>
          <Link href="/about" className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-colors">
            Learn About Us
          </Link>
        </div>
      </section>
    </div>
  );
}
