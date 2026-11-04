"use client";
import { useActionState } from "react";
import { sendMagicLink, addAddress, type AuthState } from "@/app/actions/auth";
import { COUNTRIES, SHIPPING } from "@/lib/shipping";

export function SignInForm({ next = "/account" }: { next?: string } = {}) {
  const [state, action, pending] = useActionState<AuthState, FormData>(sendMagicLink, null);
  if (state?.ok) {
    return (
      <p className="text-sm text-ink" role="status">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="flex flex-wrap gap-2">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="signin-email" className="sr-only">
        Email
      </label>
      <input id="signin-email" name="email" type="email" required className="input min-w-0 flex-1" placeholder="you@company.com" autoComplete="email" />
      <button type="submit" className="btn btn-primary shrink-0" disabled={pending}>
        {pending ? "Sending…" : "Email me a link"}
      </button>
      {state && !state.ok ? (
        <p className="basis-full text-xs text-clay-deep" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function AddressForm({ firstAddress = false }: { firstAddress?: boolean }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(addAddress, null);
  return (
    <form action={action} className="grid gap-3 rounded-[20px] bg-white p-4 text-sm sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="a-label">
          Label
        </label>
        <input id="a-label" name="label" className="input" placeholder="Shop, Kitchen, Loading dock…" />
      </div>
      <div>
        <label className="label" htmlFor="a-name">
          Name on the parcel
        </label>
        <input id="a-name" name="name" required className="input" autoComplete="name" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="a-line1">
          Address
        </label>
        <input id="a-line1" name="line1" required className="input" autoComplete="address-line1" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="a-line2">
          Address line 2
        </label>
        <input id="a-line2" name="line2" className="input" autoComplete="address-line2" />
      </div>
      <div>
        <label className="label" htmlFor="a-city">
          City
        </label>
        <input id="a-city" name="city" required className="input" autoComplete="address-level2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="a-prov">
            Province / State
          </label>
          <input id="a-prov" name="province" required className="input" defaultValue="BC" autoComplete="address-level1" />
        </div>
        <div>
          <label className="label" htmlFor="a-postal">
            Postal code
          </label>
          <input id="a-postal" name="postalCode" required className="input" autoComplete="postal-code" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="a-country">
          Country
        </label>
        <select id="a-country" name="country" className="input" defaultValue="CA" autoComplete="country">
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {SHIPPING[c].label}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="a-notes">
          Delivery notes
        </label>
        <input id="a-notes" name="notes" className="input" placeholder="Back entrance on the alley, ring the kitchen bell." maxLength={300} />
      </div>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="isDefault" defaultChecked={firstAddress} className="h-4 w-4 accent-sage" />
        Use as my default delivery address
      </label>
      {state ? (
        <p className={`sm:col-span-2 text-xs ${state.ok ? "text-ink" : "text-clay-deep"}`} role="status">
          {state.message}
        </p>
      ) : null}
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-outline btn-sm" disabled={pending}>
          {pending ? "Saving…" : "Save address"}
        </button>
      </div>
    </form>
  );
}
