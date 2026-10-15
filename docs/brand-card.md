# Made to Disappear — Brand Card & Site Map

Oct 8, 2026 · @Sullivan Bryan

## Brand card

Made to Disappear is the company and the product brand: one name across cups, lids, straws, to-go containers and napkins, all certified home compostable. Cup Casa stays as the café-facing cup brand under it.

| Field | Value |
| --- | --- |
| Legal name | Made to Disappear |
| Brand name | Made to Disappear (short: MTD) |
| Tagline | Made to disappear. (sentence case, full stop) |
| Positioning | Compostable foodservice disposables, sold by the case to businesses and in smaller packs direct to consumers. Volume supplier, not a boutique. |
| Relationship to Cup Casa | Cup Casa = the café cup brand, a product line of MTD. Lockup on Cup Casa material: Cup Casa logo with a small line underneath, "a Made to Disappear product" |
| Audience | Primary: cafés, restaurants, caterers, event organisers, offices. Secondary: households buying a 50-pack |
| Feel | Same family as Cup Casa: clean, warm, honest. Uline's catalogue density with a modern face, not a Shopify store |
| Voice | Plain, confident, specific. Three words: direct, earthy, certified. Say what it's made of and what it's certified for; no "eco", "green", "planet-friendly" filler |
| Launch products | Hot cups (8/12/16 oz) and straws. Everything else listed as coming soon |

## Logo

One system: a wordmark plus a small standalone mark that stamps on a cup base, a straw wrapper, a napkin corner and a 1,000-count case label in one colour. Pick direction 1 unless you have a strong reason; it carries the idea without needing a picture, which also helps the trademark since the words alone are descriptive.

| Direction | What it is | Where it wins | Watch out |
| --- | --- | --- | --- |
| 1. Dissolve wordmark (recommended) | Lowercase geometric sans, "made to disappear" set on one line; the last 3–4 letters break apart into dots that drift right. Standalone mark: a single lowercase "d" dissolving the same way | Matches the Cup Casa login wipe; works at 15 mm on a cup base; instantly explains the name | Dot size must stay above flexo minimum (\~0.3 mm) or it fills in on print |
| 2. Buried cup | Small cup silhouette half-sunk below a horizon line, a two-leaf sprout above. Wordmark plain beside it | Reads like a certification badge; strong on case labels and the site header | Literal; gets busy once the range is boxes and napkins, not just cups |
| 3. Vanishing ring | A circle that goes from solid stroke to dotted to nothing, wordmark inside or under | Cleanest, most scalable, most "supplier" | Least memorable; could pass for a loading spinner |

Lockups to build: horizontal (site header, labels), stacked (cup base, social avatar), mark only (favicon, straw wrapper repeat). Minimum sizes: wordmark 40 mm wide, mark 8 mm. Clear space: height of the "m" on all sides.

Generation prompt for direction 1 (paste into your image model; generate 4–6, then I vector it):

```markdown
Minimal logo, flat vector, white background. Lowercase geometric sans-serif wordmark reading "made to disappear" on one line, in deep sage green (#4F6F52). The final letters "pear" disintegrate into small round dots that scatter to the right and fade, as if dissolving into air. Letters that remain are crisp and solid. No gradients, no shadows, no icons, no extra text, no background texture. Centered, generous margins, print-ready logo sheet style.
```

Variants to request: same prompt with charcoal #2B2B2B instead of sage; and a standalone lowercase "d" dissolving the same way, 1:1 crop.

## Palette, type, voice, claims

MTD gets an earthy palette built off the sage already on the Cup Casa cup footer, so the two brands sit together without MTD inheriting Cup Casa's navy/cyan.

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| Primary | Sage | #4F6F52 | Logo, primary buttons, category labels |
| Dark | Soil | #2B2B2B | Body text, footer, the dissolve dots |
| Light | Paper | #F4F1EA | Page background, labels, packaging base |
| Accent | Clay | #C8956D | In-stock badges, sale/price callouts, one accent per screen max |
| Mute | Fog | #B8B8B2 | Coming-soon tiles, disabled states, dividers |
| Pure | White | #FFFFFF | Product tiles, cards |

Type: one display face, one body face, both free on Google Fonts so Antigravity can pull them straight in.

| Role | Font | Weights | Notes |
| --- | --- | --- | --- |
| Display / wordmark | Outfit | 500, 600 | Geometric lowercase, closest free match to the logo; headings in sentence case |
| Body / UI | Inter | 400, 500, 600 | Tables, spec sheets, prices, forms; tabular numerals on for price columns |

Voice: direct, earthy, certified. Lead with material and certification, then the number.

- Yes: "16 oz hot cup. PHA-lined paper. Certified home compostable. 1,000 per case."
- No: "Our planet-friendly, guilt-free eco cups make every coffee a little greener."

Claims rules (these go in the footer, product pages and every ad; non-negotiable under the Competition Act):

| Say | Never say |
| --- | --- |
| Certified home compostable (name the certifier: TÜV Rheinland) | Biodegradable, marine-safe, ocean-safe, "disappears in the ocean" |
| No plastic lining / no microplastics (only where the cert covers it) | Accepted in municipal or CRD green bins |
| Breaks down in a home compost pile | Breaks down in landfill |
| Certified for the specific SKU | Blanket claims across SKUs that aren't yet certified |

## Site map and layout

The site reads like a supplier catalogue: every category visible on day one, most greyed out as coming soon, cups and straws live and pushed everywhere. One storefront serves both buyers, with a Business toggle that switches prices to per-case and unlocks net terms / bulk quote.

**Site map**

| Route | Page | Launch state |
| --- | --- | --- |
| / | Home | Live |
| /products | Full catalogue grid, all categories | Live (mixed) |
| /products/cups | Hot cups 8/12/16 oz | Live |
| /products/straws | Straws | Live |
| /products/lids | Lids | Coming soon |
| /products/containers | To-go containers and boxes | Coming soon |
| /products/napkins | Napkins | Coming soon |
| /products/cutlery | Cutlery | Coming soon |
| /products/sleeves | Sleeves | Coming soon |
| /products/bags | Bags | Coming soon |
| /products/\[category\]/\[sku\] | Product detail | Live for cups, straws |
| /business | Wholesale: case pricing, net terms, bulk quote form, Cup Casa OS mention | Live |
| /certifications | Every cert, the certifier, the SKU it covers, PDF downloads | Live |
| /about | Who, Victoria, why the name | Live |
| /cart, /checkout | Stripe checkout | Live |
| /account | Orders, reorder, saved addresses | Live |
| /contact | Form + phone + email | Live |

**Global**

- Header: logo left; Products (mega-menu listing every category, coming-soon ones in Fog with a tag); Business; Certifications; About. Right: search, Business/Consumer toggle, cart. No hero carousel, no promo bar.
- Footer: category list repeated in full, certifications line with the claims rule applied, legal name "Made to Disappear", Victoria BC, contact. Newsletter field labelled "New product alerts" (this is how coming-soon tiles convert).
- Coming-soon tile pattern used everywhere: Fog background, product line drawing at 40% opacity, category name, "Coming soon" tag in Clay, single "Notify me" link opening an email capture tagged with that category.

**Home (/)**

1. Hero: left half, headline "Compostable foodservice supplies. Made to disappear." Sub: "Certified home compostable cups and straws, in stock in Victoria. Cases for businesses, packs for everyone else." Two buttons: Shop cups (Sage), Shop straws (outline). Right half: real photo of the cup and straw range on Paper background, no lifestyle scene.
2. Trust bar: four short items, Certified home compostable · In stock, ships from Victoria · Case or pack · No minimums for consumers.
3. In stock now: two large product cards side by side, Cups and Straws, each with price-from, size options, Add to cart. This is the main block; it sits above the fold on desktop.
4. Full range grid: 8 tiles, 2 live + 6 coming soon in the pattern above. Headline "Everything we're making." This is the Uline signal: breadth on display.
5. For businesses: three columns, Case pricing · Net-30 on approval · Delivery in Greater Victoria, button to /business.
6. Why it disappears: one short paragraph, the certifier named, link to /certifications. No claims beyond the table above.
7. Founders line: one sentence, photo, Victoria. Then footer.

**Products (/products)**

- Left: filter rail (category, size, case/pack, in stock). Top: Business/Consumer toggle repeated.
- Grid: dense, 4 across on desktop, every product and every coming-soon category in one grid so the page looks full. Live items first, coming-soon after, each coming-soon category as one tile.
- Row style: image, name, size, material, cert badge, price per unit and per case, Add to cart or Notify me.

**Product detail (/products/cups/16oz-hot)**

- Left: gallery (plain product on Paper, base showing the logo, size comparison shot).
- Right: name, one-line spec, cert badge linking to /certifications, size switcher (8/12/16), quantity by pack or case with the unit price updating, Add to cart, business line "Buying 10+ cases? Get a quote."
- Below: spec table (material, lining, capacity, rim diameter, case count, case dimensions, certification, certifier, cert number), then "Goes with" showing lids as a coming-soon tile and straws live.

**Business (/business)**

- Hero: "Supply for cafés, restaurants, caterers and events."
- Case price table for every live SKU, then a quote form (company, volume per month, categories wanted including coming-soon ones, delivery address). One line on Cup Casa OS and auto-replenishment for café accounts.

**Certifications (/certifications)**

- One table: SKU, certification, certifier, cert number, PDF. Rows for coming-soon SKUs show "Pending". This page is what makes the tagline defensible.

**Data model (so the coming-soon logic is one flag, not duplicated pages)**

```markdown
Category { slug, name, status: live | coming_soon, lineDrawing, sortOrder }
Product  { sku, categorySlug, name, size, material, unitPrice, casePrice, caseCount, certId, images[], status }
Cert     { id, name, certifier, number, pdfUrl, coveredSkus[] }
Notify   { email, categorySlug, createdAt }
```

## Design direction

Model the structure on Uline and the trade features on Vegware, then add five Made to Disappear signatures so it doesn't read as a template. I pulled both homepages today ([Uline](https://www.uline.com/), [Vegware US](https://www.vegwareus.com/us/)); World Centric blocks automated reads.

**Borrow from Uline (the volume-supplier signal)**

| Pattern | What Uline does | MTD version |
| --- | --- | --- |
| Phone number in the header | 1-800 number sits beside the logo on every page | Victoria number top right: "Order by phone 250-xxx-xxxx". Even if nobody calls, it says "real supplier" |
| Quick order by SKU | Nav item "Quick Order → Order by model number" | /quick-order: paste SKUs + quantities, one Add all. Every product gets a visible SKU like MTD-CUP-16H |
| Category tile grid | One grid of every category, photo + name, nothing else | Home block 4 and /products: same grid, live tiles in colour, coming-soon tiles in Fog |
| Fulfilment promise bar | "Order by 6 pm for same-day shipping" | "Order by 11 am for same-day delivery in Greater Victoria" (matches your Cup Casa OS rule) |
| Catalogue PDF | Request a catalog / view online catalog | One-page PDF price list, auto-generated from the Product table, linked in header and footer |
| Locations line | City list across the bottom | "Victoria · Vancouver (2027) · Calgary (2027)" in the footer: same coming-soon logic applied to geography |

**Borrow from Vegware (the certified-packaging signal)**

| Pattern | What Vegware does | MTD version |
| --- | --- | --- |
| Sign in / Register in the top bar | Trade accounts live in the header, not a separate portal | Business/Consumer toggle plus Sign in; business accounts see case pricing and net terms after approval |
| Certification link in footer | Footer column "Products → Certification" | /certifications in both the header and footer, plus a cert badge on every product card |
| Product list PDF | Downloadable catalogue PDF | Same as above |
| Third-party badge in footer | B Corp logo | TÜV Rheinland mark (once you have usage rights) and nothing else; no made-up badges |
| Why-choose block | Three columns: made from plants, support, waste expertise | Three columns: certified for home compost, in stock in Victoria, one supplier for the whole range |

**Made to Disappear signatures (the part that's ours)**

1. The dissolve. The logo's dot-scatter is the only motion on the site: wordmark dissolves on page load (400 ms, once per session), product images dissolve on hover into their line drawing, coming-soon tiles are the line drawing dissolving *in*. Same particle system everywhere; nothing else animates.
2. Certification as UI, not decoration. Every product card carries a small Sage chip "Home compostable · TÜV Rheinland · No. xxxx" that links to the cert row. Coming-soon tiles carry a Fog chip "Certification pending". The claim and the proof are never separated.
3. The base stamp. Product photography shows the printed base at least once per product, cup tipped to reveal it. It's the brand's signature mark and the one thing competitors can't copy.
4. Soil line. One thin horizontal rule in Sage, 2 px, under the header and above the footer, with the line drawing of a cup half below it at the footer. Echoes the Cup Casa login cross-section without the full illustration.
5. Line drawings for every SKU. One consistent 1.5 px Soil-coloured technical drawing per product (front view, dimensions marked). Used for coming-soon tiles, hover states, spec tables and the PDF price list. This is what makes an 8-category grid with 2 live categories still look like a 50-SKU supplier.

**Photography rules**

- Products on Paper #F4F1EA seamless, soft daylight, slight top-left shadow, no props, no hands, no coffee. One angle set per SKU: front, 3/4, base, case.
- No lifestyle, no stock photos, no compost piles or ocean scenes (marine claim risk).
- Shoot the real cups and straws; one consistent set is worth more than ten AI renders.

**What to avoid**

- Shopify defaults: centered hero text over a photo, product carousel, "Shop the look", review stars on the homepage, countdown timers, pop-ups on entry.
- Leaf icons, globe icons, green gradients, the word "eco" in any heading.
- A separate "Wholesale" site. One store, one toggle.

## Antigravity build prompt

Paste this as the first message to Fable in Antigravity, with the sections above attached as context. It builds the whole site in one pass against the data model, so flipping a category live later is one field change.

```markdown
Build the Made to Disappear website: a compostable foodservice supplies store that sells to businesses and consumers from one storefront.

Stack: Next.js 15 (App Router), TypeScript, Tailwind, Supabase (Postgres + auth), Stripe Checkout, Resend for email. Deploy target Vercel.

Brand (attached brand card is the source of truth):
- Colours as Tailwind tokens: sage #4F6F52, soil #2B2B2B, paper #F4F1EA, clay #C8956D, fog #B8B8B2, white.
- Fonts: Outfit (display, 500/600) and Inter (body, 400/500/600) from Google Fonts. Headings sentence case. Tabular numerals on prices.
- Logo: use /public/logo-wordmark.svg and /public/logo-mark.svg (placeholders until I drop the real files in).
- Voice: plain and specific. Never use the words biodegradable, marine, ocean, landfill, municipal, green bin, eco, planet-friendly anywhere in copy. Compostability is always "certified home compostable" with the certifier named.

Feel: a volume supplier catalogue (think Uline) with Vegware's certification seriousness and a modern face. Follow the attached Design direction section exactly: phone number in the header, /quick-order by SKU, every product has a visible SKU (MTD-CUP-16H pattern), fulfilment promise bar, auto-generated PDF price list, locations line in the footer. No hero carousel, no promo bar, no lifestyle photography, no countdown timers, no entry pop-ups, no leaf/globe icons, no green gradients. Dense grids, spec tables, prices per unit and per case. Brand signatures to build: (1) one shared particle dissolve effect used for the wordmark on first load, product image hover to line drawing, and coming-soon tiles fading in; nothing else animates; (2) a Sage cert chip on every product card linking to its /certifications row, Fog "Certification pending" chip on coming-soon tiles; (3) a 2 px Sage rule under the header and above the footer with a half-buried cup line drawing at the footer; (4) a LineDrawing component per SKU loaded from /public/drawings/[sku].svg, falling back to a generic category drawing.

Data model (Supabase tables): Category, Product, Cert, Notify as specified in the attached doc. Seed Categories: cups (live), straws (live), lids, containers, napkins, cutlery, sleeves, bags (all coming_soon). Seed Products: 8oz, 12oz, 16oz hot cups (unit 0.18/0.20/0.22 CAD, case of 1,000) and one straw SKU with placeholder pricing.

Core rule: a category's status drives everything. coming_soon categories render as a Coming-soon tile (fog background, line drawing at 40% opacity, Clay "Coming soon" tag, "Notify me" that captures email + category into Notify) in the home grid, the /products grid, the mega-menu and the footer. Live categories render product cards with Add to cart. Flipping status to live must change every surface with no other edits.

Business/Consumer toggle in the header, persisted in a cookie: Consumer shows per-pack pricing, Business shows per-case pricing and a "Get a quote" CTA on every product.

Routes and page layouts: build exactly as specified in the attached site map section, including Home blocks 1–7 in that order, /products with filter rail, product detail with spec table and "Goes with", /business with case price table and quote form, /certifications table with "Pending" rows for coming-soon SKUs, /about, /contact, cart/checkout via Stripe, /account with order history and one-click reorder.

Quote form and Notify submissions email hello@ via Resend and store in Supabase.

Mobile first; grids go 4 → 2 → 1. Lighthouse 90+ on all pages. Use real product photos from /public/products/ when present, otherwise a neutral Paper-coloured placeholder with the product name.

Start by scaffolding the project, creating the Supabase schema and seed, then build pages in this order: layout + header/footer, Home, /products, product detail, /business, /certifications, cart/checkout, /account, /about, /contact. Show me Home before moving past it.
```

Before you paste it: drop the final logo SVGs into /public, confirm straw pricing and case count, and get the TÜV Rheinland cert number and PDF so /certifications isn't empty on launch.
