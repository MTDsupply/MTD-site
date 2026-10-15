export function SearchForm({ className = "", defaultValue = "" }: { className?: string; defaultValue?: string }) {
  return (
    <form action="/products" method="get" role="search" className={`flex ${className}`}>
      <label htmlFor="site-search" className="sr-only">
        Search products or SKU
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search or SKU"
        className="input rounded-r-none py-1.5 text-sm"
      />
      <button type="submit" className="btn btn-outline btn-sm rounded-l-none border-l-0">
        Search
      </button>
    </form>
  );
}
