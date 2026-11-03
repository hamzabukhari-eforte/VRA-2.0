"use client";

import { useCallback, useState } from "react";
import { Container } from "@/components/Container";
import type { MemberProfileSnapshot } from "@/lib/member-profile";
import { MembershipSummaryPanel } from "./MembershipSummaryPanel";
import { ProfileManagementPanel } from "./ProfileManagementPanel";
import { ProfileOverview } from "./ProfileOverview";
import { QuickActionsPanel } from "./QuickActionsPanel";

export function ProfilePortal({ initialSnapshot }: { initialSnapshot: MemberProfileSnapshot }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  const scrollToProfile = useCallback(() => {
    document.getElementById("profile-management")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const scrollToQuickActions = useCallback(() => {
    document.getElementById("quick-actions")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-background pt-[72px] text-foreground sm:pt-[84px] md:pt-[100px]">
      <ProfileOverview
        snapshot={snapshot}
        onScrollToProfile={scrollToProfile}
        onScrollToQuickActions={scrollToQuickActions}
      />

      <main className="pb-16 pt-8 md:pt-10">
        <Container className="space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
            <ProfileManagementPanel snapshot={snapshot} onSnapshotUpdated={setSnapshot} />
            <MembershipSummaryPanel snapshot={snapshot} />
          </div>

          <QuickActionsPanel onUpdateDetails={scrollToProfile} />
        </Container>
      </main>
    </div>
  );
}
