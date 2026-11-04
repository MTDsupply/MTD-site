import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { getAdminSession, adminEmails } from "@/lib/admin";
import { getSession } from "@/lib/account/queries";
import { SignInForm } from "@/components/AccountForms";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: { default: "Team", template: "%s · Team · Made to Disappear" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12">
      <Suspense fallback={<div className="skeleton mt-8 h-72" aria-busy="true" aria-label="Loading" />}>
        <Shell>{children}</Shell>
      </Suspense>
    </div>
  );
}

async function Shell({ children }: { children: ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) {
    const session = await getSession();
    return (
      <div className="mt-8 max-w-xl">
        <p className="t-label text-forest">Team</p>
        <h1 className="t-page mt-2">Sign in to the team view</h1>
        {session ? (
          <p className="mt-4 rounded-[16px] bg-peach-light p-4 text-sm">
            {session.user.email} is signed in but is not on the team list.{" "}
            {adminEmails().length === 0 ? "Set ADMIN_EMAILS in the Vercel project to a comma-separated list of team addresses." : "Ask for the address to be added to ADMIN_EMAILS."}{" "}
            <Link href="/account" className="link">
              Go to your account
            </Link>
            .
          </p>
        ) : (
          <div className="mt-5 rounded-[20px] bg-white p-6">
            <p className="text-sm text-soil/70">Use the team email. The link signs you in and brings you back here.</p>
            <div className="mt-4">
              <SignInForm next="/admin" />
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="t-label text-forest">Team</p>
          <h1 className="t-page mt-2">Orders, requests and stock</h1>
          <p className="mt-1 text-sm text-soil/70">{admin.session.user.email}</p>
        </div>
        <Link href="/account" className="btn btn-outline btn-sm">
          Your account
        </Link>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr] lg:gap-10">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
