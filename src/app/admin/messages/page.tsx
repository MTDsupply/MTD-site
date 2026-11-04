import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdminSession, type MessageRow } from "@/lib/admin";
import { formatDate } from "@/lib/account/queries";

export const metadata: Metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <Messages />
    </Suspense>
  );
}

async function Messages() {
  const admin = await getAdminSession();
  if (!admin) return null;
  const { data } = await admin.db.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
  const rows = (data ?? []) as MessageRow[];
  return (
    <div>
      <h2 className="t-heading text-forest">Contact messages ({rows.length})</h2>
      {rows.length === 0 ? <p className="mt-3 rounded-[16px] bg-mint-light p-4 text-sm text-forest">No messages yet.</p> : null}
      <div className="mt-4 space-y-4">
        {rows.map((m) => (
          <article key={m.id} className="rounded-[20px] bg-cream p-5 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-[17px] font-semibold text-forest">{m.name}</p>
              <p className="text-soil/60 tnum">{formatDate(m.created_at)}</p>
            </div>
            <p className="mt-1">
              <a href={`mailto:${m.email}`} className="link">
                {m.email}
              </a>
              {m.phone ? ` · ${m.phone}` : ""}
            </p>
            <p className="mt-3 whitespace-pre-wrap">{m.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
