"use client";

import { AlertCircle, Bell, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import type { MemberProfileSnapshot } from "@/lib/member-profile";
import { membershipTypeLabel, splitFullName } from "@/lib/member-profile";

function initials(name: string): string {
  const { firstName, lastName } = splitFullName(name);
  const a = firstName.trim();
  const b = lastName.trim();
  if (a && b) return `${a[0] ?? ""}${b[0] ?? ""}`.toUpperCase();
  if (a.length >= 2) return a.slice(0, 2).toUpperCase();
  return a ? a[0].toUpperCase() : "?";
}

function statusLabel(status: MemberProfileSnapshot["submission"]["status"]): string {
  switch (status) {
    case "PAID":
      return "Paid";
    case "SUBMITTED":
      return "Submitted";
    default:
      return status;
  }
}

function submissionStatusBadgeClass(status: MemberProfileSnapshot["submission"]["status"]): string {
  switch (status) {
    case "PAID":
      return "border border-green-500/30 bg-green-500/10 text-green-800 dark:text-green-400";
    case "SUBMITTED":
      return "border border-yellow-500/30 bg-yellow-500/10 text-yellow-800 dark:text-yellow-400";
    default:
      return "border border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-400";
  }
}

type Props = {
  snapshot: MemberProfileSnapshot;
  onScrollToProfile: () => void;
  onScrollToQuickActions: () => void;
};

/** Surfaces + typography follow the app theme; colored accents mirror PROFILE_PAGE `MemberOverview`. */
export function ProfileOverview({ snapshot, onScrollToProfile, onScrollToQuickActions }: Props) {
  const { submission, profile, displayName, memberId } = snapshot;
  const typeLabel = membershipTypeLabel(submission.membershipType);
  const notices =
    submission.status === "PAID"
      ? [
          {
            type: "success" as const,
            message: "Your membership is active and in good standing.",
          },
        
        ]
      : [
          {
            type: "warning" as const,
            message: "Your membership is submitted and awaiting payment confirmation.",
          },
          {
            type: "info" as const,
            message: "Please complete payment to activate all member benefits and keep portal access in sync.",
          },
        ];

  const noticeClass = (type: "success" | "warning" | "info") => {
    if (type === "success") {
      return "border-green-500/30 bg-green-500/10 text-green-800 dark:text-green-300";
    }
    if (type === "warning") {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300";
    }
    return "border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300";
  };

  return (
    <section className="w-full bg-transparent">
      <Container className="px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-xl border border-border bg-linear-to-br from-zinc-50 via-zinc-100 to-zinc-50 p-6 shadow-2xl dark:border-white/8 dark:from-[#1a1a1d] dark:via-[#161618] dark:to-[#141416] md:p-8"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-xl font-semibold text-white shadow-lg">
                  {initials(displayName || profile.legalName)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-semibold text-foreground dark:text-white">{displayName}</h3>
                  <p className="text-sm text-muted-foreground">Member ID: {memberId}</p>
                </div>
              </div>

              <div className="mb-5 flex flex-wrap gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium capitalize ${submissionStatusBadgeClass(submission.status)}`}
                >
                  {submission.status === "PAID" ? (
                    <CheckCircle2 className="size-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden />
                  ) : submission.status === "SUBMITTED" ? (
                    <Clock className="size-4 shrink-0 text-yellow-700 dark:text-yellow-400" aria-hidden />
                  ) : (
                    <Clock className="size-4 shrink-0 text-zinc-500" aria-hidden />
                  )}
                  {statusLabel(submission.status)}
                </span>
                <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-800 dark:text-purple-400">
                  {typeLabel}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-zinc-300">
                  <Bell className="size-4 text-zinc-600 dark:text-zinc-300" aria-hidden />
                  Important notices
                </h4>
                {notices.map((notice, index) => (
                  <motion.div
                    key={`${notice.type}-${index}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className={`rounded-lg border p-3 text-sm ${noticeClass(notice.type)}`}
                  >
                    {notice.message}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full shrink-0 md:w-80">
              <div className="rounded-xl border border-border bg-background/80 p-5 shadow-xl dark:border-white/10 dark:bg-[#1f1f23]">
                <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground dark:text-white">
                  <AlertCircle className="size-5 text-blue-500 dark:text-blue-400" aria-hidden />
                  Next Actions
                </h4>
                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={onScrollToProfile}
                    className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Update contact details
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onScrollToQuickActions}
                    className="w-full justify-start border-border dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
                  >
                    Quick actions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
