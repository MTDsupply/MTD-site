import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCatalog, getCategories } from "@/lib/catalog/queries";
import { CatalogGrid } from "@/components/CatalogGrid";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { ModeToggle } from "@/components/ModeToggle";
import { PageHeader } from "@/components/PageHeader";
import { money, unitMoney, count } from "@/lib/format";

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cats = await getCategories();
  const c = cats.find((x) => x.slug === category);
  if (!c) return {};
  return {
    title: c.status === "live" ? c.name : `${c.name} (coming soon)`,
    description: c.description,
  };
}

export default async function CategoryPage({ params }: PageProps<"/products/[category]">) {
  const { category } = await params;
  const catalog = await getCatalog();
  const c = catalog.categories.find((x) => x.slug === category);
  if (!c) notFound();

  if (c.status !== "live") {
    const planned = catalog.products.filter((p) => p.categorySlug === c.slug).sort((a, b) => a.sortOrder - b.sortOrder);
    return (
      <div className="mx-auto max-w-7xl px-4 pb-8">
        <PageHeader eyebrow="Coming soon" title={c.name} description={c.description} image="/atmosphere/mist.jpg" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <ComingSoonTile category={c} photo={planned[0]?.photo ?? null} />
          {planned.length ? (
            <div>
              <h2 className="t-card">Planned SKUs and pricing</h2>
              <div className="mt-3 overflow-x-auto border border-line bg-white">
                <table className="price-table w-full text-sm">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Product</th>
                      <th>Material</th>
                      <th className="num">Packs</th>
                      <th className="num">Case</th>
                      <th className="num">Per unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planned.map((p) => (
                      <tr key={p.sku}>
                        <td className="sku">{p.sku}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            {p.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.photo} alt="" className="h-12 w-12 shrink-0 border border-line bg-white object-contain" />
                            ) : null}
                            <div>
                              {p.name}
                              <div className="text-xs text-soil/60">{p.size}</div>
                            </div>
                          </div>
                        </td>
                        <td>{p.material}</td>
                        <td className="num">
                          {(p.packs?.length ? p.packs : [{ count: p.packCount, price: p.packPrice }]).map((t) => (
                            <div key={t.count}>
                              {money(t.price)} / {count(t.count)}
                            </div>
                          ))}
                        </td>
                        <td className="num">
                          {money(p.casePrice)} / {count(p.caseCount)}
                        </td>
                        <td className="num">{unitMoney(p.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-soil/60">
                Planned pricing. Add these to a{" "}
                <a href="/business#quote" className="link">
                  bulk quote
                </a>{" "}
                and we will confirm the ship date.
              </p>
            </div>
          ) : null}
        </div>
        <p className="mt-6 text-sm text-soil/70">
          Every product in this category is made from the same 100% certified home-compostable material, certified by TÜV Austria. Sign up above and we will tell you the day it lands.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <PageHeader eyebrow="In stock" title={c.name} description={c.description} actions={<ModeToggle />} image="/atmosphere/dew.jpg" imageAlt="Dew on meadow grass at sunrise" />
      <Suspense fallback={<p className="mt-8 text-sm text-soil/60">Loading…</p>}>
        <CatalogGrid catalog={catalog} lockedCategory={c.slug} />
      </Suspense>
    </div>
  );
}
