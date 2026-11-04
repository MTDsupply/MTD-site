import type { Metadata } from "next";
import { Suspense } from "react";
import { getAddresses, getSession } from "@/lib/account/queries";
import { deleteAddress } from "@/app/actions/auth";
import { setDefaultAddress } from "@/app/actions/account";
import { AddressForm } from "@/components/AccountForms";
import { SHIPPING, type Country } from "@/lib/shipping";

export const metadata: Metadata = { title: "Addresses" };

export default function AddressesPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <Addresses />
    </Suspense>
  );
}

async function Addresses() {
  const s = await getSession();
  if (!s) return null;
  const addresses = await getAddresses(s);

  return (
    <div>
      <h2 className="t-heading">Delivery addresses</h2>
      <p className="mt-1 text-sm text-soil/70">Keep the places your parcels go. Delivery notes travel with the address so the courier knows where to leave the boxes.</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div>
          {addresses.length === 0 ? (
            <p className="rounded-[20px] bg-white p-5 text-sm text-soil/70">No saved addresses yet.</p>
          ) : (
            <ul className="space-y-3">
              {addresses.map((a) => (
                <li key={a.id} className="rounded-[20px] bg-white p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <address className="not-italic">
                      <span className="font-medium">{a.label}</span>
                      {a.is_default ? <span className="chip chip-sage ml-2">Default</span> : null}
                      <br />
                      {a.name}
                      <br />
                      {a.line1}
                      {a.line2 ? <>, {a.line2}</> : null}
                      <br />
                      {a.city}, {a.province} {a.postal_code}
                      {a.country !== "CA" ? <>, {SHIPPING[a.country as Country]?.label ?? a.country}</> : null}
                      {a.notes ? <p className="mt-1 text-xs text-soil/60">{a.notes}</p> : null}
                    </address>
                    <div className="flex shrink-0 flex-col items-end gap-2 text-xs">
                      {!a.is_default ? (
                        <form action={setDefaultAddress}>
                          <input type="hidden" name="id" value={a.id} />
                          <button type="submit" className="link">
                            Make default
                          </button>
                        </form>
                      ) : null}
                      <form action={deleteAddress}>
                        <input type="hidden" name="id" value={a.id} />
                        <button type="submit" className="text-soil/60 hover:text-clay-deep">
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="t-card">Add an address</h3>
          <div className="mt-3">
            <AddressForm firstAddress={addresses.length === 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
