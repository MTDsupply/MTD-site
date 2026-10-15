export type Status = "live" | "coming_soon";

export type Category = {
  slug: string;
  name: string;
  /** Short label used in the mega-menu and footer. */
  shortName?: string;
  description: string;
  status: Status;
  /** Path of the generic line drawing for this category. */
  lineDrawing: string;
  sortOrder: number;
};

export type PackTier = { count: number; price: number };

export type Product = {
  sku: string;
  categorySlug: string;
  name: string;
  size: string;
  /** Material line, e.g. "PHA-lined paper". */
  material: string;
  /** Unit price in CAD when buying by the case. */
  unitPrice: number;
  casePrice: number;
  caseCount: number;
  /** Consumer pack tiers, smallest first (Cup Casa sells 100 / 200 / 500). */
  packs: PackTier[];
  /** Smallest pack, derived from `packs` for convenience. */
  packPrice: number;
  packCount: number;
  certId: string | null;
  images: string[];
  status: Status;
  /** Spec table fields. */
  specs: {
    lining?: string;
    capacity?: string;
    rimDiameter?: string;
    length?: string;
    caseDimensions?: string;
    caseWeight?: string;
  };
  /** SKUs that pair with this product (rendered in "Goes with"). */
  goesWith: string[];
  /** Sort order within the category. */
  sortOrder: number;
  /** Resolved on the server: line drawing path for this SKU (falls back to the category drawing). */
  drawing?: string;
  /** Resolved on the server: front photo path, or null for the Paper placeholder. */
  photo?: string | null;
};

export type Cert = {
  id: string;
  name: string;
  certifier: string;
  /** Null until the certificate is issued. */
  number: string | null;
  pdfUrl: string | null;
  coveredSkus: string[];
};

export type NotifyRequest = {
  email: string;
  categorySlug: string;
};

export type Catalog = {
  categories: Category[];
  products: Product[];
  certs: Cert[];
};
