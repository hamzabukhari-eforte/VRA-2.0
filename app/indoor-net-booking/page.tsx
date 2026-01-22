import HeroBanner from "@/components/about/HeroBanner";
import BookingSummary from "@/components/net-booking/BookingSummary";
import NetBookingForm from "@/components/net-booking/NetBookingForm";
import CollaborationSection from "@/components/shared/CollaborationSection";
import Container from "@/components/Container";

export default function IndoorNetBookingPage() {
  return (
    <div className="min-h-screen dark:bg-[#202020] bg-background text-foreground dark:text-white overflow-x-hidden">
      {/* Hero Section */}
      <HeroBanner
        imageSrc="/assets/facility/Indoor Nets.jpg"
        imageAlt="Indoor Net Booking"
        heading="Indoor Net Booking"
        overlayOpacity={40}
        showWhatsApp={false}
      />

      {/* Main Content */}
      <Container className="flex flex-col items-start gap-12 md:gap-16 lg:gap-[80px] pt-12 md:pt-16 lg:pt-[79px] px-4 md:px-6 lg:px-8 pb-12 md:pb-16 lg:pb-20">
        {/* Booking Form Section */}
        <section className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-stretch">
            {/* Left Side - Booking Summary */}
            <BookingSummary
              date="09-09-2025"
              duration="Duration"
              price={20}
              priceUnit="€/hr"
              laneImageSrc="/assets/net-booking/net-booking-svg.png"
              laneImageAlt="Cricket Lane"
            />

            {/* Right Side - Booking Form */}
            <NetBookingForm totalLanes={3} />
          </div>
        </section>

        <CollaborationSection />
      </Container>
    </div>
  );
}
