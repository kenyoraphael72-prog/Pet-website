import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-[1000px] mx-auto w-full px-8 py-24">
        <h1 className="text-5xl md:text-6xl font-playfair font-semibold text-[#1f2937] mb-8">
          A Legacy of <span className="text-[#4a6659] italic">Love & Heritage</span>.
        </h1>
        
        <div className="relative w-full h-[400px] rounded-[2rem] overflow-hidden shadow-2xl mb-16">
          <Image 
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop" 
            alt="English Bulldog companion" 
            fill 
            className="object-cover object-top"
          />
        </div>

        <div className="space-y-8 text-lg text-gray-600 font-light leading-relaxed">
          <p>
            For over two decades, Heirloom Pets has stood at the pinnacle of luxury English Bulldog breeding. Our journey began with a simple yet profound belief: that the bond between human and bulldog is one of life's greatest privileges, and it deserves to be nurtured from the very first breath.
          </p>
          <p>
            We are not just breeders; we are architects of family legacies. Every English Bulldog puppy born under our roof is welcomed into a world of warmth, meticulous care, and unconditional love. Our state-of-the-art facilities are designed not as kennels, but as extensions of our own home.
          </p>
          <p>
            When you welcome an Heirloom Bulldog into your life, you are not simply acquiring a dog. You are embracing a masterfully bred companion with an impeccable lineage, guaranteed health, and the signature calm, loving temperament that only a purebred English Bulldog can offer.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/pets" className="px-10 py-4 bg-[#4a6659] text-white rounded-full font-medium hover:bg-[#3d4b43] transition-colors shadow-lg">
            Meet Our Companions
          </Link>
        </div>
      </main>
    </div>
  );
}
