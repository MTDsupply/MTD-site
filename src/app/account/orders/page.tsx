import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getLiveProducts } from "@/lib/catalog/queries";
import { getOrders, getSession } from "@/lib/account/queries";
import { OrderTable } from "@/components/account/OrderTable";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-72" aria-busy="true" />}>
      <Orders />
    </Suspense>
  );
}

async function Orders() {
  const s = await getSession();
  if (!s) return null;
  const [orders, products] = await Promise.all([getOrders(s), getLiveProducts()]);
  const liveSkus = new Set(products.map((p) => p.sku));
  return (
    <div>
      <h2 className="t-heading">Orders</h2>
      <p className="mt-1 text-sm text-soil/70">Every order placed with {s.user.email}. Open one for the receipt and delivery details.</p>
      {orders.length === 0 ? (
        <div className="mt-4 rounded-[20px] bg-white p-5 text-sm text-soil/70">
          No orders yet.{" "}
          <Link href="/products" className="link">
            Browse products
          </Link>{" "}
          or{" "}
          <Link href="/quick-order" className="link">
            order by SKU
          </Link>
          .
        </div>
      ) : (
        <div className="mt-4">
          <OrderTable orders={orders} liveSkus={liveSkus} />
        </div>
      )}
    </div>
  );
}
