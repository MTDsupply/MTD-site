/** Endless band of short claims, CSS only; duplicated so the loop is seamless. */
function Track({ items, hidden = false }: { items: string[]; hidden?: boolean }) {
  return (
    <ul className="marquee-track items-center" aria-hidden={hidden}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-6 px-3 font-display text-[15px] font-semibold uppercase tracking-[0.08em] md:text-[16px]">
          {t}
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" className="text-butter">
            <path fill="currentColor" d="M12 1.5 14.6 9.4 22.5 12l-7.9 2.6L12 22.5 9.4 14.6 1.5 12l7.9-2.6z" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <div className={`marquee py-3 ${className}`}>
      <Track items={items} />
      <Track items={items} hidden />
    </div>
  );
}
