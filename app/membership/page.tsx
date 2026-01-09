import Image from "next/image";

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[#202020] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[900px]">
        {/* Background Image */}
        <Image
          src="/assets/542-20000.webp"
          alt="Cricket Field"
          width={1920}
          height={900}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#202020]" />

        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-7xl font-normal  mb-6">
              VRA Cricket Club
            </h1>
            <p className="text-gray-200 text-2xl font-normal  mb-10">
              Join our community of passionate cricketers
            </p>
            <button className="px-6 py-3 bg-gradient-to-b from-[#155dfc] to-[#0c3796] rounded-[40px] inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-white text-lg font-medium ">
                Become a Member
              </span>
              <Image
                src="/assets/542-20010.svg"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
