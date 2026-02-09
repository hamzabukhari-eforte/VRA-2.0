"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";

type TerminationFor = "myself" | "somebodyElse" | "";

interface TerminationForm {
  email: string;
  terminationFor: TerminationFor;

  // If somebody else
  requestorFirstName: string;
  requestorLastName: string;
  requestorPhone: string;

  // If myself
  firstName: string;
  lastName: string;
  dob: string;
  membershipType: string;
  terminationReason: string;
  keepContactData: string; // "yes" | "no" | ""
  comment: string;
}

const initialForm: TerminationForm = {
  email: "",
  terminationFor: "",

  requestorFirstName: "",
  requestorLastName: "",
  requestorPhone: "",

  firstName: "",
  lastName: "",
  dob: "",
  membershipType: "",
  terminationReason: "",
  keepContactData: "",
  comment: "",
};

const membershipTypeOptions = [
  "Senior (18+)",
  "Junior",
  "Non-playing member",
];

const terminationReasonOptions = [
  "Moving",
  "Decease",
  "Financial",
  "Injury",
  "No time",
  "Dissatisfied",
];

const totalSteps = 2;

export default function MembershipTerminationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<TerminationForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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
    setForm((prev) => ({ ...prev, [name]: newValue }));
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

  const isStepComplete = (step: number): boolean => {
    if (step === 1) {
      const emailValid =
        form.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      return !!emailValid && !!form.terminationFor;
    }
    if (step === 2) {
      if (form.terminationFor === "somebodyElse") {
        return (
          !!form.requestorFirstName.trim() &&
          !!form.requestorLastName.trim() &&
          !!form.requestorPhone.trim()
        );
      }
      if (form.terminationFor === "myself") {
        return (
          !!form.firstName.trim() &&
          !!form.lastName.trim() &&
          !!form.dob &&
          !!form.membershipType &&
          !!form.terminationReason &&
          !!form.keepContactData
        );
      }
      return false;
    }
    return false;
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!form.email.trim()) newErrors.email = "Email is required.";
      else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
          newErrors.email = "Please enter a valid email address.";
        }
      }
      if (!form.terminationFor) {
        newErrors.terminationFor =
          "Please select who this termination request is for.";
      }
    }

    if (step === 2) {
      if (form.terminationFor === "somebodyElse") {
        if (!form.requestorFirstName.trim())
          newErrors.requestorFirstName = "Requestor first name is required.";
        if (!form.requestorLastName.trim())
          newErrors.requestorLastName = "Requestor last name is required.";
        if (!form.requestorPhone.trim())
          newErrors.requestorPhone =
            "Requestor primary phone number is required.";
      }
      if (form.terminationFor === "myself") {
        if (!form.firstName.trim())
          newErrors.firstName = "First name is required.";
        if (!form.lastName.trim())
          newErrors.lastName = "Last name is required.";
        if (!form.dob) newErrors.dob = "Date of birth is required.";
        if (!form.membershipType)
          newErrors.membershipType = "Membership type is required.";
        if (!form.terminationReason)
          newErrors.terminationReason =
            "Please select a reason for your termination request.";
        if (!form.keepContactData) {
          newErrors.keepContactData =
            "Please indicate whether we may keep your contact information.";
        }
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setSubmitted(true);
    console.log("Membership termination submitted:", form);
  };

  const steps = [
    { number: 1, title: "Request details" },
    { number: 2, title: "Member information" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pt-[76px] sm:pt-[88px] md:pt-[104px] pb-10 md:pb-16">
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
            Membership termination
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            Submit a request to cancel your VRA membership.
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
                            currentStep > step.number ? "100%" : "0%",
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
          className="membership-termination-form space-y-8 rounded-2xl p-4 md:p-8 shadow-xl border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-xl"
        >
          {/* Section 1 */}
          {currentStep === 1 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Request details
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Tell us who this termination request is for.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                    Termination request for
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <select
                    name="terminationFor"
                    value={form.terminationFor}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc] [&_option]:bg-gray-900 [&_option]:text-white"
                  >
                    <option value="">Select</option>
                    <option value="myself">Myself</option>
                    <option value="somebodyElse">Somebody else</option>
                  </select>
                  {errors.terminationFor && (
                    <p className="text-xs text-red-400">
                      {errors.terminationFor}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section 2 - Somebody else */}
          {currentStep === 2 && form.terminationFor === "somebodyElse" && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Requestor information
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  First and last name of the person submitting this request, and
                  their primary phone number.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    First name of requestor
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="requestorFirstName"
                    value={form.requestorFirstName}
                    onChange={handleChange}
                    placeholder="e.g. John"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.requestorFirstName && (
                    <p className="text-xs text-red-400">
                      {errors.requestorFirstName}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Last name of requestor
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="requestorLastName"
                    value={form.requestorLastName}
                    onChange={handleChange}
                    placeholder="e.g. Smith"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.requestorLastName && (
                    <p className="text-xs text-red-400">
                      {errors.requestorLastName}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Primary phone number of requestor
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="tel"
                    name="requestorPhone"
                    value={form.requestorPhone}
                    onChange={handleChange}
                    placeholder="e.g. +31 6 12345678"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.requestorPhone && (
                    <p className="text-xs text-red-400">
                      {errors.requestorPhone}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section 2 - Myself */}
          {currentStep === 2 && form.terminationFor === "myself" && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Member information
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Your details and reason for termination.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    First name<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="e.g. John"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-400">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Last name<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Smith"
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-400">{errors.lastName}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Date of birth<span className="text-red-400 ml-0.5">*</span>
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
                    Membership type
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <select
                    name="membershipType"
                    value={form.membershipType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc] [&_option]:bg-gray-900 [&_option]:text-white"
                  >
                    <option value="">Select membership type</option>
                    {membershipTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.membershipType && (
                    <p className="text-xs text-red-400">
                      {errors.membershipType}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Reason for your termination request
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <select
                    name="terminationReason"
                    value={form.terminationReason}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc] [&_option]:bg-gray-900 [&_option]:text-white"
                  >
                    <option value="">Select reason</option>
                    {terminationReasonOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.terminationReason && (
                    <p className="text-xs text-red-400">
                      {errors.terminationReason}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 rounded-r-lg border-l-4 border-amber-400/80 bg-amber-500/10 py-3 pl-4 pr-3 text-sm text-gray-200">
                <p>
                  For communication purposes we would like to keep your contact
                  information; we also collect statistics and photographs that
                  can contain your data. Select &quot;Yes&quot; if you agree,
                  &quot;No&quot; if you don&apos;t want us to keep your data.
                </p>
                <p className="text-amber-200/90 text-xs font-medium">
                  NOTE: Tax regulations mandate us to keep financial records for
                  7 years.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-200">
                  May we keep your contact information (and related data as
                  described above)?
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="keepContactData"
                      value="yes"
                      checked={form.keepContactData === "yes"}
                      onChange={handleChange}
                      className="border-white/50 text-[#155dfc] accent-[#155dfc]"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="keepContactData"
                      value="no"
                      checked={form.keepContactData === "no"}
                      onChange={handleChange}
                      className="border-white/50 text-[#155dfc] accent-[#155dfc]"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
                {errors.keepContactData && (
                  <p className="text-xs text-red-400">
                    {errors.keepContactData}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-200">
                  Comment
                </label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any additional comments (optional)"
                  className="w-full rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                />
              </div>
            </section>
          )}

          {submitted && (
            <div className="rounded-lg border border-emerald-400/50 bg-emerald-500/20 backdrop-blur-sm px-4 py-3 text-sm text-emerald-100">
              Thank you. Your membership termination request has been submitted.
              We will process it and contact you if needed.
            </div>
          )}

          {/* Navigation */}
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

            {currentStep < 2 && (
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!isStepComplete(currentStep)}
                className="inline-flex items-center rounded-full bg-linear-to-b from-[#155dfc] to-[#0c3796] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
              >
                Next
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="submit"
                disabled={!isStepComplete(2)}
                className="inline-flex items-center rounded-full bg-linear-to-b from-[#155dfc] to-[#0c3796] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
              >
                Submit request
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
