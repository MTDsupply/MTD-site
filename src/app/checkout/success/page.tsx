import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getStripe } from "@/lib/stripe";
import { money } from "@/lib/format";
import { ClearCart } from "@/components/ClearCart";
import { PurchaseEvent } from "@/components/PurchaseEvent";

export const metadata: Metadata = { title: "Order received", robots: { index: false, follow: false } };

export default function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ClearCart />
      <Suspense fallback={<p className="text-sm text-soil/60">Confirming your order…</p>}>
        <Summary searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Summary({ searchParams }: { searchParams: PageProps<"/checkout/success">["searchParams"] }) {
  const sp = await searchParams;
  const id = typeof sp.session_id === "string" ? sp.session_id : null;
  const stripe = getStripe();
  let total: string | null = null;
  let email: string | null = null;
  let amount = 0;
  if (stripe && id) {
    try {
      const s = await stripe.checkout.sessions.retrieve(id);
      total = s.amount_total != null ? money(s.amount_total / 100) : null;
      amount = (s.amount_total ?? 0) / 100;
      email = s.customer_details?.email ?? null;
    } catch {
      // Fall through to the generic message.
    }
  }
  return (
    <div className="rounded-[20px] bg-white p-8">
      {id && amount > 0 ? <PurchaseEvent value={amount} orderId={id} /> : null}
      <h1 className="t-page">Order received</h1>
      <p className="mt-3 text-base text-soil/80">
        Thanks. {email ? `A receipt is on its way to ${email}.` : "A receipt is on its way to your email."}{" "}
        {total ? <span className="tnum">Total {total}.</span> : null}
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/account" className="btn btn-primary btn-sm">
          View orders
        </Link>
        <Link href="/products" className="btn btn-outline btn-sm">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
