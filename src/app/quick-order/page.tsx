import type { Metadata } from "next";
import { getLiveProducts } from "@/lib/catalog/queries";
import { QuickOrder } from "@/components/QuickOrder";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Quick order",
  description: "Paste SKUs and quantities, add everything to the cart in one go.",
};

export default async function QuickOrderPage() {
  const products = await getLiveProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader
        image="/atmosphere/mist.jpg"
        eyebrow="For repeat orders"
        title="Quick order by SKU"
        description="One line per item: SKU, then quantity. Add “case”, “pack100”, “pack200” or “pack500” to choose the unit; otherwise cases for business, the smallest pack for consumers."
      />
      <QuickOrder products={products} />
    </div>
  );
}
