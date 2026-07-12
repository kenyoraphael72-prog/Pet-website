import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-8 md:px-16 py-6 flex justify-between items-center border-b border-gray-100">
        <Link href="/" className="text-2xl md:text-3xl font-playfair font-semibold tracking-wider text-[#3d4b43]">
          HEIRLOOM PETS
        </Link>
        <nav className="hidden md:flex space-x-10 text-sm font-medium text-gray-600">
          <Link href="/pets" className="hover:text-[#4a6659] transition-colors pb-1">Available Pets</Link>
          <Link href="/about" className="hover:text-[#4a6659] transition-colors pb-1">About</Link>
          <Link href="/philosophy" className="hover:text-[#4a6659] transition-colors pb-1">Philosophy</Link>
          <Link href="/contact" className="text-[#4a6659] border-b-2 border-[#4a6659] pb-1">Contact</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-24 flex flex-col md:flex-row gap-16">
        
        {/* Left: Contact Info */}
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-playfair font-semibold text-[#1f2937] mb-6">
            Begin Your <br/> <span className="text-[#4a6659] italic">Journey.</span>
          </h1>
          <p className="text-lg text-gray-500 font-light mb-12 max-w-md leading-relaxed">
            Whether you are inquiring about a specific lineage or wish to learn more about our concierge transport, our team is at your service.
          </p>

          <div className="space-y-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Direct Concierge</h4>
              <p className="text-xl text-[#1f2937] font-medium">+1 (800) 555-0198</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Inquiries</h4>
              <p className="text-xl text-[#1f2937] font-medium">concierge@heirloompets.com</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Estate Location</h4>
              <p className="text-xl text-[#1f2937] font-medium">Private Estate, Beverly Hills, CA<br/><span className="text-sm text-gray-500 font-light">(By Appointment Only)</span></p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="flex-1 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-2xl font-playfair font-medium text-[#1f2937] mb-8">Send an Inquiry</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#4a6659] transition-colors bg-transparent" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#4a6659] transition-colors bg-transparent" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#4a6659] transition-colors bg-transparent" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area of Interest</label>
              <select className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#4a6659] transition-colors bg-transparent text-gray-600">
                <option>Purchasing a Puppy</option>
                <option>Concierge Delivery</option>
                <option>Breeding Standards</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea rows="4" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#4a6659] transition-colors bg-transparent resize-none" placeholder="How can we assist you?"></textarea>
            </div>
            <button type="button" className="w-full py-4 bg-[#1f2937] text-white rounded-xl font-medium hover:bg-[#3d4b43] transition-colors shadow-lg mt-4">
              Send Message
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
