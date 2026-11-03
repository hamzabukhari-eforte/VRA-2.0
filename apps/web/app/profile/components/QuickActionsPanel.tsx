"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { HelpCircle, KeyRound, RefreshCw, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const title = "text-xl md:text-3xl font-medium text-foreground dark:text-white";

type Props = {
  onUpdateDetails: () => void;
};

/** Matches PROFILE_PAGE `MemberPortal` quick actions: blue / green / purple icons; red emphasis on termination. */
export function QuickActionsPanel({ onUpdateDetails }: Props) {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const clearPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submittingPassword) return;

    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.error("Current and new password are required.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setSubmittingPassword(true);
    try {
      const response = await fetch("/api/auth/member/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((data && data.error) || "Failed to update password.");
      }
      toast.success("Password updated successfully.");
      clearPasswordForm();
      setPasswordDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update password.");
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <>
      <motion.section
        id="quick-actions"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="rounded-xl border border-border bg-card p-5 shadow-xl dark:border-white/8 dark:bg-[#141416] md:p-6"
      >
        <h2 className={title}>Quick actions</h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              type="button"
              onClick={onUpdateDetails}
              className="flex h-auto w-full flex-col gap-2 rounded-lg border border-border bg-transparent px-4 py-5 text-center transition-colors hover:bg-muted/60 dark:border-white/10 dark:hover:bg-white/5 dark:hover:border-white/20"
            >
              <RefreshCw className="mx-auto size-6 text-blue-500 dark:text-blue-400" aria-hidden />
              <span className="text-sm font-medium text-foreground dark:text-gray-200">Update details</span>
              <span className="text-xs text-muted-foreground">Jump to editable sections</span>
            </button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              type="button"
              onClick={() => setPasswordDialogOpen(true)}
              className="flex h-auto w-full flex-col gap-2 rounded-lg border border-border bg-transparent px-4 py-5 text-center transition-colors hover:bg-muted/60 dark:border-white/10 dark:hover:bg-white/5 dark:hover:border-white/20"
            >
              <KeyRound className="mx-auto size-6 text-amber-500 dark:text-amber-400" aria-hidden />
              <span className="text-sm font-medium text-foreground dark:text-gray-200">Reset password</span>
              <span className="text-xs text-muted-foreground">Change your login password</span>
            </button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/membership-application"
              className="flex h-auto w-full flex-col gap-2 rounded-lg border border-border bg-transparent px-4 py-5 text-center transition-colors hover:bg-muted/60 dark:border-white/10 dark:hover:bg-white/5 dark:hover:border-white/20"
            >
              <RefreshCw className="mx-auto size-6 text-green-500 dark:text-green-400" aria-hidden />
              <span className="text-sm font-medium text-foreground dark:text-gray-200">Renew membership</span>
              <span className="text-xs text-muted-foreground">Start an application</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/contact"
              className="flex h-auto w-full flex-col gap-2 rounded-lg border border-border bg-transparent px-4 py-5 text-center transition-colors hover:bg-muted/60 dark:border-white/10 dark:hover:bg-white/5 dark:hover:border-white/20"
            >
              <HelpCircle className="mx-auto size-6 text-purple-500 dark:text-purple-400" aria-hidden />
              <span className="text-sm font-medium text-foreground dark:text-gray-200">Request support</span>
              <span className="text-xs text-muted-foreground">Contact the club</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/membership-termination"
              className="flex h-auto w-full flex-col gap-2 rounded-lg border border-red-500/25 bg-transparent px-4 py-5 text-center transition-colors hover:bg-red-500/10 dark:border-red-500/20 dark:hover:border-red-500/30"
            >
              <UserX className="mx-auto size-6 text-red-500 dark:text-red-400" aria-hidden />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Request termination</span>
              <span className="text-xs text-muted-foreground">Open termination page</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Dialog
        open={passwordDialogOpen}
        onOpenChange={(open) => {
          setPasswordDialogOpen(open);
          if (!open) clearPasswordForm();
        }}
      >
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-white">Reset password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={submittingPassword}>
                {submittingPassword ? "Updating..." : "Update password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
