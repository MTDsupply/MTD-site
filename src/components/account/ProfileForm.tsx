"use client";
import { useActionState } from "react";
import { saveProfile, type ActionState } from "@/app/actions/account";
import { BUSINESS_TYPES, type ProfileRow } from "@/lib/account/types";

export function ProfileForm({ profile, email }: { profile: ProfileRow | null; email: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveProfile, null);
  return (
    <form action={action} className="grid gap-3 border border-line bg-white p-4 text-sm sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-company">
          Business name
        </label>
        <input id="p-company" name="company" required className="input" defaultValue={profile?.company ?? ""} autoComplete="organization" />
      </div>
      <div>
        <label className="label" htmlFor="p-contact">
          Contact name
        </label>
        <input id="p-contact" name="contactName" className="input" defaultValue={profile?.contact_name ?? ""} autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor="p-phone">
          Phone
        </label>
        <input id="p-phone" name="phone" type="tel" className="input" defaultValue={profile?.phone ?? ""} autoComplete="tel" />
      </div>
      <div>
        <label className="label" htmlFor="p-type">
          Type of business
        </label>
        <select id="p-type" name="businessType" className="input" defaultValue={profile?.business_type ?? ""}>
          <option value="">Choose…</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="p-email">
          Sign-in email
        </label>
        <input id="p-email" className="input text-soil/60" value={email} readOnly />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-notes">
          Standing delivery notes
        </label>
        <textarea
          id="p-notes"
          name="deliveryNotes"
          rows={3}
          className="input"
          defaultValue={profile?.delivery_notes ?? ""}
          placeholder="Deliveries before 11 am, ask for the kitchen manager."
          maxLength={600}
        />
      </div>
      {state ? (
        <p className={`sm:col-span-2 text-xs ${state.ok ? "text-ink" : "text-clay-deep"}`} role="status">
          {state.message}
        </p>
      ) : null}
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
          {pending ? "Saving…" : "Save details"}
        </button>
      </div>
    </form>
  );
}
