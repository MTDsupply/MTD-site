"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

/** One row the search box can suggest: a product, a category or a page. */
export type SearchEntry = {
  kind: "product" | "category" | "page";
  title: string;
  /** Second line: size and material for a product, a one-liner otherwise. */
  detail: string;
  href: string;
  sku?: string;
  photo?: string | null;
  /** Extra words that should match, e.g. "lid lids 12oz hot cups". */
  keywords?: string;
};

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
/** Space-free form so "16oz" finds "16 oz" and "mtdcup16h" finds the SKU. */
const squash = (s: string) => fold(s).replace(/\s+/g, "");

function score(e: SearchEntry, q: string): number {
  const hay = fold([e.title, e.sku ?? "", e.detail, e.keywords ?? ""].join(" "));
  const hayS = squash(hay);
  const qS = squash(q);
  if (!qS) return 0;
  const sku = squash(e.sku ?? "");
  if (sku && sku === qS) return 100;
  if (sku && sku.startsWith(qS)) return 90;
  const bonus = e.kind === "product" ? 7 : e.kind === "page" ? 3 : 0;
  const fq = fold(q);
  if (fold(e.title).startsWith(fq)) return 80 + bonus;
  // A word in the title starts with the query: "lid" → "Hot cup lid", "compost" → "How to compost it".
  if (fold(e.title).split(" ").some((w) => w.startsWith(fq))) return 76 + bonus;
  const tokens = fq.split(" ").filter(Boolean);
  if (tokens.length && tokens.every((t) => hayS.includes(squash(t)))) return 60 + bonus;
  if (hayS.includes(qS)) return 50 + bonus;
  return 0;
}

export function SearchForm({ entries, className = "", defaultValue = "" }: { entries: SearchEntry[]; className?: string; defaultValue?: string }) {
  const router = useRouter();
  const listId = useId();
  const [q, setQ] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLFormElement>(null);

  const results = useMemo(() => {
    const trimmed = q.trim();
    if (!trimmed) return [];
    return entries
      .map((e) => ({ e, s: score(e, trimmed) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 7)
      .map((r) => r.e);
  }, [entries, q]);

  useEffect(() => {
    const onDown = (ev: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onKey = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (ev.key === "ArrowDown" || ev.key === "ArrowUp") && results.length) {
      setOpen(true);
      return;
    }
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (ev.key === "Enter") {
      if (open && active >= 0 && results[active]) {
        ev.preventDefault();
        go(results[active].href);
      }
    } else if (ev.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  const showList = open && q.trim().length > 0;

  return (
    <form ref={rootRef} action="/products" method="get" role="search" className={`relative ${className}`} onSubmit={() => setOpen(false)}>
      <div className="flex w-full">
        <label htmlFor="site-search" className="sr-only">
          Search products or SKU
        </label>
        <input
          id="site-search"
          name="q"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search or SKU"
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          className="input min-w-0 flex-1 rounded-r-none py-1.5 text-sm"
        />
        <button type="submit" className="btn btn-outline btn-sm rounded-l-none border-l-0">
          Search
        </button>
      </div>

      {showList ? (
        <div className="absolute inset-x-0 top-full z-40 mt-1 overflow-hidden border border-line bg-white shadow-[0_24px_48px_-24px_rgba(43,43,43,0.45)]">
          <ul id={listId} role="listbox" aria-label="Suggestions">
            {results.length === 0 ? (
              <li className="px-3 py-3 text-sm text-soil/70">No matches. Try a size, a SKU or “lid”.</li>
            ) : (
              results.map((r, i) => (
                <li
                  key={r.href + r.title}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    go(r.href);
                  }}
                  className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm ${i === active ? "bg-sage-tint" : ""}`}
                >
                  {r.kind === "product" ? (
                    r.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.photo} alt="" className="h-10 w-10 shrink-0 border border-line bg-white object-contain" />
                    ) : (
                      <span className="h-10 w-10 shrink-0 border border-line bg-paper" />
                    )
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-sage-deep" aria-hidden="true">
                      {r.kind === "category" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="4" y="4" width="7" height="7" />
                          <rect x="13" y="4" width="7" height="7" />
                          <rect x="4" y="13" width="7" height="7" />
                          <rect x="13" y="13" width="7" height="7" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M6 3h9l4 4v14H6z" />
                          <path d="M9 12h7M9 16h7" />
                        </svg>
                      )}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-medium text-ink">{r.title}</span>
                      {r.sku ? <span className="sku shrink-0 text-soil/60">{r.sku}</span> : null}
                    </span>
                    <span className="block truncate text-xs text-soil/70">{r.detail}</span>
                  </span>
                </li>
              ))
            )}
          </ul>
          <Link
            href={`/products?q=${encodeURIComponent(q.trim())}`}
            onMouseDown={(ev) => {
              ev.preventDefault();
              go(`/products?q=${encodeURIComponent(q.trim())}`);
            }}
            className="block border-t border-line px-3 py-2 text-xs font-medium text-sage-deep hover:bg-sage-tint"
          >
            See all results for “{q.trim()}”
          </Link>
        </div>
      ) : null}
    </form>
  );
}
