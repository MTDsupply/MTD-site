"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics/pixel";

/** Fires the Meta Purchase event once on the order confirmation page. */
export function PurchaseEvent({ value, orderId }: { value: number; orderId: string }) {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(`mtd_purchased_${orderId}`)) return;
      sessionStorage.setItem(`mtd_purchased_${orderId}`, "1");
    } catch {
      // storage blocked: fire anyway
    }
    track("Purchase", { value, currency: "CAD" });
  }, [value, orderId]);
  return null;
}
