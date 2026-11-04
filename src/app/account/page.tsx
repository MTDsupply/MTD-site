import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getLiveProducts } from "@/lib/catalog/queries";
import { money } from "@/lib/format";
import { unitInfo } from "@/lib/units";
import { site } from "@/lib/site";
import { formatDate, getAddresses, getOrders, getProfile, getSession, getUsual, orderLabel, toUnit, unitLabel } from "@/lib/account/queries";
import { usualFromOrder } from "@/app/actions/account";
import { OrderTable } from "@/components/account/OrderTable";
import { ReorderButton } from "@/components/ReorderButton";

export const metadata: Metadata = { title: "Overview" };

export default function AccountPage({ searchParams }: PageProps<"/account">) {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <Overview searchParams={searchParams} />
    </Suspense>
  );
}

async function Overview({ searchParams }: { searchParams: PageProps<"/account">["searchParams"] }) {
  const s = await getSession();
  if (!s) {
    const sp = await searchParams;
    return sp.error === "link" ? (
      <p role="alert" className="mt-6 rounded-[16px] bg-peach-light p-4 text-sm">
        That sign-in link has expired or was already used. Request a new one below.
      </p>
    ) : null;
  }

  const [orders, usual, addresses, profile, products] = await Promise.all([getOrders(s, 5), getUsual(s), getAddresses(s), getProfile(s), getLiveProducts()]);
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const liveSkus = new Set(bySku.keys());
  const usualRows = usual
    .filter((u) => bySku.has(u.sku))
    .map((u) => ({ sku: u.sku, unit: toUnit(u.unit), qty: u.qty, product: bySku.get(u.sku)! }));
  const usualTotal = usualRows.reduce((sum, r) => sum + r.qty * unitInfo(r.product, r.unit).price, 0);
  const last = orders[0];
  const home = addresses.find((a) => a.is_default) ?? addresses[0];

  return (
    <div className="space-y-8">
      {/* Reorder card: the usual list first, the last order as a fallback. */}
      <section className="rounded-[20px] bg-cream p-5 md:p-6">
        {usualRows.length ? (
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <p className="t-label text-forest">Your usual</p>
              <ul className="mt-2 space-y-0.5 text-sm text-soil/80">
                {usualRows.map((r) => (
                  <li key={`${r.sku}-${r.unit}`} className="tnum">
                    {r.qty} × {r.product.name} · {unitLabel(r.unit)}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-soil/60 tnum">{money(usualTotal)} before shipping and tax</p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <ReorderButton lines={usualRows.map(({ sku, unit, qty }) => ({ sku, unit, qty }))} label="Reorder your usual" className="btn btn-primary" goToCart />
              <Link href="/account/usual" className="link text-sm">
                Edit the list
              </Link>
            </div>
          </div>
        ) : last ? (
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <p className="t-label text-forest">Reorder your last order</p>
              <p className="mt-1 text-sm text-soil/70">
                {orderLabel(last)} · {formatDate(last.created_at)}
              </p>
              <ul className="mt-2 space-y-0.5 text-sm text-soil/80">
                {last.items.map((i, idx) => (
                  <li key={idx} className="tnum">
                    {i.qty} × {i.name} · {unitLabel(i.unit)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <ReorderButton
                lines={last.items.filter((i) => liveSkus.has(i.sku)).map((i) => ({ sku: i.sku, unit: toUnit(i.unit), qty: i.qty }))}
                label="Reorder"
                className="btn btn-primary"
                goToCart
              />
              <form action={usualFromOrder}>
                <input type="hidden" name="orderId" value={last.id} />
                <button type="submit" className="link text-sm">
                  Save as your usual
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="t-label text-forest">First order</p>
              <p className="mt-1 text-sm text-soil/80">Orders placed with {s.user.email} show up here, and the lines you reorder can be saved as your usual.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/products" className="btn btn-primary btn-sm">
                Browse products
              </Link>
              <Link href="/quick-order" className="btn btn-outline btn-sm">
                Quick order by SKU
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Recent orders. */}
      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="t-heading">Recent orders</h2>
          {orders.length ? (
            <Link href="/account/orders" className="link text-sm">
              All orders
            </Link>
          ) : null}
        </div>
        {orders.length === 0 ? (
          <p className="mt-3 rounded-[20px] bg-white p-5 text-sm text-soil/70">No orders yet under this email.</p>
        ) : (
          <div className="mt-3">
            <OrderTable orders={orders} liveSkus={liveSkus} />
          </div>
        )}
      </section>

      {/* Delivery, business details, help. */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[20px] bg-white p-5 text-sm">
          <h2 className="t-card">Delivery address</h2>
          {home ? (
            <address className="mt-2 not-italic text-soil/80">
              <span className="font-medium text-soil">{home.label}</span>
              <br />
              {home.name}
              <br />
              {home.line1}
              {home.line2 ? <>, {home.line2}</> : null}
              <br />
              {home.city}, {home.province} {home.postal_code}
            </address>
          ) : (
            <p className="mt-2 text-soil/70">Save the address your parcels go to so it is ready at checkout.</p>
          )}
          <Link href="/account/addresses" className="link mt-3 inline-block">
            {home ? "Manage addresses" : "Add an address"}
          </Link>
        </div>
        <div className="rounded-[20px] bg-white p-5 text-sm">
          <h2 className="t-card">Business details</h2>
          {profile?.company ? (
            <p className="mt-2 text-soil/80">
              <span className="font-medium text-soil">{profile.company}</span>
              {profile.business_type ? <> · {profile.business_type}</> : null}
              {profile.contact_name ? (
                <>
                  <br />
                  {profile.contact_name}
                </>
              ) : null}
              {profile.phone ? (
                <>
                  <br />
                  <span className="tnum">{profile.phone}</span>
                </>
              ) : null}
            </p>
          ) : (
            <p className="mt-2 text-soil/70">Tell us the business name and who to call about a delivery.</p>
          )}
          <Link href="/account/details" className="link mt-3 inline-block">
            {profile?.company ? "Edit details" : "Add details"}
          </Link>
        </div>
        <div className="rounded-[20px] bg-white p-5 text-sm">
          <h2 className="t-card">Need a hand?</h2>
          <p className="mt-2 text-soil/80">
            Larger volumes, standing deliveries or invoicing:{" "}
            <Link href="/business#quote" className="link">
              request a quote
            </Link>
            .
          </p>
          <p className="mt-2 text-soil/80">
            Anything else:{" "}
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>
            {site.phone && site.phoneHref ? (
              <>
                {" "}
                or{" "}
                <a href={site.phoneHref} className="link tnum">
                  {site.phone}
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
      </section>
    </div>
  );
}
