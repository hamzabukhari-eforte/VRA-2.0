"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  items: FAQItem[];
}

export default function FAQSection({
  title = "FAQ",
  items,
}: FAQSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="w-full">
      <h2 className="text-foreground dark:text-white text-[64px] font-bold  mb-12">
        {title}
      </h2>

      <div className="flex flex-col gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="border-b border-foreground/10 dark:border-white/10 pb-6"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <h3 className="text-foreground dark:text-white text-[24px] font-medium ">
                {item.question}
              </h3>
              <span
                className={`text-foreground dark:text-white text-2xl transition-transform duration-300 ${
                  openFaq === index ? "rotate-180" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openFaq === index
                  ? "max-h-96 opacity-100 mt-4"
                  : "max-h-0 opacity-0 mt-0"
              }`}
            >
              <p className="text-foreground/70 dark:text-white/70 text-base font-normal leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

