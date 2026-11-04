import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <p className="t-label text-forest">404</p>
      <h1 className="t-page mt-2">That page has gone.</h1>
      <p className="mt-3 max-w-[52ch] text-soil/75">The products have not. Head back to the catalogue, or search by SKU in the header.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/products" className="btn btn-primary btn-sm">
          Browse the catalogue
        </Link>
        <Link href="/" className="btn btn-outline btn-sm">
          Back to the start
        </Link>
      </div>
    </div>
  );
}
