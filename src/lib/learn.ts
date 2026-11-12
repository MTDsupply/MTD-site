import { site } from "@/lib/site";

/*
 * The Learn library: long-form explainers on cup linings, written to be quoted
 * by search engines and AI assistants. Every number traces to a source listed on
 * the article, and every source is a standard, a regulator, a certifier, a
 * peer-reviewed paper or a manufacturer's own technical page. Keep claims inside
 * docs/brand-card.md and the copy lint: say what the material is and what the
 * test showed, never more.
 *
 * Inline syntax in paragraphs: [text](href) for links, **text** for emphasis.
 */

export type Source = { id: string; cite: string; href: string };
export type Section = { h: string; p?: string[]; list?: string[]; table?: { head: string[]; rows: string[][] } };
export type Article = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  summary: string[];
  sections: Section[];
  faq: [string, string][];
  sources: string[];
  related: string[];
  updated: string;
};

export const SOURCES: Record<string, Source> = {
  eu: {
    id: "eu",
    cite: "European Commission, Commission guidelines on single-use plastic products in accordance with Directive (EU) 2019/904, Official Journal C 216, 7 June 2021.",
    href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021XC0607(03)",
  },
  tuvCompare: {
    id: "tuvCompare",
    cite: "TÜV Austria, Comparison of compostability standards (EN 13432, ISO 17088, ASTM D6400, AS 4736, ISO 18606), 2024.",
    href: "https://okcert.tuvaustria.com/wp-content/uploads/sites/76/2024/12/PD-BA-TABE-CERT-BIO-ID-415_comparison_standards_EN_2407.pdf",
  },
  tuvHome: {
    id: "tuvHome",
    cite: "TÜV Austria, OK compost HOME certification mark: scope and the standards based on it (AS 5810, NF T 51-800, EN 17427).",
    href: "https://okcert.tuvaustria.com/ok-compost-home-en/",
  },
  seedling: {
    id: "seedling",
    cite: "TÜV Austria Belgium, Certification scheme Seedling (based on EN 13432), 2024, section on constituents and additives.",
    href: "https://be.tuvaustria.com/wp-content/uploads/sites/73/2024/03/CS-Seedling_EN.pdf",
  },
  narancic: {
    id: "narancic",
    cite: "Narancic, T. et al., Environmental Science & Technology 52(18), 2018. Fifteen polymers and blends tested in compost, soil, fresh water and seawater.",
    href: "https://doi.org/10.1021/acs.est.8b02963",
  },
  meereboer: {
    id: "meereboer",
    cite: "Meereboer, K. W., Misra, M. and Mohanty, A. K., Review of recent advances in the biodegradability of polyhydroxyalkanoate (PHA) bioplastics and their composites, Green Chemistry 22, 5519–5558, 2020.",
    href: "https://doi.org/10.1039/D0GC01647K",
  },
  yang: {
    id: "yang",
    cite: "Yang, L. et al., Microparticle release from PLA-lined and PE-lined single-use paper cups, Chemical Engineering Journal 468, 143620, 2023.",
    href: "https://doi.org/10.1016/j.cej.2023.143620",
  },
  shi: {
    id: "shi",
    cite: "Shi, Y. et al., Plastic particle release from PLA-lined and PE-lined takeaway cups into hot water, ACS Food Science & Technology, 2026.",
    href: "https://doi.org/10.1021/acsfoodscitech.6c00541",
  },
  ranjan: {
    id: "ranjan",
    cite: "Ranjan, V. P., Joseph, A. and Goel, S., Microplastics and other harmful substances released from disposable paper cups into hot water, Journal of Hazardous Materials 404, 124118, 2021.",
    href: "https://doi.org/10.1016/j.jhazmat.2020.124118",
  },
  dow: {
    id: "dow",
    cite: "Dow, Barrier coatings for fibre-based foodservice packaging: product page listing acrylic latex, styrene-acrylic latex and polyolefin dispersion coatings for cup stock.",
    href: "https://www.dow.com/en-us/market/mkt-pulp-paper/sub-paper-barrier-coating/app-paper-barrier-quick-serve.html",
  },
  eupia: {
    id: "eupia",
    cite: "EuPIA (European Printing Ink Association), Statement on the applicability of the Single-Use Plastics Directive to functional coatings, November 2025.",
    href: "https://www.eupia.org/wp-content/uploads/2025/11/202511_Statement-on-functional-coatings-and-Single-Use-Plastics-Directive_Final.pdf",
  },
  bureau: {
    id: "bureau",
    cite: "Competition Bureau Canada, Environmental claims and the Competition Act, enforcement guidelines, June 2025.",
    href: "https://competition-bureau.canada.ca/en/how-we-foster-competition/education-and-outreach/publications/environmental-claims-and-competition-act",
  },
};

const HOME_RULE = `Home-compost certification asks the material to break down at the temperature of a garden pile, not the 58 °C of an industrial facility. ${site.certifier}'s OK compost HOME mark is the scheme the home-compost standards (AS 5810, NF T 51-800 and EN 17427) were written from.`;

export const ARTICLES: Article[] = [
  {
    slug: "pha-vs-pla",
    title: "PHA vs PLA: what actually happens to each cup lining",
    eyebrow: "Cup linings, compared",
    description:
      "PHA and PLA are both called compostable. One breaks down in a backyard pile and the other needs a 58 °C industrial facility. The chemistry, the test data, the microplastics studies and what to ask a supplier.",
    summary: [
      "Both polymers come from fermentation, but PLA is only the first step: the fermented lactic acid is then polymerised in a chemical plant. PHA is the finished polymer when it leaves the microbe.",
      "PLA passes the industrial compost standards, which run at 58 ± 2 °C. In a 2018 study across fifteen materials, PLA on its own did not break down under home-composting conditions, while PHB (the most common PHA) broke down in every soil and water condition tested.",
      "Two peer-reviewed studies found PLA-lined cups shed more plastic particles into hot drinks than polyethylene-lined cups, not fewer.",
      "A PLA cup that does not reach an industrial composter is not composted. A certified home-compostable PHA cup does not depend on a facility.",
    ],
    sections: [
      {
        h: "What the two materials are",
        p: [
          "**PLA (polylactic acid)** starts with plant sugar, usually corn or sugarcane. Microbes ferment the sugar into lactic acid. That acid is then purified, converted to lactide and polymerised with heat, vacuum and a metal catalyst into a stiff, glassy plastic. The fermentation is biological; the polymer is made in a reactor.",
          "**PHA (polyhydroxyalkanoate)** is a family of polyesters that bacteria build inside their own cells as an energy store, the way we store fat. Fed a carbon source and starved of a nutrient, the cells fill with PHA granules; the polymer is then washed out of the cells. The most common grades are PHB and PHBV. Nothing is polymerised afterwards. What the microbe made is the material on the cup.",
          "That origin is why the two behave differently at the end of life. Microbes that can digest PHA are common in soil, compost and water because PHA is something microbes have always made and eaten. Microbes that attack PLA are scarce, and PLA first has to be broken apart by heat and water before any of them can start.",
        ],
      },
      {
        h: "Where each one breaks down",
        p: [
          "Every industrial compost standard (EN 13432, ISO 17088, ASTM D6400, AS 4736) uses the same core test: 90% of the carbon in the material must be converted to carbon dioxide by microbes within six months in compost held at 58 ± 2 °C, with the material disintegrated to under 2 mm within twelve weeks. PLA is designed to pass exactly that test. The heat does the first half of the work, splitting the polymer chains by hydrolysis, and microbes finish the fragments.",
          `Take the heat away and PLA stalls. ${HOME_RULE}`,
          "The clearest independent comparison is a 2018 study in Environmental Science & Technology that put fifteen polymers and blends through controlled composting, home-composting, soil, fresh-water and seawater tests. PLA on its own did not break down under home-composting conditions. PHB was one of only two materials, with thermoplastic starch, that broke down completely in every soil and water condition tested. A 2020 review in Green Chemistry reached the same conclusion across the literature: PHB and PHBV biodegrade in all of the aerobic and anaerobic environments defined by the ASTM standards.",
        ],
        table: {
          head: ["", "PHA (ours)", "PLA"],
          rows: [
            ["Made by", "Bacteria, inside the cell; used as made", "Fermented lactic acid, then polymerised in a reactor"],
            ["Industrial compost (58 °C)", "Yes", "Yes"],
            ["Home compost (garden temperature)", "Yes, certified per SKU", "No. Did not break down in the 2018 comparison"],
            ["Soil and water", "PHB broke down in every condition tested", "Did not meet the soil or water standards"],
            ["What it needs", "Microbes, air, moisture", "Sustained heat first, then microbes"],
            ["If it misses the facility", "Composts anyway", "Persists"],
          ],
        },
      },
      {
        h: "Microplastics from the cup you drink from",
        p: [
          "Compostability is about the end of the cup's life. There is a separate question about the twenty minutes in the middle, when the lining is in contact with a hot drink.",
          "A 2023 study in Chemical Engineering Journal tested eight PLA-lined and polyethylene-lined cups under normal hot-drink conditions. The PLA cups released about 3.6 times as many microplastic particles as the PE cups, roughly 22,000 particles per litre, and 4.2 times as many particles in total once cellulose fibres were counted. A 2026 study in ACS Food Science & Technology found PLA-lined cups released around twelve times the plastic particle mass of PE-lined cups into hot water. Neither paper claims a proven health effect. Both show that swapping PE for PLA does not remove plastic particles from the drink; it tends to add them.",
          "PE itself is not clean: a 2021 Journal of Hazardous Materials study counted roughly 25,000 micron-sized particles released into a single cup of 85 to 90 °C water in fifteen minutes.",
          "PHA does not get a free pass from physics either: any lining can shed. The difference is what a shed particle is. A fragment of PLA or PE in soil or water is a persistent plastic particle. A fragment of PHA is food for the same microbes that compost the cup.",
        ],
      },
      {
        h: "The practical difference for a café",
        p: [
          "A PLA cup only composts if three things line up: your city collects food scraps, the facility accepts cups, and the facility runs hot enough for long enough. Miss one and the cup is treated as waste. Many Canadian facilities turn cups away because they cannot tell PLA from PE by eye.",
          "A certified home-compostable PHA cup composts in a backyard bin, a worm farm or a community garden pile, and in an industrial facility too. The customer who takes it home can deal with it. That is the whole reason we chose PHA.",
          "Ask any supplier two questions: what polymer is the lining, and does the certificate say home or industrial? If the answer to the first is PLA, the answer to the second is industrial, whatever the sleeve says.",
        ],
      },
    ],
    faq: [
      ["Is PLA home compostable?", "No. PLA is designed for industrial composting at around 58 °C. In an independent 2018 comparison it did not break down under home-composting conditions. Products certified home compostable use other polymers, such as PHA."],
      ["Is PHA better than PLA?", "For a cup that may not reach an industrial facility, yes. PHA is certified to break down in a home compost pile and breaks down in soil and water; PLA needs sustained industrial heat. PLA is cheaper and stiffer, which is why it is common."],
      ["Do PLA cups release microplastics?", "Yes. Peer-reviewed studies in 2023 and 2026 measured more plastic particles released from PLA-lined cups into hot drinks than from polyethylene-lined cups."],
      ["Are PHA and PLA both bioplastics?", "Both are made from renewable feedstocks and both are polymers, so both are bioplastics in the loose sense. They are different materials with different end-of-life behaviour, and the word bioplastic tells you nothing about where either one composts."],
      [`Are Made to Disappear cups PHA or PLA?`, `PHA. The paper cup is lined with PHA and the lid is PHA. Each SKU is certified home compostable by ${site.certifier}.`],
    ],
    sources: ["tuvCompare", "tuvHome", "narancic", "meereboer", "yang", "shi", "ranjan"],
    related: ["what-is-pha", "what-is-pla", "home-compostable-vs-industrial-compostable"],
    updated: "2026-11-11",
  },
  {
    slug: "pha-vs-water-based-coatings",
    title: "PHA vs water-based coatings: why plastic-free is not what it sounds like",
    eyebrow: "Cup linings, compared",
    description:
      "Water-based describes how a cup coating is applied, not what it is. Most aqueous barrier coatings are acrylic or styrene-acrylic plastics in water. What the EU rules say, how a thin plastic coating can sit under a compost certificate, and what to ask.",
    summary: [
      "A water-based (aqueous, dispersion) coating is a polymer suspended in water. The water evaporates on the paper machine; the polymer stays. The question is only ever which polymer.",
      "The common chemistries are acrylic latex, styrene-acrylic latex and polyolefin dispersions, according to the companies that make them. Those are conventional synthetic plastics.",
      "Under the EU Single-Use Plastics rules, a paper cup with a plastic coating is partly made of plastic and is in scope, whether the coating was extruded or painted on from water. German guidance says there is no general exemption for aqueous dispersions.",
      "Compost standards allow small fractions of a product to go untested. A thin synthetic coating can sit inside that allowance under some schemes, so a home compost certificate on the cup does not by itself tell you the coating breaks down.",
      "PHA is a polymer that microbes made and microbes eat. A persistent coating polymer in a compost pile does not vanish; it fragments.",
    ],
    sections: [
      {
        h: "What water-based means",
        p: [
          "Every paper cup needs a barrier or the coffee soaks through in minutes. For decades the barrier was a thin film of polyethylene pressed onto the board. The newer alternative is a **dispersion coating**: the barrier polymer is supplied as tiny particles suspended in water, rolled or sprayed onto the paper, and dried. The water goes up the dryer stack. The polymer particles fuse into a continuous film that does the same job the PE film did.",
          "So **water-based** is a description of the carrier and the application method. It says nothing about the chemistry of the film left behind. Water-based house paint is still acrylic paint once it dries, and the same is true here.",
          "The coating companies are clear about what the films are. Dow's barrier-coating range for cup stock and quick-serve packaging lists acrylic copolymer latex, styrene-acrylic latex and acid-modified polyolefin dispersions. The European coatings trade body describes the category as PE water-based suspensions and acrylic resin-based suspensions. Those are the same polymer families as plastic film, paint and glue.",
        ],
      },
      {
        h: "What the regulators say",
        p: [
          "The European Commission's guidelines on the Single-Use Plastics Directive deal with this directly. When a plastic coating or lining is applied to paper or board to protect it against water or grease, the product is a composite that is partly made of plastic and falls inside the Directive. The guidelines list empty paper-based cups with plastic lining or coating as covered, and separately list cups with bio-based plastic linings, and linings marketed as compostable, as covered too. Germany's FAQ on its implementing order answers the question of whether water-based or aqueous dispersions are exempt with: there is no general exception; it depends on the nature of the coating.",
          "The coatings industry disagrees and has asked for aqueous dispersions to be carved out, arguing that a thin acrylic layer is not a structural plastic. That argument may or may not win. What matters for a café owner is that the industry's own statement describes the coatings as acrylic and PE suspensions. Nobody in that debate is claiming the dried film is not a synthetic polymer.",
          "In Canada, the Competition Bureau's 2025 guidelines on environmental claims require a claim such as plastic-free to rest on adequate and proper testing done before the claim is made, and say a claim can be literally true and still create a misleading general impression that fine print does not cure. Since June 2025 private parties can apply to bring such cases themselves.",
        ],
      },
      {
        h: "How a plastic coating can sit under a compost certificate",
        p: [
          "This is the part that surprises people. The compost standards test the whole product, but they do not require every constituent to be tested for biodegradation. Under the EN 13432 family, constituents present at less than 1% of the item's mass do not have to demonstrate biodegradation, as long as the total of such untested constituents stays under 5%. The newer ISO and ASTM editions tighten this by requiring constituents between 1% and 10 to 15% to be tested individually.",
          `A barrier coating on a cup is a few grams per square metre on board that weighs a few hundred. It can land under 1%. Whether a certifier lets a non-compostable synthetic coating ride inside that allowance is up to the certifier. ${site.certifier} states in its own comparison of the standards that it does not accept any intentional addition of structural polymers deemed unable to biodegrade, at any concentration. Not every scheme says that, and the standards themselves do not.`,
          "So a home compost logo on a water-based cup can mean one of two things: the coating polymer was tested and breaks down, or the coating was small enough to be excused from the test. From the outside you cannot tell which. You have to ask.",
        ],
      },
      {
        h: "What is left behind",
        p: [
          "Compost microbes break polymers down by cutting the chain and eating the pieces. They have the enzymes for polyesters they have met for millions of years, which is why PHA, starch and cellulose go. Acrylic and styrene-acrylic polymers have carbon-carbon backbones that soil microbes do not cut in any useful timeframe; that durability is the reason they are used in exterior paint. A thin acrylic film in a compost pile does not become soil. The paper around it rots, the film breaks into flakes, and the flakes stay in the finished compost and go onto the garden with it.",
          "That is the microplastic problem in one sentence: the certification can be honest about the cup as a whole while the coating fragment persists, and the marketing word on the sleeve says plastic-free because the film was applied from water.",
          "PHA is also a polymer, and under the EU definition it counts as a plastic because it is made by industrial fermentation rather than found in nature. We do not hide from that. The difference is not the label; it is the ending. PHA is certified to be consumed by the microbes in a garden pile within the home-compost timeframe, with the whole cup tested, not a fraction excused.",
        ],
        table: {
          head: ["", "PHA lining", "Typical water-based coating"],
          rows: [
            ["Polymer", "Polyhydroxyalkanoate, made by bacteria", "Acrylic, styrene-acrylic or polyolefin latex"],
            ["How it is applied", "Extrusion coated or dispersion coated", "Dispersion coated from water"],
            ["Plastic under EU rules", "Yes (industrially fermented polymer)", "Yes (synthetic polymer coating)"],
            ["Breaks down in home compost", "Yes, certified per SKU", "Only if the polymer itself was tested and passed; often excused as <1%"],
            ["What is left after composting", "Carbon dioxide, water, biomass", "Polymer flakes if the film does not biodegrade"],
            ["Honest label", "PHA lined, home compostable, no microplastics", "Water-based coating; ask for the polymer"],
          ],
        },
      },
      {
        h: "Three questions that settle it",
        list: [
          "**What polymer is the coating?** If the supplier cannot name it, or says water-based or proprietary, treat it as acrylic until shown otherwise.",
          "**Was the coating polymer itself tested for biodegradation, or excused as a minor constituent?** Ask for the certificate and the test scope, not the logo.",
          "**Does the certificate cover the finished cup, home composting and this exact SKU?** A material certificate for the board is not a certificate for the cup.",
        ],
        p: [`We answer all three for every SKU on our [certifications page](/certifications): PHA, tested as the finished cup, certified home compostable by ${site.certifier}.`],
      },
    ],
    faq: [
      ["Are water-based coatings plastic-free?", "Not in the way the phrase suggests. Water-based describes how the coating is applied. The dried film is a polymer, most often acrylic, styrene-acrylic or polyolefin latex, which are conventional synthetic plastics. Under the EU Single-Use Plastics guidelines a paper cup with such a coating is partly made of plastic."],
      ["Can a water-based cup be certified home compostable and still contain plastic?", "Yes. Compost standards let constituents under 1% of the product's mass go untested for biodegradation, up to 5% in total. A thin coating can fall under that line. Some certifiers refuse non-compostable polymers at any level; the standards themselves do not. Ask whether the coating polymer was tested."],
      ["Do water-based coatings leave microplastics in compost?", "If the coating polymer does not biodegrade, the film fragments as the paper rots and the fragments remain in the finished compost. Acrylic and styrene-acrylic polymers are not among the materials that pass compost biodegradation tests on their own."],
      ["Is PHA a plastic?", "Under the EU definition, yes: polymers made by industrial fermentation are not counted as natural polymers. PHA is also certified to break down completely in home compost conditions, which is the property that matters for a cup. We say PHA lined and home compostable, and we show the certificate."],
      ["Is a PE-lined cup worse than a water-based one?", "They are often the same polymer family applied differently. Both are plastic films on paper. Neither composts at home unless the polymer has been tested and certified to."],
    ],
    sources: ["eu", "eupia", "dow", "seedling", "tuvCompare", "tuvHome", "bureau", "meereboer"],
    related: ["water-based-coatings", "what-is-pha", "home-compostable-vs-industrial-compostable"],
    updated: "2026-11-11",
  },
  {
    slug: "what-is-pha",
    title: "What is PHA? The cup lining that microbes make and microbes eat",
    eyebrow: "Deep dive",
    description:
      "PHA (polyhydroxyalkanoate) is a polyester that bacteria build inside their cells. How it is made, why it breaks down in soil, water and a garden compost pile, what the studies show, and what it is like as a hot-cup lining.",
    summary: [
      "PHA is the polymer bacteria store as an energy reserve. It is grown by fermentation and washed out of the cells; nothing is polymerised afterwards.",
      "Because microbes have always made and eaten it, the enzymes that digest PHA are common in soil, compost and water. PHB broke down in every soil and water condition tested in a 2018 fifteen-material comparison.",
      "It holds hot liquid, seals a cup seam and can be applied like any other lining. It costs more than PE or PLA, which is why most cups are not lined with it.",
    ],
    sections: [
      {
        h: "How PHA is made",
        p: [
          "Many bacteria, when they have plenty of carbon to eat but are short of another nutrient such as nitrogen, convert the extra carbon into granules of polyhydroxyalkanoate and store them in the cell, the way animals store fat. The granules can reach most of the cell's dry weight. Industrial PHA production copies that: a culture is fed a carbon source (sugars, vegetable oils, methane or waste streams depending on the producer), then nutrient-limited so the cells fill with polymer. The cells are harvested, broken open and the polymer is separated and dried into pellets.",
          "The polymer in the pellet is the polymer the cell made. That is the key contrast with PLA, where fermentation only produces a small molecule (lactic acid) and a chemical plant builds the polymer afterwards.",
          "PHA is a family, not one material. The simplest member is PHB (polyhydroxybutyrate), which is stiff and crystalline. Co-polymers such as PHBV and PHBH add a second building block to make the material tougher and easier to process. Cup linings use grades tuned for heat sealing and flexibility.",
        ],
      },
      {
        h: "Why it breaks down where other plastics do not",
        p: [
          "Biodegradation of a polymer needs an organism with an enzyme that can cut the chain. For most synthetic plastics no such organism exists in useful numbers, because the chemistry is new to biology. PHA is the opposite case: PHA-depolymerase enzymes are widespread in soil and water bacteria and fungi because PHA has been part of the microbial food web for as long as there have been bacteria.",
          "The 2018 Environmental Science & Technology comparison of fifteen polymers and blends found PHB was one of only two materials, with thermoplastic starch, that broke down completely in all of the soil and water conditions tested, alongside the managed composting conditions. The 2020 Green Chemistry review of the PHA literature concluded that PHB and PHBV show biodegradation in every aerobic and anaerobic environment defined by the ASTM standards, and can be used to make products that are compostable and that break down in soil and water.",
          `That is why a PHA-lined cup can be certified for home composting, which tests at garden temperatures over a longer window, rather than only for industrial composting at 58 °C. ${HOME_RULE}`,
        ],
      },
      {
        h: "Is PHA a plastic?",
        p: [
          "By the European Union's legal definition, yes. The Commission's Single-Use Plastics guidelines state that polymers produced by industrial fermentation, giving PHA as the example, are not natural polymers, because the polymerisation did not take place in nature. We think that is a fair line to draw and we do not argue with it.",
          "What the definition does not capture is the ending. A PHA film in a compost pile is consumed. A polyethylene or acrylic film in the same pile is not. For a cup, the question that matters is not whether the lining is called a plastic but whether anything is left of it in the finished compost. For PHA, certified as the finished cup, the answer is no.",
        ],
      },
      {
        h: "PHA as a hot-cup lining",
        p: [
          "A lining has three jobs: keep liquid out of the board, survive the drink's temperature, and heat-seal the side seam and base. PHA does all three. The grades used for cups soften at a higher temperature than a hot coffee, and they seal on standard cup-forming machines.",
          "It is more expensive than PE or PLA, both per kilogram and because volumes are smaller. That is the honest reason most cups are not lined with it, and the reason a PHA cup costs a few cents more.",
          `Our cups are paper with a PHA lining and the lid is PHA. Each SKU is certified home compostable by ${site.certifier}, as the finished item. The certificates are on the [certifications page](/certifications).`,
        ],
      },
    ],
    faq: [
      ["What does PHA stand for?", "Polyhydroxyalkanoate: a family of polyesters that bacteria make inside their cells as an energy store. PHB and PHBV are the most common members."],
      ["Is PHA home compostable?", "PHA as a material breaks down in soil, water and compost at ambient temperatures. Whether a specific cup is home compostable depends on the whole cup being tested; ours are certified per SKU."],
      ["Is PHA made from petroleum?", "No. It is grown by fermentation from carbon sources such as sugars, plant oils or methane, depending on the producer, and is the polymer as the cell made it."],
      ["Does PHA release microplastics?", "Any lining can shed particles. A PHA particle is digested by the same microbes that break down the cup; a PE or PLA particle persists. That is the difference the microplastics question turns on."],
      ["Why don't all cups use PHA?", "Cost and supply. PHA is newer at scale and costs more per kilogram than PE or PLA."],
    ],
    sources: ["narancic", "meereboer", "eu", "tuvHome", "tuvCompare"],
    related: ["pha-vs-pla", "pha-vs-water-based-coatings", "home-compostable-vs-industrial-compostable"],
    updated: "2026-11-11",
  },
  {
    slug: "what-is-pla",
    title: "What is PLA? The compostable plastic that needs a 58 °C facility",
    eyebrow: "Deep dive",
    description:
      "PLA (polylactic acid) is made from fermented plant sugar and polymerised in a reactor. Why it only composts in industrial conditions, what happens to it in a backyard bin, and what the microplastics studies on PLA cups found.",
    summary: [
      "PLA is a real plastic made from a plant feedstock. Sugar is fermented to lactic acid, which is then chemically polymerised.",
      "It passes the industrial compost standards because those tests run at 58 ± 2 °C for up to six months. Below that heat its chains do not split fast enough for microbes to work; it did not break down under home-composting conditions in the 2018 fifteen-material comparison.",
      "PLA-lined cups released more plastic particles into hot drinks than PE-lined cups in two peer-reviewed studies.",
    ],
    sections: [
      {
        h: "How PLA is made",
        p: [
          "PLA starts as starch or sugar, most often from corn in North America and sugarcane elsewhere. The sugar is fermented by bacteria into lactic acid, the same acid found in sour milk and tired muscles. From there the process is chemistry, not biology: the acid is purified, converted to its cyclic dimer (lactide), and polymerised under heat and vacuum with a tin catalyst into long chains. The result is a clear, stiff, glassy plastic that looks and handles like polystyrene.",
          "So PLA is plant-based in the sense that its carbon came from a crop, and a plastic in every other sense: a synthetic polymer made in a reactor, extruded and thermoformed on the same machines as petroleum plastics.",
        ],
      },
      {
        h: "Why it needs industrial heat",
        p: [
          "PLA does not break down the way PHA or paper does, by microbes cutting the chain directly. It breaks down in two stages. First, water has to get into the polymer and split the ester bonds by hydrolysis, which only happens at a useful rate above the material's glass transition, around 55 to 60 °C. Second, once the chains are short enough, microbes consume the fragments.",
          "An industrial composting tunnel or windrow sits at 55 to 65 °C for weeks, so stage one happens and PLA passes the standard: 90% of its carbon converted to carbon dioxide within six months at 58 ± 2 °C, disintegrated to under 2 mm within twelve weeks. A garden pile peaks lower and briefly, if at all, and spends most of its life near air temperature. Stage one barely happens. In the 2018 Environmental Science & Technology comparison, PLA on its own did not break down under home-composting conditions, and it did not meet the soil or water standards either. The authors' blunt summary was that these materials are not a cure for plastic pollution and have to be managed after use.",
          "This is why PLA products carry industrial compost logos and not home compost logos, and why a PLA cup that goes into a backyard bin, or into any stream that does not end at a hot facility, behaves like an ordinary plastic cup.",
        ],
      },
      {
        h: "PLA cups and microplastics",
        p: [
          "PLA is often sold as the safe alternative to a polyethylene-lined cup. Two recent peer-reviewed studies tested that. In Chemical Engineering Journal in 2023, eight PLA-lined and PE-lined cups were filled under typical hot-drink conditions: the PLA cups released about 3.6 times as many microplastic particles, around 22,000 per litre, and 4.2 times as many particles overall once cellulose fibres were counted. In ACS Food Science & Technology in 2026, PLA-lined cups released roughly twelve times the plastic particle mass of PE-lined cups into hot water.",
          "Neither study shows a health effect, and the authors say so. What they show is that PLA is a brittle polymer sitting at the edge of its working temperature in a hot drink, and it flakes.",
        ],
      },
      {
        h: "Where PLA makes sense, and where it does not",
        p: [
          "PLA is a reasonable choice for a closed venue that controls its waste stream and sends everything to a hot industrial composter: a stadium, a campus, a festival with a contracted hauler. In that setting it composts as designed.",
          "For a takeaway cup that leaves the building, it is a bet that the customer's city, bin and facility will all cooperate. Most of the time they do not, and the cup is treated as waste. That is the gap a home-compostable PHA lining closes: it composts in the backyard pile, the worm farm and the industrial facility alike. The comparison is laid out in [PHA vs PLA](/learn/pha-vs-pla).",
        ],
      },
    ],
    faq: [
      ["Does PLA break down at home?", "No. PLA needs sustained temperatures around 58 °C to break down. In an independent 2018 comparison it did not break down under home-composting conditions."],
      ["Is PLA a plastic?", "Yes. It is a synthetic polymer made in a reactor from fermented plant sugar. Its carbon is plant-derived; the material is a plastic."],
      ["How long does PLA take to compost?", "In an industrial facility, the standard allows up to twelve weeks to disintegrate and six months to convert 90% of its carbon to carbon dioxide at 58 ± 2 °C. Outside such a facility there is no reliable timeframe."],
      ["Can PLA be recycled?", "Not in ordinary curbside streams. It contaminates PET recycling and is sorted out as waste in most facilities."],
      ["Do PLA cups contain microplastics?", "PLA-lined cups released more plastic particles into hot drinks than PE-lined cups in peer-reviewed studies published in 2023 and 2026."],
    ],
    sources: ["narancic", "tuvCompare", "yang", "shi"],
    related: ["pha-vs-pla", "what-is-pha", "home-compostable-vs-industrial-compostable"],
    updated: "2026-11-11",
  },
  {
    slug: "water-based-coatings",
    title: "Water-based cup coatings: what the words hide",
    eyebrow: "Deep dive",
    description:
      "Aqueous, dispersion and water-based cup coatings are plastic polymers applied from water. The chemistry (acrylic, styrene-acrylic, polyolefin), the recycling case for them, the compostability case against them, and how plastic-free claims survive on a plastic film.",
    summary: [
      "A dispersion coating is polymer particles in water that fuse into a plastic film as the water dries. Manufacturers list the polymers: acrylic latex, styrene-acrylic latex, polyolefin dispersions.",
      "Their genuine advantage is recyclability: the thin film separates in a paper mill's pulper, and mills report over 90% fibre recovery.",
      "Their weakness is the opposite claim. The dried film is a synthetic plastic, EU guidance treats a coated paper cup as partly plastic, and a compost certificate can be earned while the coating itself goes untested as a minor constituent.",
    ],
    sections: [
      {
        h: "The chemistry",
        p: [
          "A barrier coating has to stop water and grease getting into paper. The traditional answer is a laminated polyethylene film about 15 to 20 microns thick. A dispersion coating replaces the film with a liquid: polymer particles a fraction of a micron across, suspended in water with stabilisers and often wax or mineral fillers. It is metered onto the board on the paper machine or a coater, the water is driven off in dryers, and the particles coalesce into a continuous film a few microns thick.",
          "What the particles are made of is public information. Dow's barrier range for cup stock and quick-serve packaging lists an acrylic copolymer latex, a styrene-acrylic latex and acid-modified polyolefin dispersions. BASF and others sell equivalent styrene-acrylic dispersions pitched as replacements for wax and PE. The European coatings trade body describes the category to regulators as polyethylene water-based suspensions and acrylic resin-based suspensions. Acrylic, styrene-acrylic and polyolefin are petrochemical plastics. The water is the solvent, not the product.",
        ],
      },
      {
        h: "The honest case for them: recycling",
        p: [
          "There is a real reason mills and brands like dispersion coatings, and it is not compostability. A thin coalesced film breaks up in a repulper far more easily than a laminated PE sheet, so coated cups can go through a standard paper mill with high fibre yield. Dow cites fibre recovery of 91% and over 99% in recycling trials for two of its cup-stock dispersions. If your cups are collected for paper recycling and your mill accepts them, a dispersion-coated cup is a better recycling feedstock than a PE-lined one.",
          "That is a recycling claim. It is not a composting claim, and it says nothing about what the film does in soil.",
        ],
      },
      {
        h: "Plastic-free, by the rules",
        p: [
          "The European Commission's guidelines on the Single-Use Plastics Directive treat a paper or board product with a plastic coating or lining applied against water or grease as a composite that is partly made of plastic, inside the Directive. The cups table in the guidelines lists empty paper-based cups with plastic lining or coating as covered. Germany's implementing FAQ, asked whether water-based or aqueous dispersions are exempt, answers that there is no general exception and it depends on the nature of the coating. The coatings industry has lodged a formal statement asking for a carve-out on the grounds that an acrylic coating is not structural; even that statement calls the coatings acrylic and PE suspensions.",
          "In Canada there is no cup-specific rule, but the Competition Bureau's 2025 guidelines on environmental claims apply to any claim a business makes: it must rest on adequate and proper testing done before the claim is made, a literally true statement can still create a misleading general impression, and a disclaimer does not cure it. Plastic-free on a cup with an acrylic film is the kind of claim those guidelines were written for, and since June 2025 competitors and the public can bring their own cases.",
        ],
      },
      {
        h: "Compostable, by the threshold",
        p: [
          "Some water-based cups carry compost logos, including home compost logos. Three routes lead there. The first is legitimate: the coating polymer is itself a compostable material (there are dispersion-coating grades built on PHA and on other certified polymers) and the finished cup was tested. The second is the material-versus-product gap: the base board was certified, the coated cup was not, and the logo moved from one to the other. The third is the threshold.",
          `Under the EN 13432 family of standards, constituents present at less than 1% of an item's mass do not have to demonstrate biodegradation, as long as the untested total stays under 5%. A coating at a few grams per square metre on cup board weighing a few hundred can sit under 1%. Whether a certifier will let a non-compostable acrylic film through on that basis is the certifier's call: ${site.certifier} says in writing that it does not accept any intentional addition of structural polymers deemed unable to biodegrade at any concentration, but the standards themselves permit it and not every scheme closes the door.`,
          "A film that was never tested, made of a polymer that does not pass the test on its own, does not disappear because the paper around it did. It breaks into flakes in the pile and leaves with the compost. That is where the plastic-free water-based cup and the microplastic in the garden bed meet.",
        ],
      },
      {
        h: "How to read a water-based cup",
        list: [
          "**Ask for the polymer by name.** Acrylic, styrene-acrylic, polyolefin: plastic film, recyclable where accepted, not compostable unless proven. PHA or another certified polymer: possibly compostable; ask for the next two things.",
          "**Ask whether the coating was tested or excused.** The certificate scope will say whether the finished cup was tested and which constituents were exempt.",
          "**Match the claim to the stream your cups actually enter.** A recyclable cup in a city with no cup recycling is waste. A home compostable cup composts wherever the customer takes it.",
        ],
        p: [`Our answer is on every SKU: paper with a PHA lining, tested as the finished cup, certified home compostable by ${site.certifier}. See the [comparison with PHA](/learn/pha-vs-water-based-coatings) for the side-by-side.`],
      },
    ],
    faq: [
      ["What is a water-based cup coating made of?", "Most are acrylic, styrene-acrylic or polyolefin polymer particles dispersed in water, which dry into a continuous plastic film on the paper. Manufacturers list these chemistries on their product pages."],
      ["Is a water-based coating plastic?", "The dried film is a synthetic polymer. The European Commission's guidelines treat paper cups with a plastic coating as partly made of plastic, and German guidance gives no general exemption to aqueous dispersions."],
      ["Are water-based cups recyclable?", "Often, yes, where cups are collected for paper recycling. The thin film separates in the pulper and mills report high fibre recovery. That is the coating's real advantage."],
      ["Are water-based cups home compostable?", "Only if the coating polymer itself was tested and passed. Compost standards allow constituents under 1% of the item to go untested, so a logo on the cup does not by itself prove the coating breaks down."],
      ["Why do water-based cups say plastic-free?", "Because the coating is applied from water rather than laminated as a sheet, and because the film is thin. Neither changes the polymer. Canadian competition law requires environmental claims to be tested and not misleading in their general impression."],
    ],
    sources: ["dow", "eupia", "eu", "seedling", "tuvCompare", "bureau"],
    related: ["pha-vs-water-based-coatings", "what-is-pha", "home-compostable-vs-industrial-compostable"],
    updated: "2026-11-11",
  },
  {
    slug: "home-compostable-vs-industrial-compostable",
    title: "Home compostable vs industrial compostable: the two logos are not the same claim",
    eyebrow: "Compostability, compared",
    description:
      "Industrial compostability is tested at 58 °C for six months. Home compostability is tested at garden temperature for twelve. What each standard requires, which certifiers issue which mark, the 1% rule on untested constituents, and why the difference decides whether a cup composts at all.",
    summary: [
      "Industrial: 90% of the carbon converted to carbon dioxide within six months at 58 ± 2 °C, disintegration under 2 mm within twelve weeks, plus heavy-metal and plant-toxicity limits. EN 13432, ISO 17088, ASTM D6400 and AS 4736 all share this core.",
      "Home: the same kind of tests at ambient temperature over a longer window. The OK compost HOME scheme came first; AS 5810, NF T 51-800 and EN 17427 were written from it.",
      "Industrial-only products should not go in a garden pile. Home-certified products can go in either.",
    ],
    sections: [
      {
        h: "What industrial compostable means",
        p: [
          "Every major industrial standard is built on the same four tests. Biodegradation: at least 90% of the material's carbon converted to carbon dioxide by microbes within six months, in compost held at 58 ± 2 °C. Disintegration: after twelve weeks in a pilot composter, no more than 10% of the material's dry weight left on a 2 mm sieve. Chemical limits: heavy metals and fluorine below set thresholds. Plant toxicity: seeds germinate and grow in the resulting compost at least 90% as well as in a control.",
          "The heat is the point. Industrial facilities reach 55 to 65 °C because of the volume of material and the way it is managed. That heat is what allows plastics like PLA to pass: the ester bonds hydrolyse above the polymer's glass transition, then microbes finish the job. A material certified to EN 13432 or ASTM D6400 has shown it can do this in a facility. It has shown nothing about a garden pile.",
        ],
      },
      {
        h: "What home compostable means",
        p: [
          `A home pile is smaller, cooler and less controlled. ${HOME_RULE} The scheme tests the same properties at ambient temperature with more time allowed: the material has to biodegrade and disintegrate in conditions a domestic pile can actually provide. ${site.certifier} describes OK compost HOME as the basis for the home-compost standards rather than a derivative of one.`,
          "The practical consequence is simple. A product carrying only an industrial mark should not go into a garden composter; it will still be there next year. A product carrying a home mark can go into a garden composter, a worm bin, a community garden pile or an industrial facility, because a material that breaks down cold also breaks down hot.",
        ],
        table: {
          head: ["", "Industrial compostable", "Home compostable"],
          rows: [
            ["Standards", "EN 13432, ISO 17088, ASTM D6400, AS 4736", "OK compost HOME scheme; AS 5810, NF T 51-800, EN 17427"],
            ["Test temperature", "58 ± 2 °C", "Ambient, garden-pile temperature"],
            ["Biodegradation", "90% of carbon to CO2 within 6 months", "90% within 12 months"],
            ["Disintegration", "Under 2 mm within 12 weeks", "Longer window at ambient"],
            ["Where it composts", "Industrial facility only", "Garden pile, worm bin, community pile, facility"],
            ["Typical materials", "PLA, some blends, coated boards", "PHA, starch, cellulose, uncoated paper"],
          ],
        },
      },
      {
        h: "The small print both share: untested constituents",
        p: [
          "The standards test a product, not every ingredient. Under the EN 13432 family, a constituent present at under 1% of the item's mass need not demonstrate biodegradation, with the untested total capped at 5%; the newer ISO and ASTM editions require components between 1% and 10 to 15% to be tested individually. That allowance exists for inks, pigments and processing aids. It is also wide enough for a thin barrier coating on a cup.",
          `Certifiers can be stricter than the standard. ${site.certifier} states that it does not accept any intentional addition of structural polymers that do not biodegrade at any concentration. When you read a compost logo, you are reading the certifier's policy as much as the standard, which is why the certifier's name on the certificate matters.`,
        ],
      },
      {
        h: "Material certificate versus product certificate",
        p: [
          "A second gap: a certificate can cover a raw material (a resin, a board) or a finished item (this cup, this lid). Converting board into a cup adds a seam, an adhesive, print and sometimes a different coating weight. A material certificate does not travel to the cup automatically. Ask whether the certificate names the finished SKU.",
          `Ours do. Each Made to Disappear SKU is certified home compostable by ${site.certifier} as the finished item, and the certificates are listed on the [certifications page](/certifications). [How to compost it](/compost) covers what to do with the cup at home.`,
        ],
      },
    ],
    faq: [
      ["What is the difference between home compostable and industrial compostable?", "Industrial compostability is tested at 58 ± 2 °C over six months; home compostability is tested at garden-pile temperature over about twelve months. Industrial-only products need a facility. Home-certified products compost in a backyard pile or a facility."],
      ["Can I put industrially compostable cups in my garden compost?", "No. They need sustained heat a garden pile does not provide. Only products certified home compostable should go in."],
      ["Which standard covers home composting?", "The OK compost HOME scheme from TÜV Austria, and the standards based on it: AS 5810 (Australia), NF T 51-800 (France) and EN 17427 (Europe)."],
      ["Is compostable the same as degradable?", "No. Compostable means the material passed a defined test in defined conditions within a set time. Degradable, and similar words, have no fixed test behind them and are often used loosely."],
      ["Does a compost logo cover every part of the product?", "Not necessarily. Constituents under 1% of the item's mass can go untested under the standards, and a certificate may cover a material rather than the finished product. Read the certificate scope."],
    ],
    sources: ["tuvCompare", "tuvHome", "seedling", "narancic"],
    related: ["pha-vs-pla", "pha-vs-water-based-coatings", "what-is-pha"],
    updated: "2026-11-11",
  },
];

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
