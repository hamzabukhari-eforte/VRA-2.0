"use client";

import { useMemo, useState } from "react";
import BookingSummary from "@/components/net-booking/BookingSummary";
import NetBookingForm from "@/components/net-booking/NetBookingForm";

type Selection = {
  preferredDays: string[];
  time: string;
  duration: string;
  numberOfPitches: string;
};

function formatSummaryDate(days: string[]) {
  if (days.length === 0) return "Select a date";
  const sorted = [...days].sort();
  const first = new Date(sorted[0]);
  const formatted = first.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  if (days.length === 1) return formatted;
  return `${formatted} (+${days.length - 1})`;
}

function formatSummaryDuration(selection: Selection) {
  const parts: string[] = [];
  if (selection.time) parts.push(selection.time);
  if (selection.duration) {
    const hours = Number(selection.duration);
    parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  }
  if (selection.numberOfPitches) {
    const lanes = Number(selection.numberOfPitches);
    parts.push(`${lanes} lane${lanes === 1 ? "" : "s"}`);
  }
  return parts.length > 0 ? parts.join(" · ") : "Your session";
}

export default function IndoorNetBookingSection() {
  const [selection, setSelection] = useState<Selection>({
    preferredDays: [],
    time: "",
    duration: "",
    numberOfPitches: "",
  });

  const date = useMemo(
    () => formatSummaryDate(selection.preferredDays),
    [selection.preferredDays]
  );
  const duration = useMemo(
    () => formatSummaryDuration(selection),
    [selection]
  );
  const price = useMemo(() => {
    const hours = Number(selection.duration) || 0;
    const lanes = Number(selection.numberOfPitches) || 0;
    if (!hours && !lanes) return 20;
    return 20 * (hours || 1) * (lanes || 1);
  }, [selection.duration, selection.numberOfPitches]);

  const priceUnit = selection.duration || selection.numberOfPitches ? "€" : "€/hr";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
      {/* Stretches to form height so sticky stays active for that range */}
      <aside className="min-h-0 self-stretch">
        <div className="lg:sticky lg:top-24 lg:will-change-transform motion-safe:lg:transition-[transform,opacity] motion-safe:lg:duration-300 motion-safe:lg:ease-out">
          <BookingSummary
            date={date}
            duration={duration}
            price={price}
            priceUnit={priceUnit}
            laneImageSrc="/assets/net-booking/net-booking-svg.png"
            laneImageAlt="Cricket Lane"
          />
        </div>
      </aside>
      <NetBookingForm totalLanes={3} onSelectionChange={setSelection} />
    </div>
  );
}
