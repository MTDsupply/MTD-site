"use client";
import { useActionState } from "react";
import { markShipped, type AdminState } from "@/app/actions/admin";

/** Carrier, tracking number, tracking link, and a tick to email the customer. */
export function ShipForm({ orderId }: { orderId: string }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(markShipped, null);
  if (state?.ok) {
    return (
      <p className="text-sm text-forest" role="status">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="grid gap-2 sm:grid-cols-[1fr_1fr_1.4fr_auto] sm:items-end">
      <input type="hidden" name="orderId" value={orderId} />
      <div>
        <label className="label" htmlFor={`car-${orderId}`}>
          Carrier
        </label>
        <input id={`car-${orderId}`} name="carrier" className="input" placeholder="Canada Post, Purolator…" />
      </div>
      <div>
        <label className="label" htmlFor={`trk-${orderId}`}>
          Tracking number
        </label>
        <input id={`trk-${orderId}`} name="trackingNumber" className="input" />
      </div>
      <div>
        <label className="label" htmlFor={`url-${orderId}`}>
          Tracking link
        </label>
        <input id={`url-${orderId}`} name="trackingUrl" type="url" className="input" placeholder="https://" />
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" name="notify" value="on" defaultChecked /> Email customer
        </label>
        <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
          {pending ? "Saving…" : "Mark shipped"}
        </button>
      </div>
      {state && !state.ok ? (
        <p className="text-xs text-clay-deep sm:col-span-4" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
