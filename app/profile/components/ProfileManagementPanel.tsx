"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmergencyContact, GuardianInfo, MemberProfileSnapshot } from "@/lib/member-profile";

const sectionTitle = "text-xl md:text-3xl font-medium text-foreground dark:text-white";
const muted = "text-sm md:text-lg text-muted-foreground";
const field =
  "border-border bg-background text-foreground dark:text-white placeholder:text-muted-foreground";

type Props = {
  snapshot: MemberProfileSnapshot;
  onSnapshotUpdated: (next: MemberProfileSnapshot) => void;
};

async function patchProfile(body: Record<string, unknown>): Promise<MemberProfileSnapshot> {
  const res = await fetch("/api/member/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      (data && (typeof data.error === "string" ? data.error : null)) || "Could not save changes.";
    throw new Error(msg);
  }
  return data as MemberProfileSnapshot;
}

export function ProfileManagementPanel({ snapshot, onSnapshotUpdated }: Props) {
  const [contactEditing, setContactEditing] = useState(false);
  const [emergencyEditing, setEmergencyEditing] = useState(false);
  const [guardianEditing, setGuardianEditing] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const [contactDraft, setContactDraft] = useState({
    displayName: snapshot.displayName,
    phone: snapshot.profile.phone,
    alternatePhone: snapshot.profile.alternatePhone,
    street: snapshot.profile.street,
    houseNumber: snapshot.profile.houseNumber,
    postalCode: snapshot.profile.postalCode,
    city: snapshot.profile.city,
  });

  const [emergencyDraft, setEmergencyDraft] = useState<EmergencyContact>(snapshot.profile.emergencyContact);
  const [guardianDraft, setGuardianDraft] = useState<GuardianInfo>(
    snapshot.profile.guardianInfo ?? { name: "", relationship: "", phone: "", email: "" }
  );

  useEffect(() => {
    if (!contactEditing) {
      setContactDraft({
        displayName: snapshot.displayName,
        phone: snapshot.profile.phone,
        alternatePhone: snapshot.profile.alternatePhone,
        street: snapshot.profile.street,
        houseNumber: snapshot.profile.houseNumber,
        postalCode: snapshot.profile.postalCode,
        city: snapshot.profile.city,
      });
    }
  }, [snapshot, contactEditing]);

  useEffect(() => {
    if (!emergencyEditing) {
      setEmergencyDraft(snapshot.profile.emergencyContact);
    }
  }, [snapshot, emergencyEditing]);

  useEffect(() => {
    if (!guardianEditing) {
      setGuardianDraft(
        snapshot.profile.guardianInfo ?? { name: "", relationship: "", phone: "", email: "" }
      );
    }
  }, [snapshot, guardianEditing]);

  const resetContact = useCallback(() => {
    setContactDraft({
      displayName: snapshot.displayName,
      phone: snapshot.profile.phone,
      alternatePhone: snapshot.profile.alternatePhone,
      street: snapshot.profile.street,
      houseNumber: snapshot.profile.houseNumber,
      postalCode: snapshot.profile.postalCode,
      city: snapshot.profile.city,
    });
  }, [snapshot]);

  const resetEmergency = useCallback(() => {
    setEmergencyDraft(snapshot.profile.emergencyContact);
  }, [snapshot]);

  const resetGuardian = useCallback(() => {
    setGuardianDraft(
      snapshot.profile.guardianInfo ?? { name: "", relationship: "", phone: "", email: "" }
    );
  }, [snapshot]);

  const saveContact = async () => {
    setSaving("contact");
    try {
      const next = await patchProfile({
        displayName: contactDraft.displayName,
        phone: contactDraft.phone,
        alternatePhone: contactDraft.alternatePhone,
        street: contactDraft.street,
        houseNumber: contactDraft.houseNumber,
        postalCode: contactDraft.postalCode,
        city: contactDraft.city,
      });
      onSnapshotUpdated(next);
      setContactEditing(false);
      toast.success("Contact details saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(null);
    }
  };

  const saveEmergency = async () => {
    setSaving("emergency");
    try {
      const next = await patchProfile({
        emergencyContact: emergencyDraft,
      });
      onSnapshotUpdated(next);
      setEmergencyEditing(false);
      toast.success("Emergency contact saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(null);
    }
  };

  const saveGuardian = async () => {
    if (!snapshot.showGuardian) return;
    setSaving("guardian");
    try {
      const next = await patchProfile({
        guardianInfo: guardianDraft,
      });
      onSnapshotUpdated(next);
      setGuardianEditing(false);
      toast.success("Guardian details saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <section
      id="profile-management"
      className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl dark:border-white/[0.08] dark:bg-[#141416] md:p-6"
    >
      <h2 className={sectionTitle}>Profile management</h2>
      <p className={`mt-2 ${muted}`}>
        Update the details we should use for day-to-day contact. Your original application remains on file.
      </p>

      <Accordion type="multiple" defaultValue={["contact"]} className="mt-6 space-y-3">
        <AccordionItem
          value="contact"
          className="overflow-hidden rounded-lg border border-border bg-muted/30 px-4 dark:border-white/10 dark:bg-[#1a1a1d]"
        >
          <AccordionTrigger className="text-foreground hover:no-underline dark:text-white">
            Contact &amp; address
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="displayName">Account display name</Label>
                <Input
                  id="displayName"
                  className={field}
                  value={contactDraft.displayName}
                  onChange={(e) => setContactDraft((d) => ({ ...d, displayName: e.target.value }))}
                  disabled={!contactEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  className={field}
                  value={contactDraft.phone}
                  onChange={(e) => setContactDraft((d) => ({ ...d, phone: e.target.value }))}
                  disabled={!contactEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternatePhone">Alternate phone</Label>
                <Input
                  id="alternatePhone"
                  className={field}
                  value={contactDraft.alternatePhone}
                  onChange={(e) => setContactDraft((d) => ({ ...d, alternatePhone: e.target.value }))}
                  disabled={!contactEditing}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  className={field}
                  value={contactDraft.street}
                  onChange={(e) => setContactDraft((d) => ({ ...d, street: e.target.value }))}
                  disabled={!contactEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="houseNumber">House number</Label>
                <Input
                  id="houseNumber"
                  className={field}
                  value={contactDraft.houseNumber}
                  onChange={(e) => setContactDraft((d) => ({ ...d, houseNumber: e.target.value }))}
                  disabled={!contactEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input
                  id="postalCode"
                  className={field}
                  value={contactDraft.postalCode}
                  onChange={(e) => setContactDraft((d) => ({ ...d, postalCode: e.target.value }))}
                  disabled={!contactEditing}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  className={field}
                  value={contactDraft.city}
                  onChange={(e) => setContactDraft((d) => ({ ...d, city: e.target.value }))}
                  disabled={!contactEditing}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {contactEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
                    onClick={() => {
                      resetContact();
                      setContactEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={saving === "contact"}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={saveContact}
                  >
                    {saving === "contact" ? "Saving…" : "Save"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setContactEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="emergency"
          className="overflow-hidden rounded-lg border border-border bg-muted/30 px-4 dark:border-white/10 dark:bg-[#1a1a1d]"
        >
          <AccordionTrigger className="text-foreground hover:no-underline dark:text-white">
            Emergency contact
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ec-name">Full name</Label>
                <Input
                  id="ec-name"
                  className={field}
                  value={emergencyDraft.name}
                  onChange={(e) => setEmergencyDraft((d) => ({ ...d, name: e.target.value }))}
                  disabled={!emergencyEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ec-rel">Relationship</Label>
                <Input
                  id="ec-rel"
                  className={field}
                  value={emergencyDraft.relationship}
                  onChange={(e) => setEmergencyDraft((d) => ({ ...d, relationship: e.target.value }))}
                  disabled={!emergencyEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ec-phone">Phone</Label>
                <Input
                  id="ec-phone"
                  className={field}
                  value={emergencyDraft.phone}
                  onChange={(e) => setEmergencyDraft((d) => ({ ...d, phone: e.target.value }))}
                  disabled={!emergencyEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ec-alt">Alternate phone</Label>
                <Input
                  id="ec-alt"
                  className={field}
                  value={emergencyDraft.alternatePhone}
                  onChange={(e) => setEmergencyDraft((d) => ({ ...d, alternatePhone: e.target.value }))}
                  disabled={!emergencyEditing}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {emergencyEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
                    onClick={() => {
                      resetEmergency();
                      setEmergencyEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={saving === "emergency"}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={saveEmergency}
                  >
                    {saving === "emergency" ? "Saving…" : "Save"}
                  </Button>
                </>
              ) : (
                <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setEmergencyEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {snapshot.showGuardian ? (
          <AccordionItem
            value="guardian"
            className="overflow-hidden rounded-lg border border-border bg-muted/30 px-4 dark:border-white/10 dark:bg-[#1a1a1d]"
          >
            <AccordionTrigger className="text-foreground hover:no-underline dark:text-white">
              Parent / guardian
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="g-name">Full name</Label>
                  <Input
                    id="g-name"
                    className={field}
                    value={guardianDraft.name}
                    onChange={(e) => setGuardianDraft((d) => ({ ...d, name: e.target.value }))}
                    disabled={!guardianEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="g-rel">Relationship</Label>
                  <Input
                    id="g-rel"
                    className={field}
                    value={guardianDraft.relationship}
                    onChange={(e) => setGuardianDraft((d) => ({ ...d, relationship: e.target.value }))}
                    disabled={!guardianEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="g-phone">Phone</Label>
                  <Input
                    id="g-phone"
                    className={field}
                    value={guardianDraft.phone}
                    onChange={(e) => setGuardianDraft((d) => ({ ...d, phone: e.target.value }))}
                    disabled={!guardianEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="g-email">Email</Label>
                  <Input
                    id="g-email"
                    type="email"
                    className={field}
                    value={guardianDraft.email}
                    onChange={(e) => setGuardianDraft((d) => ({ ...d, email: e.target.value }))}
                    disabled={!guardianEditing}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {guardianEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-border dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
                      onClick={() => {
                        resetGuardian();
                        setGuardianEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      disabled={saving === "guardian"}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={saveGuardian}
                    >
                      {saving === "guardian" ? "Saving…" : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setGuardianEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>
    </section>
  );
}
