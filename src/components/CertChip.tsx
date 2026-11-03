import Link from "next/link";
import type { Cert } from "@/lib/catalog/types";

/**
 * Certification as UI: the claim and the proof are never separated.
 * Live SKUs get a Sage chip linking to their row on /certifications;
 * coming-soon items get a Fog "Certification pending" chip.
 */
export function CertChip({ cert, sku, pending, compact = false }: { cert?: Cert; sku?: string; pending?: boolean; compact?: boolean }) {
  if (pending || !cert) return null;
  const label = compact ? "Certified home-compostable material" : `${cert.name} · ${cert.certifier}${cert.number ? ` · No. ${cert.number}` : ""}`;
  const title = `${cert.name} · ${cert.certifier}${cert.number ? ` · No. ${cert.number}` : ""}`;
  if (compact) {
    return (
      <Link href={`/certifications#${sku ?? cert.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-sage-deep hover:underline" title={title}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="m5 12 5 5 9-10" />
        </svg>
        {label}
      </Link>
    );
  }
  return (
    <Link href={`/certifications#${sku ?? cert.id}`} className="chip chip-sage" title={title}>
      {label}
    </Link>
  );
}
