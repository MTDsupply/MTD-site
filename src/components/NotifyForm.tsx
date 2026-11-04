"use client";
import { useActionState } from "react";
import { subscribeNotify, type NotifyState } from "@/app/actions/notify";

export function NotifyForm({
  categorySlug,
  label = "Email",
  buttonLabel = "Notify me",
  compact = false,
  autoFocus = false,
  onInk = false,
}: {
  categorySlug: string;
  label?: string;
  buttonLabel?: string;
  compact?: boolean;
  autoFocus?: boolean;
  onInk?: boolean;
}) {
  const [state, action, pending] = useActionState<NotifyState, FormData>(subscribeNotify, null);
  const id = `notify-${categorySlug}`;

  if (state?.ok) {
    return (
      <p className={`text-sm ${onInk ? "text-paper" : "text-ink"}`} role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className={compact ? "flex gap-2" : "space-y-2"}>
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name="email"
        type="email"
        required
        autoFocus={autoFocus}
        placeholder="you@company.com"
        className="input"
        autoComplete="email"
      />
      <button type="submit" className={`btn btn-sm shrink-0 ${onInk ? "btn-paper" : "btn-primary"}`} disabled={pending}>
        {pending ? "Sending…" : buttonLabel}
      </button>
      {state && !state.ok ? (
        <p className="text-xs text-clay-deep basis-full" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
