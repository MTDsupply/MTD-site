import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdminSession } from "@/lib/admin";
import { getCategories } from "@/lib/catalog/queries";
import { StockForm } from "@/components/admin/StockForm";

export const metadata: Metadata = { title: "Stock" };

export default function AdminStockPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-2 h-40" aria-busy="true" />}>
      <Stock />
    </Suspense>
  );
}

async function Stock() {
  const admin = await getAdminSession();
  if (!admin) return null;
  const categories = await getCategories();
  return (
    <div>
      <h2 className="t-heading text-forest">Stock notes</h2>
      <p className="mt-2 max-w-[60ch] text-sm text-soil/70">
        A note here shows as &ldquo;Restocking …&rdquo; on the hero, the shop strip, product cards and pages, the business table, the menu, the cart, the FAQ and the product data search engines read. Blank means in stock. Ordering stays open either way. Changes show on the site within a minute.
      </p>
      <div className="mt-5 space-y-3">
        {categories.map((c) => (
          <StockForm key={c.slug} slug={c.slug} name={c.name} when={c.restockWhen} />
        ))}
      </div>
    </div>
  );
}
