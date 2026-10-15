import Link from "next/link";
import type { Cert, Product } from "@/lib/catalog/types";
import { count } from "@/lib/format";

export function SpecTable({ product, cert }: { product: Product; cert?: Cert }) {
  const rows: [string, React.ReactNode][] = [
    ["SKU", <span key="sku" className="sku">{product.sku}</span>],
    ["Material", product.material],
    ["Lining", product.specs.lining ?? "—"],
    ["Size", product.size],
    ["Capacity", product.specs.capacity ?? "—"],
    ["Rim diameter", product.specs.rimDiameter ?? "—"],
    ["Length", product.specs.length ?? "—"],
    ["Case count", `${count(product.caseCount)} units`],
    ["Pack count", `${count(product.packCount)} units`],
    ["Case dimensions", product.specs.caseDimensions ?? "—"],
    ["Case weight", product.specs.caseWeight ?? "—"],
    ["Certification", cert ? cert.name : "In testing"],
    ["Certifier", cert ? cert.certifier : "TÜV Austria"],
    [
      "Certificate",
      cert ? (
        <Link key="cert" href={`/certifications#${product.sku}`} className="link-proof">
          {cert.number ? `No. ${cert.number}` : "View on the certifications page"}
        </Link>
      ) : (
        "—"
      ),
    ],
  ].filter(([, v]) => v !== "—") as [string, React.ReactNode][];

  return (
    <table className="spec-table w-full text-sm">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row">{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
