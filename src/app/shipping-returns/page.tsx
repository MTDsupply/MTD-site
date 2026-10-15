import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Shipping and returns", description: "Where we ship, what it costs, and how returns work." };

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <PageHeader eyebrow="Help" title="Shipping and returns" description="Last updated October 2026." />
      <div className="mt-8 space-y-6 text-[15px] leading-6 text-soil/85">
        <section>
          <h2 className="t-card">Where we ship</h2>
          <p>Canada and the United States. Packs go by courier. Cases go by courier or, for larger orders, on a pallet. Delivery cost is calculated at checkout from your address and the size of the order, and shown before you pay.</p>
        </section>
        <section>
          <h2 className="t-card">Tracking</h2>
          <p>You receive a tracking link by email when your order is dispatched. Business accounts can see every order on their account page.</p>
        </section>
        <section>
          <h2 className="t-card">Damaged or incorrect orders</h2>
          <p>If anything arrives damaged, short or wrong, email <a className="link" href={`mailto:${site.email}`}>{site.email}</a> within 7 days of delivery with your order number and a photo. We replace or refund the affected items at no cost to you.</p>
        </section>
        <section>
          <h2 className="t-card">Returns</h2>
          <p>Unopened packs and cases can be returned within 30 days of delivery for a refund of the item price. Email us first so we can send a return address and reference. Return shipping is paid by the buyer unless the return is our error. Opened packs and custom-printed orders cannot be returned, for hygiene and because they are made to order.</p>
        </section>
        <section>
          <h2 className="t-card">Refunds</h2>
          <p>Refunds go back to the original payment method within 5 business days of the return arriving with us.</p>
        </section>
      </div>
    </div>
  );
}
