import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { pageMeta, breadcrumbLd, itemListLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { getCatalog, getCategories } from "@/lib/catalog/queries";
import { CatalogGrid } from "@/components/CatalogGrid";
import { sharedPhoto } from "@/lib/catalog/assets";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { PageHeader } from "@/components/PageHeader";
import { restockNote } from "@/lib/site";
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
  const { products } = await getCatalog();
  const live = products.filter((p) => p.categorySlug === c.slug && p.status === "live").sort((a, b) => a.sortOrder - b.sortOrder);
  const sizes = live.map((p) => p.size).filter((s) => /oz/.test(s));
  const seo: Record<string, { title: string; description: string }> = {
    cups: {
      title: `Compostable hot cups · ${sizes.length ? sizes.join(", ").replace(/, ([^,]*)$/, " and $1") : "8, 12 and 16 oz"}, PHA-lined paper`,
      description: `Paper hot cups lined with PHA instead of plastic, 100% certified home-compostable material (TÜV Austria). ${
        live.length ? `From ${money(Math.min(...live.map((p) => p.casePrice)))} per case of 1,000 (${unitMoney(Math.min(...live.map((p) => p.unitPrice)))} a cup) or packs of 100.` : ""
      } Ships from Victoria, BC to Canada and the US.`,
    },
    lids: {
      title: "Compostable hot cup lids · one lid fits 8, 12 and 16 oz",
      description: `PHA hot cup lids that fit our 8, 12 and 16 oz cups, 100% certified home-compostable material (TÜV Austria). ${
        live[0] ? `${money(live[0].casePrice)} per case of ${count(live[0].caseCount)}, packs from ${money(live[0].packPrice)}.` : ""
      } One lid SKU to stock.`,
    },
  };
  const fallback = { title: c.status === "live" ? c.name : `${c.name} (coming soon)`, description: c.description };
  return pageMeta({ ...(seo[c.slug] ?? fallback), path: `/products/${c.slug}`, image: live[0]?.photo ?? null, imageAlt: live[0]?.name });
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
        <PageHeader eyebrow="Coming soon" title={`${c.name.toLowerCase()}.`} description={c.description} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <ComingSoonTile category={c} photo={planned[0]?.photo ?? null} />
          {planned.length ? (
            <div>
              <h2 className="t-card">Planned SKUs and pricing</h2>
              <div className="mt-3 overflow-x-auto rounded-[20px] bg-white">
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
                              <img src={p.photo} alt="" className="h-12 w-12 shrink-0 rounded-[20px] bg-white object-contain" />
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
      <div className="pt-8">
        <nav aria-label="Breadcrumb" className="t-label">
          <Link href="/" className="hover:underline">
            home
          </Link>{" "}
          /{" "}
          <Link href="/products" className="hover:underline">
            products
          </Link>{" "}
          / {c.name.toLowerCase()}
        </nav>
        <h1 className="t-section mt-3 text-ink">{c.name.toLowerCase()}.</h1>
        <p className="t-lead mt-3 max-w-[48ch] text-stone">
          {c.description}
          {restockNote(c.restockWhen) ? ` ${restockNote(c.restockWhen)}.` : ""}
        </p>
      </div>
      <Suspense fallback={<p className="mt-8 text-sm text-soil/60">Loading…</p>}>
        <CatalogGrid
          catalog={catalog}
          lockedCategory={c.slug}
          featured={
            c.slug === "lids" && sharedPhoto("life-hand")
              ? { src: sharedPhoto("life-hand")!, alt: "A barista holding a lidded cup", line: "One lid for all three cups. Same material as the cup, so the whole thing goes in the compost together.", href: "/compost" }
              : undefined
          }
          closers={
            c.slug === "lids"
              ? sharedPhoto("lid-on")
                ? [{ src: sharedPhoto("lid-on")!, alt: "The 12 oz cup wearing the lid", line: "The lid on the 12 oz cup. It fits the 8 and 16 oz the same way.", href: "/products/cups" }]
                : []
              : sharedPhoto("trio")
                ? [{ src: sharedPhoto("trio")!, alt: "The 8, 12 and 16 oz cups side by side", line: "All three sizes side by side. Same paper, same lining, one lid.", href: "/products/lids" }]
                : []
          }
        />
      </Suspense>
      <section className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2">
        <div className="note">
          <h2 className="t-heading text-ink">want to try them first?</h2>
          <p className="mt-2 text-stone">
            We send free sample packs to cafés and food businesses once we have verified them.{" "}
            <Link href="/business?kind=sample#quote" className="link text-ink">
              request a sample pack
            </Link>
          </p>
        </div>
        <div className="note">
          <h2 className="t-heading text-ink">ordering again?</h2>
          <p className="mt-2 text-stone">
            Type in the SKUs and quantities and add them all at once.{" "}
            <Link href="/quick-order" className="link text-ink">
              quick order by <span className="keep-case">SKU</span>
            </Link>
          </p>
        </div>
      </section>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: c.name, path: `/products/${c.slug}` },
          ]),
          itemListLd(c.name, catalog.products.filter((p) => p.categorySlug === c.slug && p.status === "live").sort((a, b) => a.sortOrder - b.sortOrder)),
        ]}
      />
    </div>
  );
}
