Catalogue photography (reshot 2026-11-14 on a dark green sweep, GPT Image 2.6
via Higgsfield at quality medium, masters in docs/brand/generated/108–119;
the kraft set of 2026-11-13 is masters 96–107; the three cup alts were reshot
with the current badge on 2026-11-14 (masters 120–122) and again the same day
with the badge printed without its placeholder circle, first at a three-quarter
angle (masters 124–126) then tipped over in a side view (masters 129–131, rejected: the open mouth
read as a hole), and finally lying down with the mouth turned away into the
background so no opening shows and the body widens from the marked base to the
rim (masters 132–134, the installed set; reference
docs/brand/badge-cup-base-nocircle.png). One set, one style: a
seamless deep bottle-green paper sweep (floor about #1D372A, the back wall
falling into near-black green at the top), one hard key light from the upper
left, a long shadow to the lower right, the product small and centred. The
kraft frames were passed to the model as composition references, so each
green frame matches its predecessor and the base mark is the current badge without its circle
(docs/brand/badge-cup-base-nocircle.png; the circle in badge-cup-base.png was
only a placeholder for the cup base): the wordmark straight across, HOME
COMPOSTABLE and NO MICROPLASTICS stacked beneath it, the dissolving-cup icon
at the bottom. 2:3 portrait; the
catalogue cards show the photo in a well 12% taller than the card so the
product sits in the middle band, and the product-page gallery is square with
object-cover.

Per SKU:

  [SKU]-front.jpg   the product alone, standing (cards, gallery 1); 1360 × 2048
  [SKU]-alt.jpg     cups: lying down, mouth turned away, the marked base to camera; lid: on a 12 oz cup (card hover, gallery 2); 688 × 1024

Shared (src/lib/catalog/assets.ts `sharedPhoto(name)`):

  shared-trio.jpg          8, 12 and 16 oz in a row (home feature card, cups-page closer tile, cup galleries)
  shared-lid-on.jpg        the 12 oz wearing the lid (same frame as MTD-LID-HOT-alt; lids-page closer tile)
  shared-case.jpg          a kraft shipping case, flaps open, wordmark on the front
  shared-life-hand.jpg     a barista holding a lidded cup against a green wall (lids featured tile, products-page closer, galleries)
  shared-life-counter.jpg  a lidded cup on a green stone counter with a croissant, 3:2, 2048 × 1360 (products featured tile, product-page band)

The site picks these up automatically through photoFor()/sharedPhoto(); every
URL carries ?v=ASSET_VERSION from src/lib/asset-version.ts, so bump that
constant whenever a file here is replaced.
