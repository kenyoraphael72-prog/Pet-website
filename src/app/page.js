import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[90vh] min-h-[700px] flex flex-col bg-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero_puppy.png" 
            alt="White Samoyed Puppy" 
            fill 
            className="object-cover object-[center_20%] md:object-right"
            priority
          />
          {/* Gradient Overlay to ensure text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-[70%]" />
        </div>

        {/* Header (Overlaid) */}
        <header className="relative z-50 w-full px-8 md:px-16 py-6 flex justify-between items-center">
          <div className="text-2xl md:text-3xl font-playfair font-semibold tracking-wider text-[#3d4b43]">
            HEIRLOOM PETS
          </div>
          <nav className="hidden md:flex space-x-10 text-sm font-medium text-gray-600">
            <Link href="/pets" className="hover:text-[#4a6659] transition-colors pb-1">Available Pets</Link>
            <Link href="/about" className="hover:text-[#4a6659] transition-colors pb-1">About</Link>
            <Link href="/philosophy" className="hover:text-[#4a6659] transition-colors pb-1">Philosophy</Link>
            <Link href="/contact" className="hover:text-[#4a6659] transition-colors pb-1">Contact</Link>
          </nav>
          <div className="flex space-x-6 text-gray-600">
            <button aria-label="Cart" className="hover:text-[#4a6659] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </button>
            <button aria-label="Account" className="hover:text-[#4a6659] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center px-8 md:px-16 max-w-7xl mx-auto w-full">
          <div className="max-w-xl">
            <h1 className="text-[3.5rem] md:text-[4.5rem] leading-[1.1] font-playfair text-[#1f2937] mb-6">
              The Genesis of Your <br/>
              <span className="italic text-[#4a6659]">Greatest Companion.</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl font-light mb-10 max-w-md leading-relaxed">
              Discover an elite lineage of hand-reared companions, bred for temperament and uncompromising health standards.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="/pets" className="w-full sm:w-auto px-8 py-4 bg-[#4a6659] text-white rounded-full font-medium hover:bg-[#3d4b43] transition-colors shadow-lg">
                Explore Available Pets
              </Link>
              <Link href="/philosophy" className="font-medium text-[#1f2937] hover:text-[#4a6659] transition-colors flex items-center gap-2 group">
                Our Breeding Philosophy
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY SECTION */}
      <section className="py-24 px-8 md:px-16 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16 md:gap-24">
        
        {/* Left: Image with Badge */}
        <div className="flex-1 w-full relative">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
            <Image 
              src="/pet3.png" 
              alt="French Bulldog" 
              fill 
              className="object-cover"
            />
          </div>
          {/* Overlay Badge */}
          <div className="absolute -bottom-8 md:-bottom-12 -right-4 md:-right-12 bg-[#4a6659] text-white p-6 md:p-8 rounded-2xl shadow-xl border-4 border-[#fafafa] z-10">
            <h4 className="font-playfair italic text-2xl mb-1">Pure Heritage</h4>
            <p className="text-sm text-white/80 font-medium">Hand-reared since 1994</p>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 w-full lg:pl-10 mt-16 lg:mt-0">
          <span className="text-xs font-bold tracking-widest text-[#4a6659] uppercase mb-4 block">Our Philosophy</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-[#1f2937] leading-tight mb-12">
            Beyond Breeding:<br/>A Legacy of Love.
          </h2>

          <div className="space-y-10">
            {/* Item 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-playfair font-semibold text-lg text-[#1f2937] mb-2">Temperament First</h3>
                <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed">
                  Each companion is raised in a home environment, ensuring they are socially adjusted and emotionally resilient from day one.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <div>
                <h3 className="font-playfair font-semibold text-lg text-[#1f2937] mb-2">Elite Health Standards</h3>
                <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed">
                  Comprehensive genetic testing and pediatric vet care guarantee that your new family member begins life with the best possible health.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-playfair font-semibold text-lg text-[#1f2937] mb-2">Heritage Lineage</h3>
                <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed">
                  We maintain meticulous records of lineage, selecting only for characteristics that embody the finest aspects of each rare breed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED COLLECTIONS */}
      <section className="py-24 px-8 md:px-16 bg-[#f4f6f8]">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-[#1f2937] mb-4">Curated Collections</h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              Select from our most prestigious lineages, each unique in character and beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
            {/* Left Large Card */}
            <Link href="/pets?collection=new" className="lg:col-span-8 relative rounded-3xl overflow-hidden group cursor-pointer h-[400px] lg:h-full">
              <Image 
                src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1200&auto=format&fit=crop" 
                alt="New Arrivals" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="bg-white/90 text-[#4a6659] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full w-max mb-4">
                  Seasonal Feature
                </span>
                <h3 className="text-4xl font-playfair font-medium text-white mb-2">New Arrivals</h3>
                <p className="text-white/80 font-light mb-6 max-w-md">Our latest nurtured companions ready for their forever homes.</p>
                <span className="bg-white text-[#1f2937] px-6 py-2.5 rounded-full font-medium text-sm w-max hover:bg-gray-100 transition-colors">
                  View All
                </span>
              </div>
            </Link>

            {/* Right Stacked Cards */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-full">
              {/* Top Card */}
              <Link href="/pets?collection=rare" className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px]">
                <Image 
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop" 
                  alt="Rare Lineages" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-playfair font-medium text-white mb-2">Rare Lineages</h3>
                  <p className="text-white/80 text-sm font-light flex items-center gap-2 group-hover:text-white transition-colors">
                    Explore <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </p>
                </div>
              </Link>
              
              {/* Bottom Card */}
              <Link href="/pets?collection=favorites" className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px]">
                <Image 
                  src="https://images.unsplash.com/photo-1546975490-a889fa6e5eb6?q=80&w=800&auto=format&fit=crop" 
                  alt="Companion Favorites" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-playfair font-medium text-white mb-2">Companion Favorites</h3>
                  <p className="text-white/80 text-sm font-light flex items-center gap-2 group-hover:text-white transition-colors">
                    Explore <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONCIERGE SECTION */}
      <section className="py-24 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto w-full bg-[#5b7c6c] rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl">
          
          {/* Watermark Icon */}
          <svg className="absolute -right-20 -top-20 w-96 h-96 text-white/5 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>

          <div className="relative z-10 max-w-2xl text-white">
            <span className="text-xs font-bold tracking-widest text-white/80 uppercase mb-6 block">Heirloom Concierge</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-semibold mb-12 leading-tight">
              White-Glove Service from <br/>Our Home to Yours.
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
              <div>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                </div>
                <h4 className="font-playfair font-medium text-lg mb-2">Private Transport</h4>
                <p className="text-white/70 font-light text-sm leading-relaxed">Climate-controlled, supervised transit ensures your companion arrives calm and comfortable.</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h4 className="font-playfair font-medium text-lg mb-2">Lifetime Support</h4>
                <p className="text-white/70 font-light text-sm leading-relaxed">Access our experts 24/7 for training advice, nutritional guidance, and health support.</p>
              </div>
            </div>

            <Link href="/concierge" className="inline-block px-8 py-4 bg-white text-[#4a6659] rounded-full font-medium hover:bg-gray-50 transition-colors shadow-lg">
              Learn about Concierge
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
