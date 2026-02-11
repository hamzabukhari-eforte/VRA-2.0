"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

type MembershipType = "senior" | "junior" | "nonPlaying" | "";

interface MembershipForm {
  // Section 1
  name: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  membershipType: MembershipType;
  howHeard: string;
  nationality: string;
  dob: string;
  gender: string;
  employmentType: string;
  companyCollege: string;
  designation: string;

  // Section 2
  coachQualification: string;
  coachingExperience: string;
  memberBefore: string;
  previousMembership: string;

  // Section 3
  volunteeringAreas: string[];
  volunteeringOther: string;
  volunteeringOptOut: boolean;

  // Section 4
  iban: string;
  accountHolder: string;
  paymentConsent: boolean;

  // Section 5
  dataUsageConsent: boolean;
}

const initialForm: MembershipForm = {
  name: "",
  email: "",
  phone: "",
  street: "",
  houseNumber: "",
  postalCode: "",
  city: "",
  membershipType: "",
  howHeard: "",
  nationality: "",
  dob: "",
  gender: "",
  employmentType: "",
  companyCollege: "",
  designation: "",

  coachQualification: "",
  coachingExperience: "",
  memberBefore: "",
  previousMembership: "",

  volunteeringAreas: [],
  volunteeringOther: "",
  volunteeringOptOut: false,

  iban: "",
  accountHolder: "",
  paymentConsent: false,

  dataUsageConsent: false,
};

const coachQualificationOptions = [
  "0-No",
  "1-Coaching-level-1",
  "2-Coaching-level-2",
  "3-Coaching-level-3",
  "4-Other",
];

const previousMembershipOptions = [
  "ACC",
  "Ajax Leiden",
  "Bloemendaal",
  "Concordia",
  "Dosti",
  "Excelsior '20",
  "HCC",
  "Hermes",
  "Groen-Geel",
  "HBS",
  "Hilversum",
  "Kampong",
  "MOP",
  "Olympia",
  "Punjab",
  "Qui Vive",
  "Quick Haag",
  "Quick Nijmegen 1888",
  "Rood en Wit",
  "Salland",
  "Sparta",
  "VCC",
  "VOC",
  "VVV",
  "Other (specify in remarks)",
  "None",
];

const volunteeringOptions = [
  "Administration",
  "Coaching",
  "Ground/Pitch maintenance",
  "Scoring",
  "Transportation",
  "Information Technology",
  "Team well-being",
  "Event Management",
  "Communication",
  "Finance",
];

const totalSteps = 5;

export default function MembershipApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<MembershipForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const newValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : value;
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmailBlur = () => {
    if (!form.email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    }
  };

  const toggleVolunteeringArea = (area: string) => {
    setForm((prev) => {
      const alreadySelected = prev.volunteeringAreas.includes(area);
      const updated = alreadySelected
        ? prev.volunteeringAreas.filter((a) => a !== area)
        : [...prev.volunteeringAreas, area];
      return { ...prev, volunteeringAreas: updated };
    });
    if (errors.volunteeringAreas) {
      setErrors((prev) => ({ ...prev, volunteeringAreas: "" }));
    }
  };

  /** Returns true if all required fields for the given step are filled (no errors). Does not set errors. */
  const isStepComplete = (step: number): boolean => {
    if (step === 1) {
      const emailValid =
        form.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      if (
        !form.name.trim() ||
        !emailValid ||
        !form.phone.trim() ||
        !form.street.trim() ||
        !form.houseNumber.trim() ||
        !form.postalCode.trim() ||
        !form.city.trim() ||
        !form.membershipType ||
        !form.howHeard.trim() ||
        !form.nationality.trim() ||
        !form.dob ||
        !form.gender
      )
        return false;
      if (
        (form.membershipType === "senior" || form.membershipType === "nonPlaying") &&
        !form.employmentType
      )
        return false;
      return true;
    }
    if (step === 2) {
      if (!form.coachQualification) return false;
      if (
        form.coachQualification !== "0-No" &&
        !form.coachingExperience.trim()
      )
        return false;
      if (!form.memberBefore) return false;
      if (form.memberBefore === "yes" && !form.previousMembership)
        return false;
      return true;
    }
    if (step === 3) {
      if (!form.volunteeringOptOut && form.volunteeringAreas.length === 0)
        return false;
      return true;
    }
    if (step === 4) {
      if (
        !form.iban.trim() ||
        !form.accountHolder.trim() ||
        !form.paymentConsent
      )
        return false;
      return true;
    }
    if (step === 5) {
      return !!form.dataUsageConsent;
    }
    return false;
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required.";
      if (!form.email.trim()) {
        newErrors.email = "Email is required.";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
          newErrors.email = "Please enter a valid email address.";
        }
      }
      if (!form.phone.trim()) newErrors.phone = "Phone is required.";
      if (!form.street.trim()) newErrors.street = "Street is required.";
      if (!form.houseNumber.trim())
        newErrors.houseNumber = "House number is required.";
      if (!form.postalCode.trim())
        newErrors.postalCode = "Postal code is required.";
      if (!form.city.trim()) newErrors.city = "City is required.";
      if (!form.membershipType)
        newErrors.membershipType = "Membership type is required.";
      if (!form.howHeard.trim())
        newErrors.howHeard = "Please tell us how you heard about us.";
      if (!form.nationality.trim())
        newErrors.nationality = "Nationality is required.";
      if (!form.dob) newErrors.dob = "Date of birth is required.";
      if (!form.gender) newErrors.gender = "Gender is required.";
      if (form.membershipType === "senior" || form.membershipType === "nonPlaying") {
        if (!form.employmentType)
          newErrors.employmentType = "Employment type is required for this membership.";
      }
    }

    if (step === 2) {
      if (!form.coachQualification)
        newErrors.coachQualification =
          "Please select your coaching qualification.";
      if (form.coachQualification && form.coachQualification !== "0-No") {
        if (!form.coachingExperience.trim()) {
          newErrors.coachingExperience =
            "Please tell us about your coaching experience.";
        }
      }
      if (!form.memberBefore)
        newErrors.memberBefore = "Please indicate if you were a VRA member before.";
      if (form.memberBefore === "yes" && !form.previousMembership) {
        newErrors.previousMembership =
          "Please select your previous membership club.";
      }
    }

    if (step === 3) {
      if (!form.volunteeringOptOut && form.volunteeringAreas.length === 0) {
        newErrors.volunteeringAreas =
          "Please select at least one volunteering area or opt out.";
      }
    }

    if (step === 4) {
      if (!form.iban.trim()) newErrors.iban = "IBAN is required.";
      if (!form.accountHolder.trim())
        newErrors.accountHolder = "Account holder name is required.";
      if (!form.paymentConsent) {
        newErrors.paymentConsent =
          "You must authorise the yearly withdrawal and confirm the information.";
      }
    }

    if (step === 5) {
      if (!form.dataUsageConsent) {
        newErrors.dataUsageConsent =
          "Please provide permission for data usage to continue.";
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          (data && (data.error || data.message)) ||
          "Failed to submit membership application.";
        throw new Error(message);
      }
      setSubmitted(true);
      toast.success("Membership application submitted. We will contact you shortly.");
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit membership application. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Skills & Experience" },
    { number: 3, title: "Volunteering" },
    { number: 4, title: "Payment" },
    { number: 5, title: "Finalisation" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pt-[76px] sm:pt-[88px] md:pt-[104px] pb-10 md:pb-16">
      {/* Background image - same as membership page */}
      <Image
        src="/assets/542-20000.webp"
        alt=""
        fill
        className="object-cover opacity-70"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-[#202020]" />

      <div className="relative z-1 max-w-4xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Membership Application
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            Join our community of passionate cricketers by completing the form
            below.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between text-xs md:text-sm text-gray-300">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{progressPercentage}% complete</span>
        </div>

        {/* Stepper - glass effect */}
        <div className="mb-10 rounded-2xl border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-xl p-4 md:p-6 shadow-xl">
          <div className="flex items-center gap-2 md:gap-4">
            {steps.map((step, index) => {
              const isCompleted = step.number < currentStep;
              const isActive = step.number === currentStep;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.number} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={[
                        "w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold border transition-colors",
                        isActive
                          ? "bg-linear-to-b from-[#155dfc] to-[#0c3796] text-white border-transparent"
                          : isCompleted
                          ? "bg-[#155dfc] text-white border-[#155dfc]"
                          : "bg-white/10 text-gray-400 border-white/30",
                      ].join(" ")}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`text-[10px] md:text-xs text-center ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="hidden md:block flex-1 h-[2px] mx-2 rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-[#155dfc]"
                        style={{
                          width:
                            currentStep > step.number
                              ? "100%"
                              : "0%",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="membership-application-form space-y-8 rounded-2xl p-4 md:p-8 shadow-xl border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-xl"
        >
          {/* Section 1: Basic Information */}
          {currentStep === 1 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Basic Information
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Tell us a bit about yourself.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Name<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. John Smith"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Email<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                    placeholder="e.g. john.smith@example.com"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Phone<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. +31 6 12345678"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Nationality<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={form.nationality}
                    onChange={handleChange}
                    placeholder="e.g. Dutch, British"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.nationality && (
                    <p className="text-xs text-red-400">
                      {errors.nationality}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Date of Birth<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    placeholder="e.g. 01-01-1990"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.dob && (
                    <p className="text-xs text-red-400">{errors.dob}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Gender<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc] [&_option]:bg-gray-900 [&_option]:text-white"
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-xs text-red-400">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Street<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="e.g. Cricket Lane"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.street && (
                    <p className="text-xs text-red-400">{errors.street}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    House Number<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={form.houseNumber}
                    onChange={handleChange}
                    placeholder="e.g. A-01 or 78621"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.houseNumber && (
                    <p className="text-xs text-red-400">
                      {errors.houseNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Postal Code<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 1012 AB"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.postalCode && (
                    <p className="text-xs text-red-400">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    City<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Amsterdam"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.city && (
                    <p className="text-xs text-red-400">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Membership Type
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <select
                    name="membershipType"
                    value={form.membershipType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc] [&_option]:bg-gray-900 [&_option]:text-white"
                  >
                    <option value="">Select membership type</option>
                    <option value="senior">Senior (18+)</option>
                    <option value="junior">Junior</option>
                    <option value="nonPlaying">Non-playing member</option>
                  </select>
                  {errors.membershipType && (
                    <p className="text-xs text-red-400">
                      {errors.membershipType}
                    </p>
                  )}
                </div>
              </div>

              {(form.membershipType === "senior" ||
                form.membershipType === "nonPlaying") && (
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-200">
                      Employment Type
                      <span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <select
                      name="employmentType"
                      value={form.employmentType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc] [&_option]:bg-gray-900 [&_option]:text-white"
                    >
                      <option value="">Select employment type</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="employee">Employee</option>
                      <option value="freelancer">Freelancer</option>
                      <option value="student">Student</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                    {errors.employmentType && (
                      <p className="text-xs text-red-400">
                        {errors.employmentType}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Company/College Name
                  </label>
                  <input
                    type="text"
                    name="companyCollege"
                    value={form.companyCollege}
                    onChange={handleChange}
                    placeholder="e.g. ABC Company or University of Amsterdam"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Designation and Role
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer, Student"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    How did you hear about us?
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="howHeard"
                    value={form.howHeard}
                    onChange={handleChange}
                    placeholder="Friend, social media, school, etc."
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.howHeard && (
                    <p className="text-xs text-red-400">{errors.howHeard}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Skills & Experience */}
          {currentStep === 2 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Skills & Experience
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Share your cricket background and any coaching expertise.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-200">
                  Are you qualified as a cricket coach?
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <select
                  name="coachQualification"
                  value={form.coachQualification}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc] [&_option]:bg-gray-900 [&_option]:text-white"
                >
                  <option value="">Choose</option>
                  {coachQualificationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.coachQualification && (
                  <p className="text-xs text-red-400">
                    {errors.coachQualification}
                  </p>
                )}
              </div>

              {form.coachQualification && form.coachQualification !== "0-No" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Tell us about your coaching experience
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <textarea
                    name="coachingExperience"
                    value={form.coachingExperience}
                    onChange={handleChange}
                    rows={4}
                    placeholder="e.g. 5 years coaching juniors at local club, ECB Level 1 certified..."
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.coachingExperience && (
                    <p className="text-xs text-red-400">
                      {errors.coachingExperience}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Member of VRA before?
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="flex gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="memberBefore"
                        value="yes"
                        checked={form.memberBefore === "yes"}
                        onChange={handleChange}
                        className="text-[#155dfc]"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="memberBefore"
                        value="no"
                        checked={form.memberBefore === "no"}
                        onChange={handleChange}
                        className="text-[#155dfc]"
                      />
                      <span>No</span>
                    </label>
                  </div>
                  {errors.memberBefore && (
                    <p className="text-xs text-red-400">
                      {errors.memberBefore}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Previous Membership
                    {form.memberBefore === "yes" && (
                      <span className="text-red-400 ml-0.5">*</span>
                    )}
                  </label>
                  <select
                    name="previousMembership"
                    value={form.previousMembership}
                    onChange={handleChange}
                    disabled={form.memberBefore !== "yes"}
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#155dfc] [&_option]:bg-gray-900 [&_option]:text-white"
                  >
                    <option value="">Choose</option>
                    {previousMembershipOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.previousMembership && (
                    <p className="text-xs text-red-400">
                      {errors.previousMembership}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Volunteering */}
          {currentStep === 3 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Volunteering
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Our club is completely dependant on the work of volunteers. We
                  expect every member to contribute at least 3–4 times a year
                  during the cricket season.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-200">
                  Indicate your capabilities and interest
                  <span className="text-[11px] font-normal text-gray-400">
                    {" "}
                    (check all that apply)
                  </span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {volunteeringOptions.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                        form.volunteeringOptOut
                          ? "border-white/20 bg-white/5 opacity-60 cursor-not-allowed"
                          : form.volunteeringAreas.includes(opt)
                          ? "border-[#155dfc] bg-[#155dfc]/20"
                          : "border-white/30 bg-white/10 hover:border-[#155dfc]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.volunteeringAreas.includes(opt)}
                        disabled={form.volunteeringOptOut}
                        onChange={() => toggleVolunteeringArea(opt)}
                        className="h-4 w-4 rounded border-white/50 text-[#155dfc] accent-[#155dfc]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="volunteeringOtherToggle"
                        checked={!!form.volunteeringOther}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            volunteeringOther: e.target.checked
                              ? prev.volunteeringOther
                              : "",
                          }))
                        }
                        disabled={form.volunteeringOptOut}
                        className="h-4 w-4 rounded border-white/50 text-[#155dfc] accent-[#155dfc]"
                      />
                      <span>Other (specify in remarks)</span>
                    </label>
                    {form.volunteeringOther !== "" && (
                      <input
                        type="text"
                        name="volunteeringOther"
                        value={form.volunteeringOther}
                        onChange={handleChange}
                        disabled={form.volunteeringOptOut}
                        placeholder="Describe other ways you can help"
                        className="mt-2 w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                      />
                    )}
                  </div>
                </div>
                {errors.volunteeringAreas && (
                  <p className="text-xs text-red-400">
                    {errors.volunteeringAreas}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    name="volunteeringOptOut"
                    checked={form.volunteeringOptOut}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-white/50 text-[#155dfc] accent-[#155dfc]"
                  />
                  <span>
                    I want to opt out of volunteering. I understand that the
                    club is dependent on volunteers and that opting out may
                    affect how often I am approached for support.
                  </span>
                </label>
              </div>
            </section>
          )}

          {/* Section 4: Payment Information */}
          {currentStep === 4 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Payment Information
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Enter the bank details for the yearly VRA membership fee.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    IBAN Bank account number
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="iban"
                    value={form.iban}
                    onChange={handleChange}
                    placeholder="NL00 BANK 0000 0000 00"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 uppercase focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                  />
                  {errors.iban && (
                    <p className="text-xs text-red-400">{errors.iban}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Account holder name
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={form.accountHolder}
                    onChange={handleChange}
                    placeholder="e.g. John Smith"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.accountHolder && (
                    <p className="text-xs text-red-400">
                      {errors.accountHolder}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    name="paymentConsent"
                    checked={form.paymentConsent}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-white/50 text-[#155dfc] accent-[#155dfc]"
                  />
                  <span>
                    Hereby I authorise the yearly withdrawal of the VRA club
                    fees from the above account and declare that all the given
                    information is correct.
                  </span>
                </label>
                {errors.paymentConsent && (
                  <p className="text-xs text-red-400">
                    {errors.paymentConsent}
                  </p>
                )}
              </div>

              <div className="border-t border-dashed border-white/20 pt-4 mt-4 text-sm text-gray-300">
                <span className="font-semibold text-white">
                  Other payment options
                </span>
                <p className="mt-1">
                  If you prefer to pay in a different way (for example via
                  invoice), please mention this in the remarks field or contact
                  the club treasurer after submitting this form.
                </p>
              </div>
            </section>
          )}

          {/* Section 5: Finalisation and submission */}
          {currentStep === 5 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Finalisation &amp; Submission
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Review the information you&apos;ve provided and give
                  permission for data usage before submitting.
                </p>
              </div>

              <div className="space-y-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-4 text-sm text-gray-200">
                <p>
                  VRA Cricket Club processes your personal data in accordance
                  with applicable privacy regulations. Your information will
                  only be used for membership administration, communication
                  about club activities, and obligations towards sports
                  associations and authorities.
                </p>
                <p>
                  You have the right to request access to, correction, or
                  deletion of your personal data. For more information, please
                  contact the club administration.
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    name="dataUsageConsent"
                    checked={form.dataUsageConsent}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-white/50 text-[#155dfc] accent-[#155dfc]"
                  />
                  <span>
                    I give permission for VRA Cricket Club to use and store my
                    personal data for membership administration and related
                    communication, in accordance with the privacy policy.
                  </span>
                </label>
                {errors.dataUsageConsent && (
                  <p className="text-xs text-red-400">
                    {errors.dataUsageConsent}
                  </p>
                )}
              </div>

              {submitted && (
                <div className="rounded-lg border border-emerald-400/50 bg-emerald-500/20 backdrop-blur-sm px-4 py-3 text-sm text-emerald-100">
                  Thank you! Your membership application has been submitted. We
                  will contact you shortly with next steps.
                </div>
              )}
            </section>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={() =>
                setCurrentStep((prev) => Math.max(1, prev - 1))
              }
              disabled={currentStep === 1}
              className="inline-flex items-center rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/15 transition-colors"
            >
              Previous
            </button>

            {currentStep < 5 && (
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!isStepComplete(currentStep)}
                className="inline-flex items-center rounded-full bg-linear-to-b from-[#155dfc] to-[#0c3796] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
              >
                Next
              </button>
            )}

            {currentStep === 5 && (
              <button
                type="submit"
                disabled={!isStepComplete(5) || submitting}
                className="inline-flex items-center rounded-full bg-linear-to-b from-[#155dfc] to-[#0c3796] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
