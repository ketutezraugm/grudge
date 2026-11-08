# Name and font check, 2026-11-08

## A) Name check

Method: WebSearch (standard), `gh search repos` (top 5), `nslookup <domain> 1.1.1.1`.
"Resolves" means the domain returned an A/AAAA record (it may still be parked).

| Name | Conflicts found (prediction, betting, forecasting, crypto, Sui) | GitHub (top hits) | <name>.app | <name>.xyz | Risk |
|---|---|---|---|---|---|
| Formline | None in prediction or crypto. Search returned only "Form" (a Solana prediction-market protocol, not the same name) and Meta's Forecast/Arena. | Five repos named Formline, none with stars, unrelated. | Resolves | Resolves | Low |
| Racecard | No prediction or crypto app. Racing Post's built-in "Predictor" is a racecard feature, not a product by this name. | `leakyhose/racecard` (3 stars, multiplayer flashcard app), `this-is-me-123/racecard`. | Resolves | Resolves | Low |
| Hindcast | Academic framework, not a company: "HINDCAST: Replaying Prediction Markets to Evaluate LLM Forecasters" (arXiv 2607.14051, July 2026). It evaluates forecasters against Polymarket, so the topic overlaps closely. Also karanb192/hindcast (Claude Code session viewer). https://www.alphaxiv.org/abs/2607.14051 | `karanb192/hindcast` (10 stars), plus weather/metocean "hindcast" repos (MET-OM, E3SM). | Resolves | Resolves | Medium (topic collision with a 2026 paper; a judge could read it as derivative) |
| Brier | Crowded in the same niche. `Noisyxl/brier` (116 stars): hash-chained prediction ledger for LLMs, sealed before answers, graded with proper scoring rules. This is nearly our concept. https://github.com/Noisyxl/brier . Also Mangaba-ai/brier (8 stars, commercial license since 5.0.0), mohdUwaish59/brier, and "Brier score" analytics tools (OpenSea ERC-8257 tool, Parallax, PillarLab). | `Noisyxl/brier` (116), `Heman10x-NGU/openJev-verdict-2.0` (305, uses Brier metric), `mverab/WorldCupBench` (15). | Resolves (Cloudflare) | Resolves (AWS) | High (direct conceptual overlap with an active repo and a Brier-scored ledger product) |
| Grudge | No prediction or crypto conflict found. Known repos: `stevekinney/grudges`, `inducer/grudge` (DG solver), `datavorous/GrudgePixel`. | Unrelated (see left). | Resolves | Resolves | Low for the name; not a new finding (the earlier check already passed it) |

Notes:
- Brier is the main risk. The name is descriptive and shared with many projects. If kept, the subtitle must carry the differentiator.
- "Hindcast" resolves at .app and .xyz, but the academic overlap is the concern, not the domain.

## B) Font check

Method: Google Fonts CSS2 endpoint (HTTP status), Google Fonts metadata JSON (`https://fonts.google.com/metadata/fonts`) for designers and weights, and specimen page fetch.

| Family | On Google Fonts | Designer / foundry | License | Weight range |
|---|---|---|---|---|
| Sofia Sans Extra Condensed | Yes (CSS2 200) | Lettersoup, Botio Nikoltchev, Ani Petrova | OFL (not in metadata, see note) | 100-900 (plus italics, and 1 and 1000 variants) |
| Sofia Sans | Yes (CSS2 200) | Lettersoup, Botio Nikoltchev, Ani Petrova | OFL (not in metadata, see note) | 100-900 (plus italics, and 1 and 1000 variants) |
| Martian Mono | Yes (CSS2 200) | Roman Shamin, Evil Martians | OFL (not in metadata, see note) | 100-800 (monospace; width axis also available) |
| Atkinson Hyperlegible Next | Yes (CSS2 200) | Braille Institute, Applied Design Works, Elliott Scott, Megan Eiswerth, Letters From Sweden | OFL (not in metadata, see note) | 200-800 (plus italics) |
| Ultra | Yes (CSS2 200) | Astigmatic | OFL (not in metadata, see note) | 400 only. This is a serif display face, not a sans. |
| Schibsted Grotesk | Yes (CSS2 200) | Bakken & Bæck, Henrik Kongsvoll | OFL (not in metadata, see note) | 400-900 (plus italics) |
| Big Shoulders Stencil | Yes (CSS2 200) | Patric King | OFL (not in metadata, see note) | 100-900 |
| Saira Stencil One | CSS2 returned 200, but the metadata list does not include it and the specimen page returned 404. Conflicting signals. | Not confirmed | Not confirmed | Single weight (400) expected; not verified |

Notes:
- The metadata JSON returned no `license` field for any family, so OFL is the Google Fonts default for these families, not a per-family check. Confirm on each specimen page before the final submission.
- Saira Stencil One is the only font with conflicting evidence. Confirm by loading the CSS URL in a browser or swapping it for another stencil face before relying on it.
- Ultra is a serif display face; if the brief asks for a sans, drop it.
