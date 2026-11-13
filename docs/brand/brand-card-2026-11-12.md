# Brand card (supplied 2026-11-12)

The user supplied this card as a PDF in chat on 2026-11-12 and asked for it to be applied to the whole site. The PDF itself was not saved to the repo; this file records its rules. It supersedes the colour and type guidance in docs/brand-card.md; the routes, data model and claims rules there still apply.

## Palette

| name | hex | use |
| --- | --- | --- |
| bone | #EDE8DF | page ground |
| paper | #F6F2EB | cards, inputs, image wells |
| ink | #111111 | text, primary button |
| soil | #2A2420 | the one dark band per page (the footer) |
| stone | #6B675F | secondary text, labels |
| ash | #8B877F | disabled, coming soon, borders only; never body text |
| raw bamboo | #C4A672 | only as a left rule on notes |

## Type

- Helvetica Neue / Helvetica / Arial system stack. No web fonts (JetBrains Mono stays for SKUs).
- Hero 72 / 1 / 700 / -0.04em; section 40; page and heading 26; card 19; lead 20 / 500; label 11.5 caps in stone.
- Headings are lowercase and end with a period, written into the copy itself. Acronyms (PHA, PLA, SKU, TÜV, CBC) keep their case.

## Surfaces

- Square corners everywhere except buttons and chips, which are pills.
- Hairlines (rgba(17,17,17,.14)) separate things. No shadows, gradients, glass, mesh or grain.
- Cards are paper with a hairline and a colour-only hover.
- One primary (ink) button per screen; every other button is outlined. Text links otherwise.
- Chips are outlined and lowercase.
- Tables: hairline rows with an ink rule under the header row.
- Content column 1120 px with 28 px gutters (16 px on phones).
- Notes: a 2 px raw-bamboo left rule, stone text.

## Motion

- Fades only, 200 ms. No sliding, scaling or parallax. Marquees static.

## Photography

- One object, one hard light, a real shadow, on bone or soil.
- Product frames are 4:5 object-cover.
- No leaves, no green, no stock imagery, no atmosphere photos.

## Page shape

- Home: hero (product on bone, headline, one primary + a text link, hairline fact list), then numbered sections (01, 02…), the footer as the only soil band.
- Every other page: PageHeader (label, lowercase title, stone lead) under a hairline, then sections with small stone numbers or labels.
