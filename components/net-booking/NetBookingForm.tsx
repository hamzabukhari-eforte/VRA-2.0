"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Calendar, Clock, Timer } from "lucide-react";
import { toast } from "sonner";

interface NetBookingFormProps {
  totalLanes?: number;
  onSelectionChange?: (selection: {
    preferredDays: string[];
    time: string;
    duration: string;
    numberOfPitches: string;
  }) => void;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  preferredDays: string[];
  time: string;
  duration: string;
  numberOfPitches: string;
  numberOfPeople: string;
  bowlingMachine: boolean;
  trainer: string;
  remarks: string;
}

type TimePeriod = "morning" | "afternoon" | "evening";

const timeSlots = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 9;
  const value = `${hour}:00`;
  const period: TimePeriod =
    hour < 13 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return { value, label: value, period, hour };
});

const timePeriods: { id: TimePeriod; label: string }[] = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
];

const durationOptions = Array.from({ length: 9 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}h`,
  fullLabel: `${i + 1} hour${i > 0 ? "s" : ""}`,
}));

const trainerOptions = [
  { value: "senior", label: "Senior Trainer (€69/hour)" },
  { value: "junior", label: "Junior Trainer (€40/hour)" },
  { value: "none", label: "No Trainer" },
];

const initialState: FormData = {
  name: "",
  email: "",
  phoneNumber: "",
  preferredDays: [],
  time: "",
  duration: "",
  numberOfPitches: "",
  numberOfPeople: "",
  bowlingMachine: false,
  trainer: "",
  remarks: "",
};

const fieldShell =
  "bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center";

const chipBase =
  "min-w-[3.25rem] px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2]/60";

const chipIdle =
  "bg-[#F6F6F6] dark:bg-[#2a2a2a] border-transparent text-foreground/80 dark:text-white/80 hover:border-[#4A90E2]/50 hover:text-foreground dark:hover:text-white";

const chipActive =
  "bg-[#4A90E2] border-[#4A90E2] text-white shadow-[0_0_0_1px_rgba(74,144,226,0.35)] scale-[1.02]";

export default function NetBookingForm({
  totalLanes = 3,
  onSelectionChange,
}: NetBookingFormProps) {
  const [form, setForm] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("morning");

  const laneCount = Math.max(1, Math.min(3, totalLanes));
  const lanes = Array.from({ length: laneCount }, (_, i) => String(i + 1));
  const visibleSlots = timeSlots.filter((slot) => slot.period === timePeriod);

  const notifySelection = (next: Partial<FormData> & { preferredDays?: string[] }) => {
    if (!onSelectionChange) return;
    onSelectionChange({
      preferredDays: next.preferredDays ?? form.preferredDays,
      time: next.time ?? form.time,
      duration: next.duration ?? form.duration,
      numberOfPitches: next.numberOfPitches ?? form.numberOfPitches,
    });
  };

  const setField = <K extends keyof FormData>(name: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as string]) {
      setErrors((e) => ({ ...e, [name as string]: "" }));
    }
    if (
      name === "time" ||
      name === "duration" ||
      name === "numberOfPitches" ||
      name === "preferredDays"
    ) {
      notifySelection({ [name]: value } as Partial<FormData>);
    }
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const nextValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((f) => ({
      ...f,
      [name]: nextValue,
    }));
    if (errors[name]) {
      setErrors((err) => ({ ...err, [name]: "" }));
    }
  };

  const handleDateChange = (date: string) => {
    if (selectedDates.includes(date)) {
      const newDates = selectedDates.filter((d) => d !== date);
      setSelectedDates(newDates);
      setForm((f) => ({ ...f, preferredDays: newDates }));
      notifySelection({ preferredDays: newDates });
    } else {
      if (selectedDates.length >= 3) {
        setErrors((e) => ({
          ...e,
          preferredDays: "Maximum 3 days allowed",
        }));
        return;
      }
      const newDates = [...selectedDates, date];
      setSelectedDates(newDates);
      setForm((f) => ({ ...f, preferredDays: newDates }));
      setErrors((e) => ({ ...e, preferredDays: "" }));
      notifySelection({ preferredDays: newDates });
    }
  };

  const removeDate = (date: string) => {
    const newDates = selectedDates.filter((d) => d !== date);
    setSelectedDates(newDates);
    setForm((f) => ({ ...f, preferredDays: newDates }));
    notifySelection({ preferredDays: newDates });
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Required";
    if (!form.email) e.email = "Required";
    if (!form.phoneNumber) e.phoneNumber = "Required";
    if (form.preferredDays.length < 1)
      e.preferredDays = "Select at least 1 day";
    if (form.preferredDays.length > 3)
      e.preferredDays = "Maximum 3 days allowed";
    if (!form.time) e.time = "Select a preferred time";
    if (!form.duration) e.duration = "Select a duration";
    const pitches = Number(form.numberOfPitches);
    if (!form.numberOfPitches || Number.isNaN(pitches) || pitches < 1)
      e.numberOfPitches = "Select at least 1 lane";
    if (pitches > laneCount)
      e.numberOfPitches = `Maximum ${laneCount} lanes allowed`;
    if (!form.trainer) e.trainer = "Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions/net-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          numberOfPitches: Number(form.numberOfPitches),
          preferredDays: form.preferredDays,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          (data && (data.error || data.message)) ||
          "Failed to submit booking. Please try again.";
        throw new Error(message);
      }
      setForm(initialState);
      setSelectedDates([]);
      setTimePeriod("morning");
      onSelectionChange?.({
        preferredDays: [],
        time: "",
        duration: "",
        numberOfPitches: "",
      });
      toast.success("Indoor net booking submitted. We will contact you shortly.");
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit booking. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 md:gap-4 lg:gap-4 h-full"
    >
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className={fieldShell}
        />
        {errors.name && (
          <div className="text-red-400 text-xs mt-1 text-center">{errors.name}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="E-mail"
          required
          className={fieldShell}
        />
        {errors.email && (
          <div className="text-red-400 text-xs mt-1 text-center">{errors.email}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className={fieldShell}
        />
        {errors.phoneNumber && (
          <div className="text-red-400 text-xs mt-1 text-center">
            {errors.phoneNumber}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 justify-center bg-[#F6F6F6] dark:bg-[#232323] ">
          <Calendar className="w-4 h-4 text-[#4A90E2]" />
          <span className="text-foreground dark:text-white text-sm font-medium">
            Preferred Days (max 3)
          </span>
        </div>
        <div className="relative">
          <input
            type="date"
            min={getMinDate()}
            max={getMaxDate()}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-3 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center cursor-pointer text-base"
            style={{
              fontSize: "16px",
              paddingRight: "40px",
            }}
          />
          <Calendar
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A90E2] pointer-events-none"
            style={{ zIndex: 1 }}
          />
          <style jsx>{`
            input[type="date"]::-webkit-calendar-picker-indicator {
              opacity: 0;
              position: absolute;
              right: 0;
              width: 100%;
              height: 100%;
              cursor: pointer;
              z-index: 2;
            }
            input[type="date"]::-webkit-calendar-picker-indicator:hover {
              opacity: 0;
            }
            input[type="date"]::-webkit-inner-spin-button,
            input[type="date"]::-webkit-clear-button {
              display: none;
            }
            input[type="date"] {
              font-size: 16px !important;
            }
            @media (min-width: 768px) {
              input[type="date"] {
                font-size: 18px !important;
              }
            }
          `}</style>
        </div>
        {selectedDates.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {selectedDates.map((date) => (
              <span
                key={date}
                className="px-3 py-1 bg-[#4A90E2] text-white text-xs rounded-full flex items-center gap-2"
              >
                {new Date(date).toLocaleDateString("en-US")}
                <button
                  type="button"
                  onClick={() => removeDate(date)}
                  className="hover:text-red-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.preferredDays && (
          <div className="text-red-400 text-xs mt-1 text-center">
            {errors.preferredDays}
          </div>
        )}
      </div>

      {/* Preferred Time — period tabs + chips */}
      <div className="flex flex-col gap-3 rounded-t bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-3 py-3">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-[#4A90E2]" />
          <span className="text-foreground dark:text-white text-sm font-medium">
            Preferred Time
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Time of day"
          className="flex gap-1 p-1 rounded-xl bg-black/5 dark:bg-black/30"
        >
          {timePeriods.map((period) => {
            const active = timePeriod === period.id;
            return (
              <button
                key={period.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTimePeriod(period.id)}
                className={`flex-1 rounded-lg px-2 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? "bg-white dark:bg-[#3a3a3a] text-[#4A90E2] shadow-sm"
                    : "text-foreground/60 dark:text-white/60 hover:text-foreground dark:hover:text-white"
                }`}
              >
                {period.label}
              </button>
            );
          })}
        </div>

        <div
          role="radiogroup"
          aria-label="Preferred time slot"
          className="flex flex-wrap justify-center gap-2"
        >
          {visibleSlots.map((slot) => {
            const selected = form.time === slot.value;
            return (
              <button
                key={slot.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setField("time", slot.value)}
                className={`${chipBase} ${selected ? chipActive : chipIdle}`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
        {errors.time && (
          <div className="text-red-400 text-xs text-center">{errors.time}</div>
        )}
      </div>

      {/* Duration chips */}
      <div className="flex flex-col gap-3 rounded-t bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-3 py-3">
        <div className="flex items-center justify-center gap-2">
          <Timer className="w-4 h-4 text-[#4A90E2]" />
          <span className="text-foreground dark:text-white text-sm font-medium">
            Duration
          </span>
        </div>
        <div
          role="radiogroup"
          aria-label="Booking duration"
          className="flex flex-wrap justify-center gap-2"
        >
          {durationOptions.map((option) => {
            const selected = form.duration === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                title={option.fullLabel}
                onClick={() => setField("duration", option.value)}
                className={`${chipBase} ${selected ? chipActive : chipIdle}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {errors.duration && (
          <div className="text-red-400 text-xs text-center">{errors.duration}</div>
        )}
      </div>

      {/* Lanes — full width */}
      <div className="flex flex-col gap-3 rounded-t bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-3 py-3">
        <div className="text-center">
          <span className="text-foreground dark:text-white text-sm font-medium">
            How many lanes?
          </span>
          <p className="text-[11px] text-foreground/55 dark:text-white/55 mt-0.5">
            Up to {laneCount} lanes
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Number of lanes"
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${laneCount}, minmax(0, 1fr))` }}
        >
          {lanes.map((lane) => {
            const selected = form.numberOfPitches === lane;
            return (
              <button
                key={lane}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setField("numberOfPitches", lane)}
                className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2]/60 ${
                  selected
                    ? "border-[#4A90E2] bg-[#4A90E2]/15 dark:bg-[#4A90E2]/25 shadow-[inset_0_0_0_1px_rgba(74,144,226,0.45)]"
                    : "border-transparent bg-black/5 dark:bg-black/25 hover:border-[#4A90E2]/40"
                }`}
              >
                <span
                  className="flex h-8 w-full max-w-[2.75rem] items-end justify-center gap-0.5"
                  aria-hidden
                >
                  {Array.from({ length: Number(lane) }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-full w-1.5 rounded-sm ${
                        selected ? "bg-[#4A90E2]" : "bg-foreground/30 dark:bg-white/35"
                      }`}
                    />
                  ))}
                </span>
                <span
                  className={`text-lg font-semibold leading-none ${
                    selected
                      ? "text-[#4A90E2] dark:text-[#7eb3f0]"
                      : "text-foreground dark:text-white"
                  }`}
                >
                  {lane}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-foreground/50 dark:text-white/50">
                  {Number(lane) === 1 ? "Lane" : "Lanes"}
                </span>
              </button>
            );
          })}
        </div>
        {errors.numberOfPitches && (
          <div className="text-red-400 text-xs text-center">
            {errors.numberOfPitches}
          </div>
        )}
      </div>

      {/* People + trainer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <input
            type="number"
            name="numberOfPeople"
            min="1"
            value={form.numberOfPeople}
            onChange={handleChange}
            placeholder="Number of People (Optional)"
            className={fieldShell}
          />
        </div>
        <div className="flex flex-col gap-2">
          <select
            name="trainer"
            value={form.trainer}
            onChange={handleChange}
            required
            className={fieldShell}
          >
            <option value="">Select Trainer</option>
            {trainerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.trainer && (
            <div className="text-red-400 text-xs mt-1 text-center">
              {errors.trainer}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 py-1.5 px-2 border-b border-[#4A90E2] bg-[#F6F6F6] dark:bg-[#232323] rounded-t justify-center">
          <span className="text-foreground dark:text-white text-sm font-medium">
            Bowling Machine Required:
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="bowlingMachine"
              checked={form.bowlingMachine === true}
              onChange={() => setForm((f) => ({ ...f, bowlingMachine: true }))}
              className="accent-[#4A90E2]"
            />
            <span className="text-foreground dark:text-white text-sm">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="bowlingMachine"
              checked={form.bowlingMachine === false}
              onChange={() => setForm((f) => ({ ...f, bowlingMachine: false }))}
              className="accent-[#4A90E2]"
            />
            <span className="text-foreground dark:text-white text-sm">No</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          rows={4}
          placeholder="Additional Remarks (Optional)"
          className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors resize-none rounded-t text-center"
        />
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 md:px-12 py-3 md:py-4 bg-black text-white dark:bg-foreground dark:text-black rounded-lg hover:bg-white/90 dark:hover:bg-foreground/90 transition-colors disabled:opacity-60"
        >
          <span className="text-base md:text-lg font-medium font-['Roboto']">
            {submitting ? "Booking..." : "Book Now"}
          </span>
        </button>
      </div>
    </form>
  );
}
