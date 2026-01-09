"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloatingButton() {
  const phoneNumber = "917755916072"; // +91 77559 16072 without + and spaces
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed right-8 bottom-8 w-14 h-14 bg-gradient-to-b from-[#73FF44] to-[#69D346] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-50"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
    </button>
  );
}
