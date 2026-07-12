import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";

export default function PhilosophyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-24">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-[#4a6659] uppercase mb-4 block">Our Guiding Light</span>
          <h1 className="text-5xl md:text-6xl font-playfair font-semibold text-[#1f2937] leading-tight mb-6">
            The Heirloom Bulldog Standard
          </h1>
          <p className="text-lg text-gray-500 font-light">
            We believe that breeding English Bulldogs is an art form that requires scientific precision, ethical devotion, and an uncompromising commitment to the animal's welfare.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-xl">
            <Image 
              src="https://images.unsplash.com/photo-1546975490-a889fa6e5eb6?q=80&w=1200&auto=format&fit=crop" 
              alt="English Bulldog sleeping" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 mb-8">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <h2 className="text-3xl font-playfair font-semibold text-[#1f2937]">Ethical Origins</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Every bulldog lineage we nurture is carefully selected to eliminate hereditary diseases specific to the breed, such as respiratory issues or joint dysplasia. We strictly adhere to limits on litter frequency, prioritizing the health and recovery of our mothers above all else. Our facilities surpass all regulatory standards, providing a sanctuary of comfort and stimulation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 mb-8">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <h2 className="text-3xl font-playfair font-semibold text-[#1f2937]">Neurological Stimulation</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              From day three to sixteen, our bulldog puppies undergo Early Neurological Stimulation (ENS). This specialized handling improves cardiovascular performance, strengthens heart beats, creates stronger adrenal glands, builds tolerance to stress, and offers greater resistance to disease.
            </p>
          </div>
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-xl order-1 md:order-2">
            <Image 
              src="https://images.unsplash.com/photo-1558929996-da64ba858215?q=80&w=1200&auto=format&fit=crop" 
              alt="English Bulldog face" 
              fill 
              className="object-cover"
            />
          </div>
        </div>

      </main>
    </div>
  );
}
