import DonationHero from "@/components/donations/DonationHero";
import DonationForm from "@/components/donations/DonationForm";
import BankDetailsSection from "@/components/donations/BankDetailsSection";
import CollaborationSection from "@/components/shared/CollaborationSection";

export default function DonationsPage() {
  return (
    <div className="min-h-screen dark:bg-[#202020] bg-background text-foreground dark:text-white overflow-x-hidden">
      {/* Hero Section */}
      <DonationHero
        imageSrc="/assets/542-27974.webp"
        imageAlt="Cricket player"
        heading="Donations"
        tagline='"Lets make cricket go Orange"'
      />

      {/* Main Content */}
      <main className="w-full max-w-[1280px] mx-auto flex flex-col items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20 pt-6 md:pt-10 lg:pt-14 xl:pt-20 px-4 md:px-6 lg:px-8 pb-8 md:pb-12 lg:pb-16 xl:pb-20">
        {/* Donation Form Section */}
        <DonationForm />

        {/* Bank Details Section */}
        <BankDetailsSection />

        {/* Collaboration Section */}
        <CollaborationSection />
      </main>
    </div>
  );
}
