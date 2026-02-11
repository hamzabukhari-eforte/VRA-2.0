"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

interface NetBookingFormProps {
  totalLanes?: number;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  preferredDays: string[];
  time: string;
  duration: string;
  numberOfPitches: number;
  numberOfPeople: string;
  bowlingMachine: boolean;
  trainer: string;
  remarks: string;
}

const timeSlots = Array.from({ length: 14 }, (_, i) => ({
  value: `${i + 9}:00`,
  label: `${i + 9}:00`,
}));

const durationOptions = Array.from({ length: 9 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} hour${i > 0 ? "s" : ""}`,
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
  numberOfPitches: 1,
  numberOfPeople: "",
  bowlingMachine: false,
  trainer: "",
  remarks: "",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NetBookingForm(_props: NetBookingFormProps) {
  const [form, setForm] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Calculate min and max dates (2 days from now to 30 days from now)
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
    setForm((f) => ({
      ...f,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((e) => ({ ...e, [name]: "" }));
    }
  };

  const handleDateChange = (date: string) => {
    if (selectedDates.includes(date)) {
      // Remove date if already selected
      const newDates = selectedDates.filter((d) => d !== date);
      setSelectedDates(newDates);
      setForm((f) => ({ ...f, preferredDays: newDates }));
    } else {
      // Add date if not selected (max 3)
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
    }
  };

  const removeDate = (date: string) => {
    const newDates = selectedDates.filter((d) => d !== date);
    setSelectedDates(newDates);
    setForm((f) => ({ ...f, preferredDays: newDates }));
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
    if (!form.time) e.time = "Required";
    if (!form.duration) e.duration = "Required";
    if (form.numberOfPitches < 1) e.numberOfPitches = "Minimum 1 pitch required";
    if (form.numberOfPitches > 3)
      e.numberOfPitches = "Maximum 3 pitches allowed";
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 lg:gap-4 h-full">
      {/* Full Name Field */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
        />
        {errors.name && (
          <div className="text-red-400 text-xs mt-1 text-center">{errors.name}</div>
        )}
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="E-mail"
          required
          className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
        />
        {errors.email && (
          <div className="text-red-400 text-xs mt-1 text-center">{errors.email}</div>
        )}
      </div>

      {/* Phone Number Field */}
      <div className="flex flex-col gap-2">
        <input
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
        />
        {errors.phoneNumber && (
          <div className="text-red-400 text-xs mt-1 text-center">{errors.phoneNumber}</div>
        )}
      </div>

      {/* Preferred Days - Date Picker */}
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
              fontSize: '16px',
              paddingRight: '40px',
            }}
          />
          {/* Custom calendar icon overlay */}
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
            /* Make calendar popup larger */
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
          <div className="text-red-400 text-xs mt-1 text-center">{errors.preferredDays}</div>
        )}
      </div>

      {/* Time and Duration Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
          >
            <option value="">Preferred Time</option>
            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
          {errors.time && (
            <div className="text-red-400 text-xs mt-1 text-center">{errors.time}</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
            className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
          >
            <option value="">Duration</option>
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.duration && (
            <div className="text-red-400 text-xs mt-1 text-center">{errors.duration}</div>
          )}
        </div>
      </div>

      {/* Number of Pitches and Number of People */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <input
            type="number"
            name="numberOfPitches"
            min="1"
            max="3"
            value={form.numberOfPitches}
            onChange={handleChange}
            placeholder="Number of Pitches"
            required
            className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
          />
          {errors.numberOfPitches && (
            <div className="text-red-400 text-xs mt-1 text-center">{errors.numberOfPitches}</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            name="numberOfPeople"
            min="1"
            value={form.numberOfPeople}
            onChange={handleChange}
            placeholder="Number of People (Optional)"
            className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/70 focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
          />
        </div>
      </div>

      {/* Trainer Field */}
      <div className="flex flex-col gap-2">
        <select
          name="trainer"
          value={form.trainer}
          onChange={handleChange}
          required
          className="bg-[#F6F6F6] dark:bg-[#232323] border-b border-[#4A90E2] px-2 py-1.5 text-foreground dark:text-white focus:outline-none focus:border-[#6BA3E8] transition-colors rounded-t text-center"
        >
          <option value="">Select Trainer</option>
          {trainerOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.trainer && (
          <div className="text-red-400 text-xs mt-1 text-center">{errors.trainer}</div>
        )}
      </div>

      {/* Bowling Machine - Radio Buttons */}
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

      {/* Remarks Field */}
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

      {/* Submit Button */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="px-8 md:px-12 py-3 md:py-4 bg-black text-white dark:bg-foreground dark:text-black rounded-lg hover:bg-white/90 dark:hover:bg-foreground/90 transition-colors"
        >
          <span className="text-base md:text-lg font-medium font-['Roboto']">
            Book Now
          </span>
        </button>
      </div>
    </form>
  );
}
