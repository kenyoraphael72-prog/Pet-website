import Link from "next/link";

export default function ConciergePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-8 md:px-16 py-6 flex justify-between items-center border-b border-gray-100">
        <Link href="/" className="text-2xl md:text-3xl font-playfair font-semibold tracking-wider text-[#3d4b43]">
          HEIRLOOM PETS
        </Link>
        <nav className="hidden md:flex space-x-10 text-sm font-medium text-gray-600">
          <Link href="/pets" className="hover:text-[#4a6659] transition-colors pb-1">Available Pets</Link>
          <Link href="/about" className="hover:text-[#4a6659] transition-colors pb-1">About</Link>
          <Link href="/contact" className="hover:text-[#4a6659] transition-colors pb-1">Contact</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-8 max-w-3xl mx-auto py-24">
        <span className="text-xs font-bold tracking-widest text-[#4a6659] uppercase mb-4 block">Heirloom Concierge</span>
        <h1 className="text-5xl md:text-6xl font-playfair font-semibold text-[#1f2937] mb-8 leading-tight">
          White-Glove Service from <br/><span className="italic text-[#4a6659]">Our Home to Yours.</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl font-light mb-12 leading-relaxed">
          From private climate-controlled transport to lifetime expert support, our concierge team handles every detail so you can focus entirely on welcoming your new companion.
        </p>
        <Link href="/contact" className="px-10 py-4 bg-[#4a6659] text-white rounded-full font-medium hover:bg-[#3d4b43] transition-colors shadow-lg">
          Contact Concierge
        </Link>
      </main>
    </div>
  );
}
