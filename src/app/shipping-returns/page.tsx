import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";
import { SHIPPING } from "@/lib/shipping";
import { money } from "@/lib/format";

export const metadata: Metadata = { title: "Shipping and returns", description: "Where we ship, what it costs, and how returns work." };

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <PageHeader eyebrow="Help" title="Shipping and returns" description="Last updated October 2026." />
      <div className="mt-8 space-y-6 text-[15px] leading-6 text-soil/85">
        <section>
          <h2 className="t-card">Where we ship, and what it costs</h2>
          <p>Canada and the United States, by courier. Shipping is shown in the cart and at checkout before you pay.</p>
          <div className="mt-4 overflow-x-auto border border-line bg-white">
            <table className="price-table w-full text-sm">
              <thead>
                <tr>
                  <th />
                  <th>Canada</th>
                  <th>United States</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="!normal-case !tracking-normal text-soil">Packs, per order</th>
                  <td className="tnum">{money(SHIPPING.CA.pack)}, free over {money(SHIPPING.CA.packFreeOver)}</td>
                  <td className="tnum">{money(SHIPPING.US.pack)}, free over {money(SHIPPING.US.packFreeOver)}</td>
                </tr>
                <tr>
                  <th scope="row" className="!normal-case !tracking-normal text-soil">Cases of 1,000, each</th>
                  <td className="tnum">{money(SHIPPING.CA.perCase)}</td>
                  <td className="tnum">{money(SHIPPING.US.perCase)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">Packs in the same order as a case ship free. For ten cases or more, ask for a quote and we arrange pallet delivery. All prices in Canadian dollars; US orders are charged in CAD and may be subject to import duties collected by the carrier.</p>
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
