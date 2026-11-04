import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdminSession, type QuoteRow } from "@/lib/admin";
import { formatDate } from "@/lib/account/queries";

export const metadata: Metadata = { title: "Quotes" };

export default function AdminQuotesPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <Quotes />
    </Suspense>
  );
}

async function Quotes() {
  const admin = await getAdminSession();
  if (!admin) return null;
  const { data } = await admin.db.from("quotes").select("*").order("created_at", { ascending: false }).limit(200);
  const rows = (data ?? []) as QuoteRow[];
  return (
    <div>
      <h2 className="t-heading text-forest">Quote, sample and printing requests ({rows.length})</h2>
      {rows.length === 0 ? <p className="mt-3 rounded-[16px] bg-mint-light p-4 text-sm text-forest">No requests yet.</p> : null}
      <div className="mt-4 space-y-4">
        {rows.map((q) => (
          <article key={q.id} className="rounded-[20px] bg-cream p-5 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-[17px] font-semibold text-forest">{q.company}</p>
              <p className="text-soil/60 tnum">{formatDate(q.created_at)}</p>
            </div>
            <p className="mt-1">
              {q.contact_name} ·{" "}
              <a href={`mailto:${q.email}`} className="link">
                {q.email}
              </a>
              {q.phone ? ` · ${q.phone}` : ""}
            </p>
            <dl className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-[140px_1fr]">
              <dt className="text-soil/60">Volume per month</dt>
              <dd>{q.volume_per_month}</dd>
              <dt className="text-soil/60">Categories</dt>
              <dd>{q.categories.join(", ") || "(none selected)"}</dd>
              <dt className="text-soil/60">Delivery address</dt>
              <dd>{q.delivery_address}</dd>
              {q.notes ? (
                <>
                  <dt className="text-soil/60">Notes</dt>
                  <dd className="whitespace-pre-wrap">{q.notes}</dd>
                </>
              ) : null}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
