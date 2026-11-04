import type { Metadata } from "next";
import { getLiveProducts } from "@/lib/catalog/queries";
import { CartView } from "@/components/CartView";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Cart", robots: { index: false, follow: true }, alternates: { canonical: "/cart" } };

export default async function CartPage() {
  const products = await getLiveProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader eyebrow="Checkout" title="Cart" description="Shipping is shown below. Tax is added at checkout." image="/atmosphere/mist.jpg" />
      <CartView products={products} />
    </div>
  );
}
