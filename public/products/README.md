Catalogue photography (2026-11-13, GPT Image 2.6 via Higgsfield, masters in
docs/brand/generated/96–107). One set, one style: a seamless warm kraft-tan
paper sweep, the back wall falling into umber at the top, one hard key light
from the upper left, a long shadow to the lower right, the product small and
centred. 2:3 portrait; the catalogue cards show the photo whole and the
product-page gallery shows it at 4:5 with object-cover.

Per SKU:

  [SKU]-front.jpg   the product alone, standing (cards, gallery 1); 1376 px wide, upscaled from the 1k frame
  [SKU]-alt.jpg     cups: on their side, the base mark towards camera; lid: on a 12 oz cup (card hover, gallery 2)

Shared (src/lib/catalog/assets.ts `sharedPhoto(name)`):

  shared-trio.jpg          8, 12 and 16 oz in a row (home feature card, cup galleries)
  shared-lid-on.jpg        the 12 oz wearing the lid (same frame as MTD-LID-HOT-alt)
  shared-case.jpg          a kraft shipping case, flaps open, wordmark on the front
  shared-life-hand.jpg     a barista holding a lidded cup (lids featured tile, galleries)
  shared-life-counter.jpg  a lidded cup on a café counter with a croissant, 3:2 (products featured tile, product-page band)

The site picks these up automatically through photoFor()/sharedPhoto(); every
URL carries ?v=ASSET_VERSION from src/lib/asset-version.ts, so bump that
constant whenever a file here is replaced.
