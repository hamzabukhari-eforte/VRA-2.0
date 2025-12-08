"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

interface NetBookingFormProps {
  totalLanes?: number;
}

export default function NetBookingForm({
  totalLanes = 3,
}: NetBookingFormProps) {
  const [bookingType, setBookingType] = useState<"club" | "company">("club");
  const [bowlingMachine, setBowlingMachine] = useState(true);
  const [currentLane, setCurrentLane] = useState(1);

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-4 h-full">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="First Name"
            className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Last Name"
            className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="E-mail"
          className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
        />
      </div>

      {/* Phone Number Field */}
      <div className="flex flex-col gap-2">
        <input
          type="tel"
          placeholder="Phone Number"
          className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
        />
      </div>

      {/* Date and Duration Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <input
            type="date"
            placeholder="Select a Date"
            className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Duration"
            className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
          />
        </div>
      </div>

      {/* Club or Company/Business Toggle */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 py-1.5 px-2 border-b border-[#4A90E2] bg-[#F6F6F6] dark:bg-[#232323] rounded-t">
          <button
            onClick={() => setBookingType("club")}
            className={`px-6 py-2 rounded-lg transition-colors ${
              bookingType === "club"
                ? "bg-[#4A90E2] text-white"
                : "bg-transparent text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white"
            }`}
          >
            Club
          </button>
          <span className="text-foreground/50 dark:text-white/50">or</span>
          <button
            onClick={() => setBookingType("company")}
            className={`px-6 py-2 rounded-lg transition-colors ${
              bookingType === "company"
                ? "bg-[#4A90E2] text-white"
                : "bg-transparent text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white"
            }`}
          >
            Company/Business
          </button>
        </div>
      </div>

      {/* Number of Persons Field */}
      <div className="flex flex-col gap-2">
        <input
          type="number"
          placeholder="Number of persons"
          className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
        />
      </div>

      {/* Lanes Selector */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 py-1.5 px-2 border-b border-[#4A90E2] bg-[#F6F6F6] dark:bg-[#232323] rounded-t">
          <button
            onClick={() => setCurrentLane(Math.max(1, currentLane - 1))}
            className="w-8 h-8 flex items-center justify-center text-foreground dark:text-white hover:text-[#4A90E2] transition-colors"
          >
            <Image
              src="/assets/363-1135.svg"
              alt="Previous"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </button>
          <span className="text-foreground dark:text-white text-lg font-normal  flex-1 text-center">
            {currentLane} of {totalLanes}
          </span>
          <button
            onClick={() =>
              setCurrentLane(Math.min(totalLanes, currentLane + 1))
            }
            className="w-8 h-8 flex items-center justify-center text-foreground dark:text-white hover:text-[#4A90E2] transition-colors"
          >
            <Image
              src="/assets/363-1145.svg"
              alt="Next"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>

      {/* Additional Note Field */}
      <div className="flex flex-col gap-2">
        <textarea
          rows={4}
          placeholder="Additional note"
          className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors resize-none rounded-t text-center"
        />
      </div>

      {/* Bowling Machine Toggle */}
      <div className="flex items-center justify-between py-2">
        <span className="text-foreground dark:text-white text-base font-normal ">
          Bowling machine Required
        </span>
        <button
          onClick={() => setBowlingMachine(!bowlingMachine)}
          className={`relative w-[52px] h-[28px] rounded-full transition-colors ${
            bowlingMachine ? "bg-green-500" : "bg-foreground/20 dark:bg-white/20"
          }`}
        >
          <div
            className={`absolute top-[2px] w-[24px] h-[24px] bg-white rounded-full transition-transform ${
              bowlingMachine
                ? "translate-x-[26px]"
                : "translate-x-[2px]"
            }`}
          >
            {bowlingMachine && (
              <Check className="w-full h-full p-1 text-black" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

