"use client";

import { useState } from "react";
import Image from "next/image";

export default function MembershipApplicationPage() {
  const [currentStep, setCurrentStep] = useState(5); // Start at step 5 to show the payment step
  const [selectedVolunteerAreas, setSelectedVolunteerAreas] = useState<
    string[]
  >([]);

  const toggleVolunteerArea = (area: string) => {
    setSelectedVolunteerAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };
  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: "Basic Information", subtitle: "Personal details" },
    { number: 2, title: "Skills & Experience", subtitle: "Cricket background" },
    { number: 3, title: "Volunteering", subtitle: "Club involvement" },
    { number: 4, title: "Payment", subtitle: "Complete registration" },
    { number: 5, title: "Review & Submit", subtitle: "Confirm details" },
  ];

  return (
    <div className="min-h-screen bg-[#202020] text-white">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-white text-2xl font-bold">VRA</div>
            <div className="flex flex-col">
              <div className="text-white text-sm font-medium">Cricket Club</div>
              <div className="text-gray-400 text-xs">Member Portal</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Image
                src="/assets/542-21304.svg"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-white text-sm font-medium">Membership</span>
            </button>
            <button className="px-4 py-2 bg-transparent rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors">
              <Image
                src="/assets/542-21361.svg"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-white text-sm font-medium">Shop</span>
            </button>
            <button className="px-4 py-2 bg-transparent rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors">
              <Image
                src="/assets/542-21382.svg"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-white text-sm font-medium">My Profile</span>
            </button>
            <button className="px-4 py-2 bg-transparent rounded-lg flex items-center gap-2 text-red-400 hover:bg-white/5 transition-colors">
              <Image
                src="/assets/542-21392.svg"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-8 py-12">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-white text-4xl font-semibold mb-2">
              Membership Application
            </h1>
            <p className="text-gray-400 text-lg">
              Join our cricket club community
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-b from-[#141414] to-black rounded-full border border-white/10 flex items-center gap-2 hover:bg-[#2D2D2D] transition-colors">
            <Image
              src="/assets/542-21718.svg"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-white text-sm font-medium">
              Save Progress
            </span>
          </button>
        </div>

        {/* Progress Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-gray-400 text-sm">
              {progressPercentage}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-[#030213]/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#167a2b] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-start justify-between mb-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center gap-3 flex-1"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-colors ${
                  step.number < currentStep
                    ? "bg-[#00c950] text-white"
                    : step.number === currentStep
                    ? "bg-[#2b7fff] text-white"
                    : "bg-zinc-700 text-gray-500 opacity-50"
                }`}
              >
                {step.number < currentStep ? (
                  <Image
                    src="/assets/542-21735.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                ) : (
                  step.number
                )}
              </div>
              <div className="text-center">
                <div
                  className={`text-sm font-normal ${
                    step.number === currentStep
                      ? "text-white"
                      : "text-white opacity-50"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-[#99a1ae]">{step.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-[#1a2332] border border-blue-600/30 rounded-lg flex items-start gap-3">
          <Image
            src="/assets/542-21654.svg"
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 mt-0.5"
          />
          <p className="text-gray-300 text-sm">
            <span className="text-red-400">*</span> All fields marked with are
            required. You can save your progress at any time and continue later.
          </p>
        </div>

        {/* Step 5 Content: Payment */}
        {currentStep === 5 && (
          <div className="bg-[#272727] rounded-xl p-8">
            <div className="mb-8">
              <h2 className="text-white text-2xl font-semibold mb-2">
                Payment
              </h2>
              <p className="text-[#99a1ae] text-sm">
                Complete your membership registration
              </p>
            </div>

            {/* Membership Card */}
            <div className="p-8 bg-[#1a2332] border-2 border-[#2b7fff]/30 rounded-xl mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Senior Membership
                  </h3>
                  <p className="text-[#99a1ae] text-sm">2024-25 Season</p>
                </div>
                <div className="text-right">
                  <p className="text-[#99a1ae] text-sm mb-1">Total Amount</p>
                  <p className="text-[#2b7fff] text-4xl font-bold">€250</p>
                  <p className="text-[#99a1ae] text-sm">per year</p>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-white text-sm">
                    Full playing rights
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-white text-sm">
                    Club facilities access
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-white text-sm">
                    Match participation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-white text-sm">Voting rights</span>
                </div>
              </div>
            </div>

            {/* Payment Method Section - Placeholder */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">
                Payment Method
              </h3>
              <div className="p-6 bg-[#2d2d2d] border border-white/10 rounded-xl">
                <p className="text-[#99a1ae] text-sm text-center py-8">
                  Payment integration will be configured here.
                  <br />
                  (Stripe, PayPal, or other payment gateway)
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 bg-transparent border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <Image
                  src="/assets/542-21809.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 rotate-180"
                />
                Back
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Complete Payment
                <Image
                  src="/assets/542-21809.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 Content: Review & Submit */}
        {currentStep === 4 && (
          <div className="bg-[#272727] rounded-xl p-8">
            <div className="mb-8">
              <h2 className="text-white text-2xl font-semibold mb-2">
                Review Your Information
              </h2>
              <p className="text-[#99a1ae] text-sm">
                Please review all information before proceeding to payment
              </p>
            </div>

            {/* Review Instructions */}
            <div className="mb-8 p-4 bg-[#2b7fff]/10 border-2 border-[#2b7fff]/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Image
                  src="/assets/542-22468.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5 mt-0.5"
                />
                <div>
                  <h3 className="text-white text-base font-semibold mb-2">
                    Review Your Details
                  </h3>
                  <p className="text-[#bddaff] text-sm">
                    Please review all the information below. You can edit any
                    section by clicking the &quot;Edit&quot; button. Once
                    confirmed, proceed to payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Sections */}
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="p-6 bg-[#2d2d2d] border border-white/10 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/542-22532.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <h3 className="text-white text-lg font-semibold">
                      Basic Information
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 bg-transparent border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <Image
                      src="/assets/542-22536.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#99a1ae] mb-1">Full Name</p>
                    <p className="text-white">John Doe</p>
                  </div>
                  <div>
                    <p className="text-[#99a1ae] mb-1">Email</p>
                    <p className="text-white">john.doe@example.com</p>
                  </div>
                  <div>
                    <p className="text-[#99a1ae] mb-1">Phone Number</p>
                    <p className="text-white">+31 6 12345678</p>
                  </div>
                  <div>
                    <p className="text-[#99a1ae] mb-1">Date of Birth</p>
                    <p className="text-white">01/01/1990</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[#99a1ae] mb-1">Address</p>
                    <p className="text-white">
                      123 Cricket Street, Amsterdam, Netherlands
                    </p>
                  </div>
                  <div>
                    <p className="text-[#99a1ae] mb-1">Nationality</p>
                    <p className="text-white">Dutch</p>
                  </div>
                  <div>
                    <p className="text-[#99a1ae] mb-1">Gender</p>
                    <p className="text-white">Male</p>
                  </div>
                </div>
              </div>

              {/* Skills & Experience Section */}
              <div className="p-6 bg-[#2d2d2d] border border-white/10 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/542-22555.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <h3 className="text-white text-lg font-semibold">
                      Skills & Experience
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-transparent border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <Image
                      src="/assets/542-22559.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#99a1ae] mb-1">
                      Coaching Qualifications
                    </p>
                    <p className="text-white">ECB Level 1</p>
                  </div>
                  <div>
                    <p className="text-[#99a1ae] mb-1">Years of Experience</p>
                    <p className="text-white">6-10 years</p>
                  </div>
                  <div>
                    <p className="text-[#99a1ae] mb-1">Highest Level Played</p>
                    <p className="text-white">Club</p>
                  </div>
                  <div>
                    <p className="text-[#99a1ae] mb-1">Primary Role</p>
                    <p className="text-white">All-rounder</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[#99a1ae] mb-1">Additional Skills</p>
                    <p className="text-white">
                      Strong fielding, good team player
                    </p>
                  </div>
                </div>
              </div>

              {/* Volunteering Section */}
              <div className="p-6 bg-[#2d2d2d] border border-white/10 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/542-22578.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <h3 className="text-white text-lg font-semibold">
                      Volunteering
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 bg-transparent border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <Image
                      src="/assets/542-22582.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    Edit
                  </button>
                </div>
                <div>
                  <p className="text-[#99a1ae] mb-2 text-sm">Selected Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteerAreas.length > 0 ? (
                      selectedVolunteerAreas.map((area) => (
                        <span
                          key={area}
                          className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full text-blue-400 text-sm"
                        >
                          {area.charAt(0).toUpperCase() + area.slice(1)}
                        </span>
                      ))
                    ) : (
                      <p className="text-white text-sm">
                        Coaching, Scoring, Event Management
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-transparent border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <Image
                  src="/assets/542-21809.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 rotate-180"
                />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Proceed to Payment
                <Image
                  src="/assets/542-21809.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 Content: Volunteering */}
        {currentStep === 3 && (
          <div className="bg-[#272727] rounded-xl p-8">
            <div className="mb-8">
              <h2 className="text-white text-2xl font-semibold mb-2">
                Volunteering
              </h2>
              <p className="text-[#99a1ae] text-sm">
                Help us build a stronger cricket community
              </p>
            </div>

            {/* Volunteer Expectations Alert */}
            <div className="mb-8 p-4 bg-[#ff6900]/10 border-2 border-[#ff6800]/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Image
                  src="/assets/542-22770.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 mt-1"
                />
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Our club is completely dependent on the work of volunteers.
                    That means we expect an extra effort from every member to
                    volunteer work for the club at least 3-4 times a year during
                    the cricket season.
                  </p>
                  <p className="text-[#d0d5db] text-sm">
                    By joining our club, you&apos;re not just signing up to play
                    cricket - you&apos;re becoming part of a community that
                    thrives on mutual support and dedication.
                  </p>
                </div>
              </div>
            </div>

            {/* Capabilities and Interests Section */}
            <div className="p-6 bg-[#272727] border border-white/10 rounded-xl">
              <div className="mb-12">
                <h3 className="text-white text-lg font-semibold mb-2">
                  Your Capabilities and Interests
                </h3>
                <p className="text-[#99a1ae] text-sm">
                  Please check all areas where you can contribute. Your
                  involvement makes a real difference!
                </p>
              </div>

              {/* Volunteer Options Grid */}
              <div className="space-y-0">
                {[
                  {
                    id: "administration",
                    label: "Administration",
                    icon: "542-22785.svg",
                  },
                  { id: "coaching", label: "Coaching", icon: "542-22795.svg" },
                  {
                    id: "ground",
                    label: "Ground/Pitch Maintenance",
                    icon: "542-22805.svg",
                  },
                  { id: "scoring", label: "Scoring", icon: "542-22810.svg" },
                  {
                    id: "transportation",
                    label: "Transportation",
                    icon: "542-22820.svg",
                  },
                  {
                    id: "it",
                    label: "Information Technology",
                    icon: "542-22830.svg",
                  },
                  {
                    id: "wellbeing",
                    label: "Team Well-being",
                    icon: "542-22837.svg",
                  },
                  {
                    id: "events",
                    label: "Event Management",
                    icon: "542-22844.svg",
                  },
                  {
                    id: "marketing",
                    label: "Marketing & Communication",
                    icon: "542-22854.svg",
                  },
                  {
                    id: "fundraising",
                    label: "Fundraising",
                    icon: "542-22859.svg",
                  },
                ].map((area) => (
                  <label
                    key={area.id}
                    className="flex items-center gap-3 px-4 py-4 bg-zinc-700 border-2 border-white/10 cursor-pointer hover:bg-zinc-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedVolunteerAreas.includes(area.id)}
                      onChange={() => toggleVolunteerArea(area.id)}
                      className="w-4 h-4 bg-zinc-700 border border-white/10 rounded"
                    />
                    <Image
                      src={`/assets/${area.icon}`}
                      alt=""
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="flex-1 text-white text-sm font-medium">
                      {area.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-transparent border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <Image
                  src="/assets/542-21809.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 rotate-180"
                />
                Back
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-6 py-3 bg-transparent border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Continue to Next Step
                  <Image
                    src="/assets/542-21809.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 Content: Skills & Experience */}
        {currentStep === 2 && (
          <div className="bg-[#272727] rounded-xl p-8">
            <div className="mb-8">
              <h2 className="text-white text-2xl font-semibold mb-2">
                Skills & Experience
              </h2>
              <p className="text-[#99a1ae] text-sm">
                Tell us about your cricket background and qualifications
              </p>
            </div>

            <form className="space-y-8">
              {/* Cricket Coaching Qualification Section */}
              <div className="p-6 bg-[#1a2e1f] border-2 border-green-600/30 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Image
                    src="/assets/542-21775.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <h3 className="text-white text-lg font-semibold">
                    Cricket Coaching Qualification
                  </h3>
                </div>

                <div className="space-y-4">
                  <label className="block text-white text-sm font-medium mb-2">
                    Do you have any cricket coaching qualifications?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ECB Level 1, ACF Level 2, or 'None'"
                    className="w-full px-4 py-3 bg-[#2D2D2D] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-green-600 transition-colors"
                  />
                  <p className="text-[#99a1ae] text-xs">
                    Please list any coaching certifications, courses, or
                    relevant experience. If none, simply write &apos;None&apos;.
                  </p>
                </div>
              </div>

              {/* Playing Experience Section */}
              <div className="p-6 bg-[#1a1a2e] border-2 border-blue-600/30 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Image
                    src="/assets/542-21795.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <h3 className="text-white text-lg font-semibold">
                    Playing Experience
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Years of cricket experience{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <select className="w-full px-4 py-3 bg-[#2D2D2D] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-600 transition-colors">
                      <option value="">Select years of experience</option>
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Highest level played{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <select className="w-full px-4 py-3 bg-[#2D2D2D] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-600 transition-colors">
                      <option value="">Select highest level</option>
                      <option value="recreational">Recreational</option>
                      <option value="club">Club Level</option>
                      <option value="county">County Level</option>
                      <option value="national">National Level</option>
                      <option value="international">International</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Primary role <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        "Batsman",
                        "Bowler",
                        "All-rounder",
                        "Wicket-keeper",
                        "Fielder",
                        "Other",
                      ].map((role) => (
                        <label
                          key={role}
                          className="flex items-center gap-2 px-4 py-3 bg-[#2D2D2D] border border-white/10 rounded-lg cursor-pointer hover:border-blue-600/50 transition-colors"
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role.toLowerCase()}
                            className="text-blue-600"
                          />
                          <span className="text-white text-sm">{role}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Skills Section */}
              <div className="space-y-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Additional cricket-related skills or achievements
                </label>
                <textarea
                  placeholder="Tell us about any notable achievements, awards, or special skills..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#2D2D2D] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-600 transition-colors resize-none"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-transparent border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <Image
                    src="/assets/542-21809.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 rotate-180"
                  />
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="px-6 py-3 bg-transparent border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    Continue to Next Step
                    <Image
                      src="/assets/542-21809.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* WhatsApp Floating Button */}
      <button className="fixed right-8 bottom-8 w-14 h-14 bg-gradient-to-b from-[#73FF44] to-[#69D346] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
        <Image
          src="/assets/542-21624.svg"
          alt="WhatsApp"
          width={28}
          height={28}
          className="w-7 h-7"
        />
      </button>
    </div>
  );
}
