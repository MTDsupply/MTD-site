import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdminSession, type SignupRow } from "@/lib/admin";
import { formatDate } from "@/lib/account/queries";

export const metadata: Metadata = { title: "Sign-ups" };

export default function AdminSignupsPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <Signups />
    </Suspense>
  );
}

async function Signups() {
  const admin = await getAdminSession();
  if (!admin) return null;
  const { data } = await admin.db.from("notify").select("*").order("created_at", { ascending: false }).limit(500);
  const rows = (data ?? []) as SignupRow[];
  const emails = [...new Set(rows.map((r) => r.email))];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="t-heading text-forest">New product alert sign-ups ({emails.length})</h2>
        {emails.length ? (
          <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(["email,category,created_at", ...rows.map((r) => `${r.email},${r.category_slug},${r.created_at}`)].join("\n"))}`} download="signups.csv" className="btn btn-outline btn-sm">
            Download CSV
          </a>
        ) : null}
      </div>
      {rows.length === 0 ? <p className="mt-3 rounded-[16px] bg-mint-light p-4 text-sm text-forest">No sign-ups yet.</p> : null}
      {rows.length ? (
        <div className="mt-4 overflow-x-auto rounded-[20px] bg-white">
          <table className="price-table w-full text-sm">
            <thead>
              <tr>
                <th>Email</th>
                <th>Category</th>
                <th>Signed up</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.email}</td>
                  <td>{r.category_slug}</td>
                  <td className="tnum">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
