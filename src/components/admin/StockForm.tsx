"use client";
import { useActionState } from "react";
import { setRestock, type AdminState } from "@/app/actions/admin";

/** One row per category: a restock note, or blank for in stock. */
export function StockForm({ slug, name, when }: { slug: string; name: string; when: string | null }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(setRestock, null);
  return (
    <form action={action} className="grid gap-2 rounded-[16px] bg-white p-4 sm:grid-cols-[160px_1fr_auto] sm:items-end">
      <input type="hidden" name="slug" value={slug} />
      <div>
        <p className="label">Category</p>
        <p className="font-display font-semibold text-forest">{name}</p>
      </div>
      <div>
        <label className="label" htmlFor={`when-${slug}`}>
          Restocking (blank = in stock)
        </label>
        <input id={`when-${slug}`} name="when" className="input" defaultValue={when ?? ""} placeholder="mid-December" />
      </div>
      <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </button>
      {state ? (
        <p className={`text-xs sm:col-span-3 ${state.ok ? "text-forest" : "text-clay-deep"}`} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
