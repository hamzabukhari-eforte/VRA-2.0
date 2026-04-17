import { redirect } from "next/navigation";
import { getAuthenticatedMember } from "@/lib/member-auth";
import { getMemberProfileSnapshot } from "@/lib/member-profile";
import { ProfilePortal } from "./components/ProfilePortal";

export default async function ProfilePage() {
  const member = await getAuthenticatedMember();
  if (!member) {
    redirect("/login");
  }

  const snapshot = await getMemberProfileSnapshot(member.id);
  if (!snapshot) {
    redirect("/login");
  }

  return <ProfilePortal initialSnapshot={snapshot} />;
}
