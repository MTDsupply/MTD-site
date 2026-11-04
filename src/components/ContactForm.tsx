"use client";
import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, null);

  if (state?.ok) {
    return (
      <div className="rounded-[20px] bg-white p-6" role="status">
        <h3 className="text-lg">Message sent</h3>
        <p className="mt-2 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 rounded-[20px] bg-white p-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">
            Name
          </label>
          <input id="c-name" name="name" required className="input" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="c-email">
            Email
          </label>
          <input id="c-email" name="email" type="email" required className="input" autoComplete="email" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-phone">
          Phone (optional)
        </label>
        <input id="c-phone" name="phone" type="tel" className="input" autoComplete="tel" />
      </div>
      <div>
        <label className="label" htmlFor="c-message">
          Message
        </label>
        <textarea id="c-message" name="message" rows={5} required className="input" />
      </div>
      {state && !state.ok ? (
        <p className="text-sm text-clay-deep" role="alert">
          {state.message}
        </p>
      ) : null}
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
