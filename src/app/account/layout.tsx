import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { getProfile, getSession } from "@/lib/account/queries";
import { signOut } from "@/app/actions/auth";
import { SignInForm } from "@/components/AccountForms";
import { AccountNav } from "@/components/account/AccountNav";

export const metadata: Metadata = {
  title: { default: "Account", template: "%s · Account · Made to Disappear" },
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12">
      <Suspense fallback={<Skeleton />}>
        <Shell>{children}</Shell>
      </Suspense>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mt-8" aria-busy="true" aria-label="Loading account">
      <div className="skeleton h-20" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr] lg:gap-10">
        <div className="skeleton h-10 lg:h-56" />
        <div className="skeleton h-72" />
      </div>
    </div>
  );
}

async function Shell({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    return (
      <div className="mt-8">
        <div className="border-b border-line pb-6">
          <p className="t-label text-forest">Account</p>
          <h1 className="t-page mt-2">Sign in</h1>
        </div>
        {children}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-[20px] bg-white p-6">
            <h2 className="t-card">Email me a sign-in link</h2>
            <p className="mt-1 text-sm text-soil/70">No password. Orders placed with this email appear automatically.</p>
            <div className="mt-4">
              <SignInForm />
            </div>
          </div>
          <div className="rounded-[20px] bg-white p-6 text-sm text-soil/80">
            <h2 className="t-heading">For cafés, hotels and caterers</h2>
            <ul className="mt-3 space-y-2">
              <li>Reorder your usual in one click.</li>
              <li>Every past order with its receipt, ready to reorder.</li>
              <li>Saved delivery addresses and notes for the courier.</li>
              <li>Tracking details once a parcel is on its way.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const profile = await getProfile(session);
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="t-label text-forest">Account</p>
          <h1 className="t-page mt-2">{profile?.company || "Your account"}</h1>
          <p className="mt-1 text-sm text-soil/70">
            {profile?.contact_name ? `${profile.contact_name} · ` : null}
            {session.user.email}
          </p>
        </div>
        <form action={signOut} aria-label="Sign out">
          <button type="submit" className="btn btn-outline btn-sm">
            Sign out
          </button>
        </form>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr] lg:gap-10">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
