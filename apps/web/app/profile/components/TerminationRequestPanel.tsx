"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MemberProfileSnapshot } from "@/lib/member-profile";
import { membershipCodeToTerminationLabel, splitFullName } from "@/lib/member-profile";

const muted = "text-sm text-muted-foreground";
const field =
  "border-border bg-background text-foreground dark:text-white placeholder:text-muted-foreground";

const terminationReasonOptions = [
  "Moving",
  "Decease",
  "Financial",
  "Injury",
  "No time",
  "Dissatisfied",
];

type TerminationForm = {
  email: string;
  terminationFor: "myself";
  firstName: string;
  lastName: string;
  dob: string;
  membershipType: string;
  terminationReason: string;
  keepContactData: "yes" | "no" | "";
  comment: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snapshot: MemberProfileSnapshot;
};

const totalSteps = 2;

export function TerminationRequestPanel({ open, onOpenChange, snapshot }: Props) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<TerminationForm>({
    email: "",
    terminationFor: "myself",
    firstName: "",
    lastName: "",
    dob: "",
    membershipType: "",
    terminationReason: "",
    keepContactData: "",
    comment: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const { firstName, lastName } = splitFullName(snapshot.profile.legalName);
    setStep(1);
    setSubmitted(false);
    setErrors({});
    setForm({
      email: snapshot.accountEmail,
      terminationFor: "myself",
      firstName,
      lastName,
      dob: snapshot.profile.dob,
      membershipType: membershipCodeToTerminationLabel(snapshot.submission.membershipType),
      terminationReason: "",
      keepContactData: "",
      comment: "",
    });
  }, [open, snapshot]);

  const progress = Math.round((step / totalSteps) * 100);

  const validateStep1 = () => {
    const next: Record<string, string> = {};
    if (!form.terminationReason) next.terminationReason = "Please select a reason.";
    if (!form.keepContactData) next.keepContactData = "Please choose yes or no.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!form.dob) next.dob = "Date of birth is required.";
    if (!form.membershipType) next.membershipType = "Membership type is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        memberEmail: snapshot.accountEmail,
        memberName: snapshot.profile.legalName,
        memberSubmissionId: snapshot.submission.id,
        source: "member_portal",
      };
      const res = await fetch("/api/submissions/termination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          (data && (typeof data.error === "string" ? data.error : null)) ||
          "Failed to submit termination request.";
        throw new Error(msg);
      }
      setSubmitted(true);
      toast.success("Termination request submitted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-3xl dark:border-white/10 dark:bg-[#141416]">
        <DialogHeader>
          <DialogTitle className="text-foreground dark:text-white">
            Request membership termination
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="space-y-4 py-2">
            <p className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-900 dark:text-green-300 md:text-base">
              Thank you. Your request has been recorded. The club will follow up if needed.
            </p>
            <Button type="button" variant="outline" className="dark:border-white/15" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-white/10">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {step === 1 ? (
              <section className="space-y-4">
                <p className={muted}>
                  We will attach your signed-in account to this request for the admin team.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="term-email">Email</Label>
                  <Input id="term-email" className={field} value={form.email} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term-reason">Reason</Label>
                  <select
                    id="term-reason"
                    className={`flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none ${field}`}
                    value={form.terminationReason}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, terminationReason: e.target.value }));
                      setErrors((er) => ({ ...er, terminationReason: "" }));
                    }}
                  >
                    <option value="">Select reason</option>
                    {terminationReasonOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.terminationReason ? (
                    <p className="text-xs text-destructive">{errors.terminationReason}</p>
                  ) : null}
                </div>
                <div className="space-y-2 rounded-md border border-amber-500/25 bg-amber-500/10 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                  <p className="text-sm text-foreground dark:text-white">
                    May we keep your contact information for communication and statistics, as described on the public
                    termination form?
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center gap-2 text-sm text-foreground dark:text-white">
                      <input
                        type="radio"
                        name="keepContactData"
                        value="yes"
                        checked={form.keepContactData === "yes"}
                        onChange={() => {
                          setForm((f) => ({ ...f, keepContactData: "yes" }));
                          setErrors((er) => ({ ...er, keepContactData: "" }));
                        }}
                        className="border-border accent-blue-600"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground dark:text-white">
                      <input
                        type="radio"
                        name="keepContactData"
                        value="no"
                        checked={form.keepContactData === "no"}
                        onChange={() => {
                          setForm((f) => ({ ...f, keepContactData: "no" }));
                          setErrors((er) => ({ ...er, keepContactData: "" }));
                        }}
                        className="border-border accent-blue-600"
                      />
                      No
                    </label>
                  </div>
                  {errors.keepContactData ? (
                    <p className="text-xs text-destructive">{errors.keepContactData}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term-comment">Comment (optional)</Label>
                  <Textarea
                    id="term-comment"
                    className={field}
                    rows={3}
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                  />
                </div>
              </section>
            ) : (
              <section className="space-y-4">
                <p className={muted}>Confirm the member details we should process with this request.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="term-fn">First name</Label>
                    <Input
                      id="term-fn"
                      className={field}
                      value={form.firstName}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, firstName: e.target.value }));
                        setErrors((er) => ({ ...er, firstName: "" }));
                      }}
                    />
                    {errors.firstName ? <p className="text-xs text-destructive">{errors.firstName}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="term-ln">Last name</Label>
                    <Input
                      id="term-ln"
                      className={field}
                      value={form.lastName}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, lastName: e.target.value }));
                        setErrors((er) => ({ ...er, lastName: "" }));
                      }}
                    />
                    {errors.lastName ? <p className="text-xs text-destructive">{errors.lastName}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="term-dob">Date of birth</Label>
                    <Input
                      id="term-dob"
                      type="date"
                      className={field}
                      value={form.dob}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, dob: e.target.value }));
                        setErrors((er) => ({ ...er, dob: "" }));
                      }}
                    />
                    {errors.dob ? <p className="text-xs text-destructive">{errors.dob}</p> : null}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="term-mt">Membership type</Label>
                    <select
                      id="term-mt"
                      className={`flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none ${field}`}
                      value={form.membershipType}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, membershipType: e.target.value }));
                        setErrors((er) => ({ ...er, membershipType: "" }));
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Senior (18+)">Senior (18+)</option>
                      <option value="Junior">Junior</option>
                      <option value="Non-playing member">Non-playing member</option>
                    </select>
                    {errors.membershipType ? (
                      <p className="text-xs text-destructive">{errors.membershipType}</p>
                    ) : null}
                  </div>
                </div>
              </section>
            )}

            <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-4">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))}>
                  Back
                </Button>
              ) : (
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  type="button"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit request"}
                </Button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
