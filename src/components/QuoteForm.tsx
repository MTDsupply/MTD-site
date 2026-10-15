"use client";
import { useActionState } from "react";
import { submitQuote, type QuoteState } from "@/app/actions/quote";
import type { Category } from "@/lib/catalog/types";

export function QuoteForm({ categories, presetSku }: { categories: Category[]; presetSku?: string }) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);

  if (state?.ok) {
    return (
      <div className="border border-line bg-white p-6" role="status">
        <h3 className="text-lg">Request received</h3>
        <p className="mt-2 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 border border-line bg-white p-6 md:grid-cols-2">
      <div>
        <label className="label" htmlFor="q-company">
          Company
        </label>
        <input id="q-company" name="company" required className="input" autoComplete="organization" />
      </div>
      <div>
        <label className="label" htmlFor="q-name">
          Your name
        </label>
        <input id="q-name" name="contactName" required className="input" autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor="q-email">
          Email
        </label>
        <input id="q-email" name="email" type="email" required className="input" autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="q-phone">
          Phone (optional)
        </label>
        <input id="q-phone" name="phone" type="tel" className="input" autoComplete="tel" />
      </div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="q-volume">
          Volume per month
        </label>
        <input
          id="q-volume"
          name="volumePerMonth"
          required
          className="input"
          placeholder="e.g. 6 cases of 16 oz cups, 2 cases of straws"
        />
      </div>
      <fieldset className="md:col-span-2">
        <legend className="label">Categories wanted</legend>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="categories"
                value={c.slug}
                defaultChecked={presetSku ? presetSku.toUpperCase().includes(c.slug.slice(0, 3).toUpperCase()) : false}
              />
              <span className={c.status === "live" ? "" : "text-soil/60"}>
                {c.name}
                {c.status !== "live" ? " (coming soon)" : ""}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="md:col-span-2">
        <label className="label" htmlFor="q-address">
          Delivery address
        </label>
        <input id="q-address" name="deliveryAddress" required className="input" autoComplete="street-address" />
      </div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="q-notes">
          Notes (optional)
        </label>
        <textarea
          id="q-notes"
          name="notes"
          rows={3}
          className="input"
          defaultValue={presetSku ? `Interested in ${presetSku}.` : ""}
        />
      </div>
      {state && !state.ok ? (
        <p className="text-sm text-clay-deep md:col-span-2" role="alert">
          {state.message}
        </p>
      ) : null}
      <div className="md:col-span-2">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending…" : "Request a quote"}
        </button>
      </div>
    </form>
  );
}
