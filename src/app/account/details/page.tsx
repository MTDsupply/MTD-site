import type { Metadata } from "next";
import { Suspense } from "react";
import { getProfile, getSession } from "@/lib/account/queries";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = { title: "Business details" };

export default function DetailsPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <Details />
    </Suspense>
  );
}

async function Details() {
  const s = await getSession();
  if (!s) return null;
  const profile = await getProfile(s);
  return (
    <div>
      <h2 className="t-heading">Business details</h2>
      <p className="mt-1 text-sm text-soil/70">Who we are supplying and who to call if a delivery needs a hand. The name here appears at the top of your account.</p>
      <div className="mt-4 max-w-2xl">
        <ProfileForm profile={profile} email={s.user.email ?? ""} />
      </div>
    </div>
  );
}
