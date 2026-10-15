import Link from "next/link";
import type { Cert } from "@/lib/catalog/types";

/**
 * Certification as UI: the claim and the proof are never separated.
 * Live SKUs get a Sage chip linking to their row on /certifications;
 * coming-soon items get a Fog "Certification pending" chip.
 */
export function CertChip({ cert, sku, pending, compact = false }: { cert?: Cert; sku?: string; pending?: boolean; compact?: boolean }) {
  if (pending || !cert) return null;
  return (
    <Link
      href={`/certifications#${sku ?? cert.id}`}
      className="chip chip-sage"
      title={`${cert.name} · ${cert.certifier}${cert.number ? ` · No. ${cert.number}` : ""}`}
    >
      {compact ? "Certified home-compostable material" : `${cert.name} · ${cert.certifier}${cert.number ? ` · No. ${cert.number}` : ""}`}
    </Link>
  );
}
