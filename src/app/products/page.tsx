import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog/queries";
import { CatalogGrid } from "@/components/CatalogGrid";
import { PageHeader } from "@/components/PageHeader";
import { restockNote, restockNoteLower, stockSentence } from "@/lib/site";
import { pageMeta, breadcrumbLd, itemListLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "Compostable hot cups and lids · the catalogue",
  description:
    "Every hot cup and lid we make: 8, 12 and 16 oz PHA-lined paper cups and the one lid that fits all three, all 100% certified home-compostable material (TÜV Austria, per SKU). Packs of 100 to 500 or cases of 1,000, CAD pricing shown.",
  path: "/products",
});

export default async function ProductsPage() {
  const catalog = await getCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader
        eyebrow="Catalogue"
        title="Products"
        description={`${stockSentence()} Packs for the house, cases for the business.`}
        image="/atmosphere/dew.jpg"
        imageAlt="Dew on meadow grass at sunrise"
      />
      <Suspense fallback={<p className="mt-8 text-sm text-soil/60">Loading catalogue…</p>}>
        <CatalogGrid catalog={catalog} />
      </Suspense>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          itemListLd("Hot cups and lids", catalog.products.filter((p) => p.status === "live")),
        ]}
      />
    </div>
  );
}
