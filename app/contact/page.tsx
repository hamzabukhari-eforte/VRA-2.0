import HeroBanner from "@/components/about/HeroBanner";
import FacilitySquareCarousel from "@/components/facility/FacilitySquareCarousel";
import ContactForm from "@/components/contact/ContactForm";
import FAQSection from "@/components/contact/FAQSection";

export default function ContactPage() {
  const faqItems = [
    {
      question: "What is the Question?",
      answer: "Here is the answer.......",
    },
    {
      question: "What is the Question?",
      answer: "Here is the answer.......",
    },
    {
      question: "What is the Question?",
      answer: "Here is the answer.......",
    },
  ];

  return (
    <div className="min-h-screen dark:bg-[#202020] bg-background text-foreground dark:text-white overflow-x-hidden">
      {/* Hero Section */}
      <HeroBanner
        imageSrc="/assets/350-3209.webp"
        imageAlt="Cricket Field"
        heading="Get In Touch"
        overlayOpacity={40}
        showWhatsApp={false}
      />

      {/* Main Content */}
      <main className="w-full max-w-[1280px] mx-auto flex flex-col items-start gap-[80px] pt-[79px] px-8 pb-20">
        <ContactForm />

        <FAQSection items={faqItems} />

        {/* Our Facility Section */}
        <FacilitySquareCarousel
          heading="Our Facility"
          images={[
            {
              src: "/assets/350-3321.webp",
              alt: "Facility 1",
            },
            {
              src: "/assets/350-3322.webp",
              alt: "Facility 2",
            },
            {
              src: "/assets/350-3332.webp",
              alt: "Facility 3",
            },
          ]}
        />
      </main>
    </div>
  );
}
