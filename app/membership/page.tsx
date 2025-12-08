import Link from "next/link";
import Image from "next/image";

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[#202020] text-white overflow-x-hidden">
      {/* Header Navigation - Same as other pages */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[100px]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/0 backdrop-blur-[6px]" />

        <div className="relative h-full flex items-center justify-between px-[42px]">
          {/* Left side - Menu and Navigation */}
          <div className="flex items-end gap-[21px]">
            {/* Menu Icon */}
            <div className="w-[42px] h-[42px] relative">
              <div className="w-[42px] h-[42px] rounded-full border border-white" />
              <div className="absolute left-[18px] top-[8.5px] flex flex-col gap-[2.43px]">
                <div className="w-[6.38px] h-[6.38px] bg-white rounded-full" />
                <div className="w-[6.38px] h-[6.38px] bg-white rounded-full" />
                <div className="w-[6.38px] h-[6.38px] bg-white rounded-full" />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-6 p-2.5">
              <Link
                href="/membership"
                className="text-white text-xl font-normal font-['Roboto']"
              >
                Membership
              </Link>
              <Link
                href="/facility"
                className="text-white text-xl font-normal font-['Roboto']"
              >
                Facilities
              </Link>
              <Link
                href="/"
                className="text-white text-xl font-normal font-['Roboto']"
              >
                Cricket Nest
              </Link>
            </nav>
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 top-[38px] -translate-x-1/2">
            <Image
              src="/assets/542-28725.svg"
              alt="VRA"
              width={114}
              height={40}
              className="w-[114.24px] h-10"
            />
          </div>

          {/* Right side - Language selector and Login */}
          <div className="flex items-center gap-6 p-2.5">
            {/* Sun/Moon Icon */}
            <div className="w-[41px] h-[41px] relative">
              <Image
                src="/assets/I542-20948;45-164.svg"
                alt=""
                width={41}
                height={41}
                className="w-full h-full"
              />
            </div>

            {/* Language Selector */}
            <div className="w-[49px] h-[22px] relative">
              <div className="absolute left-[0.5px] top-[4px] text-white text-xl font-normal font-['Helvetica']">
                NL
              </div>
              <Image
                src="/assets/I542-20949;45-50.svg"
                alt=""
                width={1}
                height={14}
                className="absolute left-[29.5px] top-[4px] w-px h-3.5 rotate-90 rounded-[10px]"
              />
              <div className="absolute left-[32.5px] top-[6.5px] text-white/50 text-xs font-normal font-['Helvetica']">
                EN
              </div>
            </div>

            {/* Login Button */}
            <button className="px-6 py-3 bg-gradient-to-b from-[#141414] to-black rounded-lg border border-white/10 flex items-center justify-center gap-2.5">
              <span className="text-white text-xl font-normal font-['Roboto']">
                Login
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[100px]">
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

          {/* WhatsApp Button */}
          <div className="absolute right-[32px] bottom-[32px] w-[68px] h-[68px]">
            <div className="w-full h-full bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_#73FF44_0%,_#69D346_100%)] rounded-full backdrop-blur-[43.4px]" />
            <Image
              src="/assets/542-28735.svg"
              alt="WhatsApp"
              width={32}
              height={32}
              className="absolute left-[18px] top-[18px] w-8 h-8"
            />
          </div>
        </section>

        {/* Sections Container */}
        <div className="w-full max-w-[1280px] mx-auto px-8 flex flex-col gap-[120px] py-[120px]">
          {/* World-Class Facilities Section */}
          <section className="grid grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-white text-4xl font-normal ">
                World-Class Facilities
              </h2>
              <p className="text-[#99a1ae] text-base font-normal ">
                Our state-of-the-art cricket facilities are designed to help
                players of all levels improve their game. From
                professional-grade pitches to modern training equipment, we
                provide everything you need to excel.
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20065.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Professional cricket grounds
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20070.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Modern changing rooms
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20075.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Equipment storage
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20080.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Spectator seating areas
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-[14px] shadow-[0px_22px_45px_-11px_rgba(0,0,0,0.25)] overflow-hidden">
              <Image
                src="/assets/542-20085.webp"
                alt="Cricket Facilities"
                width={640}
                height={450}
                className="w-full h-[450px] object-cover"
              />
            </div>
          </section>

          {/* Premium Cricket Grounds Section */}
          <section className="w-full -mx-8 px-8 py-16 bg-[#282828] grid grid-cols-2 gap-12 items-center">
            <div className="rounded-[14px] shadow-[0px_22px_45px_-11px_rgba(0,0,0,0.25)] overflow-hidden">
              <Image
                src="/assets/542-20114.webp"
                alt="Cricket Ground"
                width={640}
                height={594}
                className="w-full h-[594px] object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-white text-4xl font-normal ">
                Premium Cricket Grounds
              </h2>
              <p className="text-[#99a1ae] text-base font-normal ">
                Play on meticulously maintained cricket pitches that meet
                international standards. Our grounds are prepared by experienced
                groundskeepers who ensure optimal playing conditions throughout
                the season.
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20094.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Multiple practice nets
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20099.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Match-quality pitches
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20104.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Floodlit facilities
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20109.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Year-round availability
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Professional Cricket Training Section */}
          <section className="grid grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-white text-4xl font-normal ">
                Professional Cricket Training
              </h2>
              <p className="text-[#99a1ae] text-base font-normal ">
                Learn from certified coaches with years of professional
                experience. Our training programs are tailored to your skill
                level, whether you&apos;re a beginner or an advanced player
                looking to refine your technique.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="rounded-xl border border-white/10 p-6 flex flex-col items-center gap-4">
                  <Image
                    src="/assets/542-20123.svg"
                    alt="Coaches"
                    width={64}
                    height={64}
                    className="w-16 h-16"
                  />
                  <div className="text-center">
                    <div className="text-white text-[21.59px] font-normal ">
                      15+
                    </div>
                    <div className="text-[#99a1ae] text-xs font-normal ">
                      Expert Coaches
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 p-6 flex flex-col items-center gap-4">
                  <Image
                    src="/assets/542-20847.svg"
                    alt="Members"
                    width={69}
                    height={69}
                    className="w-[69px] h-[69px]"
                  />
                  <div className="text-center">
                    <div className="text-white text-[21.59px] font-normal ">
                      500+
                    </div>
                    <div className="text-[#99a1ae] text-xs font-normal ">
                      Active Members
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[14px] overflow-hidden">
              <Image
                src="/assets/542-20145.webp"
                alt="Cricket Training"
                width={640}
                height={574}
                className="w-full h-[574px] object-cover"
              />
            </div>
          </section>

          {/* Indoor Cricket Nets Section */}
          <section className="w-full -mx-8 px-8 py-16 bg-[#282828] grid grid-cols-2 gap-12 items-center">
            <div className="rounded-[14px] shadow-[0px_22px_45px_-11px_rgba(0,0,0,0.25)] overflow-hidden bg-gray-100">
              <div className="w-full h-[450px] flex items-center justify-center">
                <div className="text-gray-400 text-sm">Indoor Nets Image</div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-white text-4xl font-normal ">
                Indoor Cricket Nets
              </h2>
              <p className="text-[#99a1ae] text-base font-normal ">
                Train year-round regardless of weather conditions. Our indoor
                cricket nets feature advanced bowling machines, video analysis
                systems, and climate-controlled environments for optimal
                practice sessions.
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20154.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    All-weather training
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20159.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Bowling machines
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20164.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Video analysis
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20169.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Private coaching available
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Modern Clubhouse Section */}
          <section className="grid grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-white text-4xl font-normal ">
                Modern Clubhouse
              </h2>
              <p className="text-[#99a1ae] text-base font-normal ">
                Relax and socialize in our contemporary clubhouse facilities.
                Equipped with a bar, restaurant, lounge areas, and function
                rooms, it&apos;s the perfect place to unwind after a match or
                training session.
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20183.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Full-service bar & restaurant
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20188.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Member lounge area
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20193.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Event & function rooms
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/assets/542-20198.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-[#d0d5db] text-sm font-normal ">
                    Pro shop on-site
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-[14px] shadow-[0px_22px_45px_-11px_rgba(0,0,0,0.25)] overflow-hidden">
              <Image
                src="/assets/542-20203.webp"
                alt="Clubhouse"
                width={640}
                height={450}
                className="w-full h-[450px] object-cover"
              />
            </div>
          </section>

          {/* Membership Options Section */}
          <section className="w-full -mx-8 px-16 py-16 bg-[#282828]">
            <div className="text-center mb-16">
              <h2 className="text-white text-sm font-normal  mb-4">
                Membership Options
              </h2>
              <p className="text-[#99a1ae] text-base font-normal ">
                Choose the membership that fits your cricket journey
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {/* Junior Member Card */}
              <div className="bg-[#36393f] rounded-xl border-2 border-[#2b7fff]/50 p-8 flex flex-col gap-8">
                <div className="text-center">
                  <div className="text-[43px] mb-4">🏏</div>
                  <h3 className="text-white text-sm font-normal  mb-2">
                    Junior Member
                  </h3>
                  <p className="text-[#99a1ae] text-xs font-normal ">
                    Under 18 years
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-white text-[43px] font-normal ">
                    €150
                  </div>
                  <div className="text-[#99a1ae] text-xs font-normal ">
                    /year
                  </div>
                </div>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20227.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Access to all facilities
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20232.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Youth coaching programs
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20237.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Weekend match participation
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20242.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Equipment discounts
                    </span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-gradient-to-b from-[#155dfc] to-[#0c3796] rounded-lg text-white text-sm font-medium  hover:opacity-90 transition-opacity">
                  Join Now
                </button>
              </div>

              {/* Senior Member Card */}
              <div className="bg-[#36393f] rounded-xl border-2 border-[#2b7fff]/50 p-8 flex flex-col gap-8">
                <div className="text-center">
                  <div className="text-[43px] mb-4">🏆</div>
                  <h3 className="text-white text-sm font-normal  mb-2">
                    Senior Member
                  </h3>
                  <p className="text-[#99a1ae] text-xs font-normal ">
                    18+ years
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-white text-[43px] font-normal ">
                    €300
                  </div>
                  <div className="text-[#99a1ae] text-xs font-normal ">
                    /year
                  </div>
                </div>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20265.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Full facility access
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20270.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      League match participation
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20275.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Coaching sessions
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20280.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Clubhouse benefits
                    </span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-gradient-to-b from-[#155dfc] to-[#0c3796] rounded-lg text-white text-sm font-medium  hover:opacity-90 transition-opacity">
                  Join Now
                </button>
              </div>

              {/* Premium Member Card */}
              <div className="bg-[#36393f] rounded-xl border-2 border-[#2b7fff]/50 p-8 flex flex-col gap-8">
                <div className="text-center">
                  <div className="text-[43px] mb-4">⭐</div>
                  <h3 className="text-white text-sm font-normal  mb-2">
                    Premium Member
                  </h3>
                  <p className="text-[#99a1ae] text-xs font-normal ">
                    All ages
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-white text-[43px] font-normal ">
                    €500
                  </div>
                  <div className="text-[#99a1ae] text-xs font-normal ">
                    /year
                  </div>
                </div>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20301.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      VIP facility access
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20306.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Priority booking
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20311.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Personal coaching
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/assets/542-20316.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-[#d0d5db] text-xs font-normal ">
                      Exclusive events
                    </span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-gradient-to-b from-[#155dfc] to-[#0c3796] rounded-lg text-white text-sm font-medium  hover:opacity-90 transition-opacity">
                  Join Now
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer - Reuse from other pages */}
        <footer className="w-full bg-white py-12">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="grid grid-cols-[200px_1fr_1fr] gap-12 mb-12">
              {/* Logo */}
              <div>
                <Image
                  src="/assets/542-20863.svg"
                  alt="VRA Cricket Amsterdam"
                  width={160}
                  height={60}
                  className="w-[160px]"
                />
              </div>

              {/* Quick Links and Resources */}
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <h3 className="text-black text-sm font-bold  mb-2">
                    Quick Links
                  </h3>
                  <Link
                    href="/about"
                    className="text-black/70 text-sm font-normal  hover:text-black transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="text-black/70 text-sm font-normal  hover:text-black transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/"
                    className="text-black/70 text-sm font-normal  hover:text-black transition-colors"
                  >
                    Support
                  </Link>
                  <Link
                    href="/"
                    className="text-black/70 text-sm font-normal  hover:text-black transition-colors"
                  >
                    Blog
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-black text-sm font-bold  mb-2">
                    Resources
                  </h3>
                  <Link
                    href="/"
                    className="text-black/70 text-sm font-normal  hover:text-black transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/"
                    className="text-black/70 text-sm font-normal  hover:text-black transition-colors"
                  >
                    Documentation
                  </Link>
                  <Link
                    href="/"
                    className="text-black/70 text-sm font-normal  hover:text-black transition-colors"
                  >
                    Case Studies
                  </Link>
                  <Link
                    href="/"
                    className="text-black/70 text-sm font-normal  hover:text-black transition-colors"
                  >
                    Webinars
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div className="flex flex-col gap-4">
                <h3 className="text-black text-lg font-medium ">
                  We&apos;d love to hear from you, let&apos;s have a
                  conversation about what we do and how we can help you
                </h3>
                <p className="text-black/60 text-sm font-normal ">
                  Join our newsletter for the latest updates and insights.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email here"
                    className="flex-1 px-4 py-3 bg-white border border-black/20 rounded-lg text-black placeholder:text-black/40 focus:outline-none focus:border-black/50 transition-colors"
                  />
                  <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors">
                    Subscribe
                  </button>
                </div>
                <p className="text-black/40 text-xs font-normal ">
                  By subscribing, you agree to our Privacy Policy and receive
                  updates.
                </p>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="flex flex-col items-center gap-6 py-8 bg-gradient-to-r from-[#E31E24] via-[#FFD100] to-[#003DA5] rounded-lg -mx-8 px-8">
              <h3 className="text-white text-xl font-medium ">
                Follow Us on
              </h3>
              <div className="flex gap-6">
                <Link
                  href="#"
                  className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/assets/542-20873.svg"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/assets/542-20956.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
