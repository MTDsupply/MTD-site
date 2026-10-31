import Link from "next/link";

/**
 * "As heard on" press strip. One outlet for now: CBC Radio One's All Points
 * West (Vancouver Island's afternoon show) with host Jason D'Souza. The CBC
 * gem is used for identification only, so it stays in CBC red at a fixed size
 * with clear space around it. Add `href` when the segment link is available.
 */
export const PRESS = [
  {
    outlet: "CBC Radio One",
    logo: "/press/cbc.svg",
    show: "All Points West",
    host: "Jason D'Souza",
    blurb: "We joined host Jason D'Souza on Vancouver Island's afternoon show to talk about cups that go in the home compost.",
    href: null as string | null,
  },
];

export function PressBand() {
  return (
    <section aria-labelledby="press-heading" className="mt-10 border-b border-line pb-10">
      <p id="press-heading" className="t-label text-center text-sage-deep">
        As heard on
      </p>
      <ul className="mt-6 flex flex-col items-stretch gap-4 md:flex-row md:justify-center">
        {PRESS.map((p) => {
          const body = (
            <div className="flex items-center gap-6 px-6 py-5 md:px-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt={p.outlet} width={56} height={56} className="h-14 w-14 shrink-0" />
              <div className="min-w-0 border-l border-line pl-6">
                <p className="t-card text-[17px] leading-[22px]">
                  {p.outlet} · {p.show}
                </p>
                <p className="mt-1 text-sm text-soil/70">{p.blurb}</p>
                {p.href ? <span className="link mt-2 inline-block text-sm font-medium">Listen to the segment</span> : null}
              </div>
            </div>
          );
          return (
            <li key={p.show} className="glass max-w-2xl">
              {p.href ? (
                <Link href={p.href} className="block hover:bg-white/60">
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
