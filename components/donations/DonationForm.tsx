"use client";

import { FormEvent, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

export default function DonationForm() {
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/submissions/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, isAnonymous }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          (data && (data.error || data.message)) ||
          "Failed to submit donation details.";
        throw new Error(message);
      }
      e.currentTarget.reset();
      toast.success("Thank you for your interest in supporting VRA.");
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit donation details. Please try again.";
      toast.error(message);
    }
  };

  return (
    <section className="w-full px-4 md:px-6 lg:px-10 flex flex-col items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20">
      <div className="w-full flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
        <h2 className="text-foreground dark:text-white text-2xl md:text-3xl lg:text-4xl font-medium text-center">
          Contribute to VRA&apos;s future
        </h2>

        {/* Form */}
        <form
          className="w-full flex flex-col items-center gap-4 md:max-w-[400px]"
          onSubmit={handleSubmit}
        >
          {/* First Name and Last Name */}
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
              />
            </div>
            <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
              />
            </div>
          </div>

          {/* Date of Birth and Nationality */}
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
              <input
                name="dob"
                type="text"
                placeholder="Date of Birth"
                className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
              />
            </div>
            <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
              <input
                name="nationality"
                type="text"
                placeholder="Nationality"
                className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
            <input
              name="gender"
              type="text"
              placeholder="Gender"
              className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
            />
          </div>

          {/* E-mail */}
          <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
            />
          </div>

          {/* Phone Number */}
          <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
            />
          </div>

          {/* Address */}
          <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
            <input
              name="address"
              type="text"
              placeholder="Address"
              className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
            />
          </div>

          {/* How did you hear about us? */}
          <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
            <input
              name="heardFrom"
              type="text"
              placeholder="How did you hear about us?"
              className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
            />
          </div>

          {/* Company/Collage name */}
          <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
            <input
              name="company"
              type="text"
              placeholder="Company/Collage name"
              className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
            />
          </div>

          {/* Employment Type */}
          <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
            <input
              name="employmentType"
              type="text"
              placeholder="Employment Type"
              className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
            />
          </div>

          {/* Designation and role */}
          <div className="w-full h-10 bg-[#F6F6F6] dark:bg-[#222222] rounded-lg border-b-2 border-[#233F84] flex items-center justify-center">
            <input
              name="designation"
              type="text"
              placeholder="Designation and role"
              className="w-full bg-transparent text-center text-foreground dark:text-white text-base font-normal outline-none placeholder:text-foreground/70 dark:placeholder:text-white"
            />
          </div>

          {/* Option to be Anonymous */}
          <div className="w-full flex items-center justify-between py-2">
            <span className="text-foreground dark:text-white text-base font-normal">
              Option to be Anonymous
            </span>
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative w-[52px] h-[28px] rounded-full transition-colors ${
                isAnonymous ? "bg-green-500" : "bg-foreground/20 dark:bg-white/20"
              }`}
            >
              <div
                className={`absolute top-[2px] w-[24px] h-[24px] bg-white rounded-full transition-transform ${
                  isAnonymous
                    ? "translate-x-[26px]"
                    : "translate-x-[2px]"
                }`}
              >
                {isAnonymous && (
                  <Check className="w-full h-full p-1 text-black" />
                )}
              </div>
            </button>
          </div>

        {/* Submit Button */}
        <div className="w-full max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1200px] flex flex-col items-center gap-4">
          <button
            type="submit"
            className="w-full md:w-auto h-12 md:h-[52px] px-6 bg-linear-to-b from-[#141414] to-black dark:from-[#141414] dark:to-black rounded-[40px] border border-white/10 flex items-center justify-center gap-4"
          >
            <span className="text-white text-base md:text-lg lg:text-xl font-bold font-['Roboto']">
              Submit your Interest
            </span>
          </button>
        </div>
      </form>
      </div>
    </section>
  );
}

