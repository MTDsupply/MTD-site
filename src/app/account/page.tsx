import type { Metadata } from "next";
import { Suspense } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import { getLiveProducts } from "@/lib/catalog/queries";
import { money } from "@/lib/format";
import { signOut, deleteAddress } from "@/app/actions/auth";
import { SignInForm, AddressForm } from "@/components/AccountForms";
import { ReorderButton } from "@/components/ReorderButton";
import { PageHeader } from "@/components/PageHeader";
import type { Unit } from "@/lib/store/cart";

export const metadata: Metadata = { title: "Account" };

type OrderRow = {
  id: string;
  created_at: string;
  amount_total: number;
  currency: string;
  status: string;
  items: { sku: string; name: string; unit: string; qty: number; price: number }[];
  shipping: { name?: string; address?: { line1?: string; city?: string; postal_code?: string } } | null;
};
type AddressRow = {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postal_code: string;
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader eyebrow="Your orders" title="Account" description="Order history, one-click reorder and saved delivery addresses." image="/atmosphere/mist.jpg" />
      <Suspense
        fallback={
          <div className="mt-8 grid gap-6 md:grid-cols-2" aria-busy="true" aria-label="Loading account">
            <div className="skeleton h-40" />
            <div className="skeleton h-40" />
          </div>
        }
      >
        <AccountBody />
      </Suspense>
    </div>
  );
}

async function AccountBody() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return <p className="mt-6 border border-line bg-white p-6 text-sm">Accounts are not switched on yet.</p>;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="border border-line bg-white p-6">
          <h2 className="t-card">Sign in</h2>
          <p className="mt-1 text-sm text-soil/70">
            We email you a sign-in link. No password. Orders placed with this email appear automatically.
          </p>
          <div className="mt-4">
            <SignInForm />
          </div>
        </div>
        <div className="border border-line bg-white p-6 text-sm text-soil/80">
          <h2 className="t-heading">Business accounts</h2>
          <p className="mt-2">Approved accounts see their order history, reorder in one click, and keep saved delivery addresses here.</p>
        </div>
      </div>
    );
  }

  const [ordersRes, addressesRes, products] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("addresses").select("*").order("created_at", { ascending: false }),
    getLiveProducts(),
  ]);
  const orders = (ordersRes.data ?? []) as OrderRow[];
  const addresses = (addressesRes.data ?? []) as AddressRow[];
  const liveSkus = new Set(products.map((p) => p.sku));

  return (
    <div className="mt-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white p-4 text-sm">
        <p>
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
        <form action={signOut}>
          <button type="submit" className="btn btn-ghost btn-sm">
            Sign out
          </button>
        </form>
      </div>

      <section>
        <h2 className="t-card">Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 border border-line bg-white p-5 text-sm text-soil/70">No orders yet under this email.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {orders.map((o) => (
              <article key={o.id} className="border border-line bg-white p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium">{new Date(o.created_at).toLocaleDateString("en-CA")}</span>
                    <span className="ml-2 text-soil/60 tnum">{money(o.amount_total / 100)}</span>
                    <span className="ml-2 chip chip-fog">{o.status}</span>
                  </div>
                  <ReorderButton
                    lines={o.items
                      .filter((i) => liveSkus.has(i.sku))
                      .map((i) => ({ sku: i.sku, unit: (i.unit === "pack" ? "pack-100" : i.unit) as Unit, qty: i.qty }))}
                  />
                </div>
                <ul className="mt-2 space-y-0.5 text-soil/80">
                  {o.items.map((i, idx) => (
                    <li key={idx} className="tnum">
                      {i.qty} × {i.name} ({i.unit}) · {i.sku}
                    </li>
                  ))}
                </ul>
                {o.shipping?.address?.line1 ? (
                  <p className="mt-2 text-xs text-soil/60">
                    Delivered to {o.shipping.name}, {o.shipping.address.line1}, {o.shipping.address.city}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="t-card">Saved addresses</h2>
          {addresses.length === 0 ? (
            <p className="mt-3 text-sm text-soil/70">No saved addresses.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {addresses.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 border border-line bg-white p-4 text-sm">
                  <address className="not-italic">
                    <span className="font-medium">{a.label}</span>
                    <br />
                    {a.name}
                    <br />
                    {a.line1}
                    {a.line2 ? <>, {a.line2}</> : null}
                    <br />
                    {a.city}, {a.province} {a.postal_code}
                  </address>
                  <form action={deleteAddress}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="text-xs text-soil/60 hover:text-clay-deep">
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="t-card">Add an address</h2>
          <div className="mt-3">
            <AddressForm />
          </div>
        </div>
      </section>
    </div>
  );
}
