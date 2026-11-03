import type { Metadata } from "next";
import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog/queries";
import { CatalogGrid } from "@/components/CatalogGrid";
import { PageHeader } from "@/components/PageHeader";
import { restockNote, restockNoteLower } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description: "Cups and lids made from 100% certified home-compostable material. Packs for the house, cases for the business.",
};

export default async function ProductsPage() {
  const catalog = await getCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader
        eyebrow="Catalogue"
        title="Products"
        description={`${restockNote("cups") ? `Cups ${restockNoteLower("cups")}, lids in stock.` : "Cups and lids, all in stock."} Packs for the house, cases for the business.`}
        image="/atmosphere/dew.jpg"
        imageAlt="Dew on meadow grass at sunrise"
      />
      <Suspense fallback={<p className="mt-8 text-sm text-soil/60">Loading catalogue…</p>}>
        <CatalogGrid catalog={catalog} />
      </Suspense>
    </div>
  );
}
