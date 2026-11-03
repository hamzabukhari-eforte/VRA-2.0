import HeroBanner from "@/components/about/HeroBanner";
import IndoorNetBookingSection from "@/components/net-booking/IndoorNetBookingSection";
import CollaborationSection from "@/components/shared/CollaborationSection";
import Container from "@/components/Container";

export default function IndoorNetBookingPage() {
  return (
    <div className="min-h-screen dark:bg-[#202020] bg-background text-foreground dark:text-white">
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
        <section className="w-full">
          <IndoorNetBookingSection />
        </section>

        <CollaborationSection />
      </Container>
    </div>
  );
}
