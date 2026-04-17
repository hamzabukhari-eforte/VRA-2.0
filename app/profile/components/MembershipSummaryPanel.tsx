"use client";

import Link from "next/link";
import { Calendar, CheckCircle2, Clock, CreditCard, FileText } from "lucide-react";
import { motion } from "framer-motion";
import type { MemberProfileSnapshot } from "@/lib/member-profile";
import { membershipTypeLabel } from "@/lib/member-profile";

const sectionTitle = "text-xl md:text-3xl font-medium text-foreground dark:text-white";
const muted = "text-sm md:text-lg text-muted-foreground";
const body = "text-sm md:text-lg font-normal text-foreground dark:text-white";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/** Timeline accents mirror PROFILE_PAGE `MembershipSection` (blue / purple / gradient spine). */
export function MembershipSummaryPanel({ snapshot }: { snapshot: MemberProfileSnapshot }) {
  const { submission } = snapshot;
  const paid = submission.status === "PAID";
  const hasAccess = Boolean(submission.credentialsSentAt);

  const steps = [
    {
      key: "apply",
      title: "Application received",
      date: submission.createdAt,
      done: true,
      dotClass: "bg-blue-500 text-white",
      icon: <CheckCircle2 className="size-6" aria-hidden />,
      panelClass:
        "border-border bg-muted/40 dark:border-white/10 dark:bg-[#1a1a1d]",
      badge: (
        <span className="mt-2 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-400">
          {membershipTypeLabel(submission.membershipType)}
        </span>
      ),
    },
    {
      key: "pay",
      title: "Membership paid",
      date: submission.paidAt,
      done: paid,
      dotClass: paid ? "bg-purple-500 text-white" : "bg-zinc-400 text-white dark:bg-gray-600",
      icon: <Clock className="size-6" aria-hidden />,
      panelClass: paid
        ? "border-purple-500/30 bg-purple-500/5 dark:border-purple-500/30 dark:bg-[#1a1a1d]"
        : "border-border bg-muted/40 dark:border-white/10 dark:bg-[#1a1a1d]",
      badge: paid ? (
        <p className="mt-2 text-sm text-green-700 dark:text-green-400">
          Payment recorded — membership is active with the club.
        </p>
      ) : (
        <p className={`mt-2 text-sm ${muted}`}>Pending payment confirmation from the club.</p>
      ),
    },
    {
      key: "access",
      title: "Portal access",
      date: submission.credentialsSentAt,
      done: hasAccess,
      dotClass: hasAccess ? "bg-green-500 text-white" : "bg-zinc-400 text-white dark:bg-gray-600",
      icon: <CheckCircle2 className="size-6" aria-hidden />,
      panelClass: "border-border bg-muted/40 dark:border-white/10 dark:bg-[#1a1a1d]",
      badge: hasAccess ? null : (
        <p className={`mt-2 text-sm ${muted}`}>
          You can use this portal once credentials have been sent after payment.
        </p>
      ),
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl dark:border-white/[0.08] dark:bg-[#141416] md:p-6">
      <h2 className={`${sectionTitle} flex items-center gap-2`}>
        <CreditCard className="size-7 shrink-0 text-blue-500 dark:text-blue-400" aria-hidden />
        Membership
      </h2>
      <p className={`mt-2 ${muted}`}>
        {membershipTypeLabel(submission.membershipType)} — milestones on your membership journey.
      </p>

      <div className="relative mt-8">
        <div className="absolute bottom-8 left-6 top-8 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-zinc-400 dark:to-gray-600" aria-hidden />

        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
              className="relative flex items-start gap-4"
            >
              <div
                className={`relative z-1 flex size-12 shrink-0 items-center justify-center rounded-full shadow-lg ${step.dotClass}`}
              >
                {step.icon}
              </div>
              <div className={`min-w-0 flex-1 rounded-lg border p-4 shadow-lg ${step.panelClass}`}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground dark:text-white">{step.title}</h3>
                  <Calendar className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                </div>
                {step.date ? <p className={`text-sm ${muted}`}>{formatDate(step.date)}</p> : null}
                {step.badge}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">

          <p className={`text-sm md:text-base ${muted}`}>
            Renew or change your membership type via a new application; the office will reconcile your record.
          </p>
        </div>
        <Link
          href="/membership-application"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
        >
          Open application
        </Link>
      </div>
    </section>
  );
}
